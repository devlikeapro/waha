import makeWASocket, {
  Browsers,
  Contact,
  DisconnectReason,
  extractMessageContent,
  getAggregateVotesInPollMessage,
  getContentType,
  getKeyAuthor,
  getUrlFromDirectPath,
  isJidGroup,
  isJidStatusBroadcast,
  isRealMessage,
  jidNormalizedUser,
  makeCacheableSignalKeyStore,
  NewsletterMetadata,
  normalizeMessageContent,
  PresenceData,
  proto,
  WAMessageContent,
  WAMessageKey,
} from '@adiwajshing/baileys';
import { WACallEvent } from '@adiwajshing/baileys/lib/Types/Call';
import { Label as NOWEBLabel } from '@adiwajshing/baileys/lib/Types/Label';
import { LabelAssociationType } from '@adiwajshing/baileys/lib/Types/LabelAssociation';
import { isLidUser } from '@adiwajshing/baileys/lib/WABinary/jid-utils';
import { Logger as BaileysLogger } from '@adiwajshing/baileys/node_modules/pino';
import { UnprocessableEntityException } from '@nestjs/common';
import { NowebInMemoryStore } from '@waha/core/engines/noweb/store/NowebInMemoryStore';
import { IMediaEngineProcessor } from '@waha/core/media/IMediaEngineProcessor';
import { flipObject, parseBool, splitAt } from '@waha/helpers';
import { PairingCodeResponse } from '@waha/structures/auth.dto';
import { CallData } from '@waha/structures/calls.dto';
import {
  Channel,
  ChannelRole,
  CreateChannelRequest,
  ListChannelsQuery,
} from '@waha/structures/channels.dto';
import { GetChatsQuery } from '@waha/structures/chats.dto';
import { ContactQuery, ContactRequest } from '@waha/structures/contacts.dto';
import {
  Label,
  LabelChatAssociation,
  LabelID,
} from '@waha/structures/labels.dto';
import { ReplyToMessage } from '@waha/structures/message.dto';
import {
  PollVote,
  PollVotePayload,
  WAMessageAckBody,
} from '@waha/structures/webhooks.dto';
import { waitUntil } from '@waha/utils/promiseTimeout';
import { SingleDelayedJobRunner } from '@waha/utils/SingleDelayedJobRunner';
import { SinglePeriodicJobRunner } from '@waha/utils/SinglePeriodicJobRunner';
import * as Buffer from 'buffer';
import { Agent } from 'https';
import * as lodash from 'lodash';
import { toNumber } from 'lodash';
import * as NodeCache from 'node-cache';

import {
  ChatRequest,
  CheckNumberStatusQuery,
  EditMessageRequest,
  GetMessageQuery,
  MessageContactVcardRequest,
  MessageDestination,
  MessageFileRequest,
  MessageImageRequest,
  MessageLinkPreviewRequest,
  MessageLocationRequest,
  MessagePollRequest,
  MessageReactionRequest,
  MessageReplyRequest,
  MessageStarRequest,
  MessageTextRequest,
  MessageVoiceRequest,
  SendSeenRequest,
  WANumberExistResult,
} from '../../../structures/chatting.dto';
import {
  ACK_UNKNOWN,
  SECOND,
  WAHAEngine,
  WAHAEvents,
  WAHAPresenceStatus,
  WAHASessionStatus,
  WAMessageAck,
} from '../../../structures/enums.dto';
import {
  CreateGroupRequest,
  ParticipantsRequest,
} from '../../../structures/groups.dto';
import {
  WAHAChatPresences,
  WAHAPresenceData,
} from '../../../structures/presence.dto';
import {
  WAMessage,
  WAMessageReaction,
} from '../../../structures/responses.dto';
import { MeInfo } from '../../../structures/sessions.dto';
import {
  BROADCAST_ID,
  DeleteStatusRequest,
  TextStatus,
} from '../../../structures/status.dto';
import {
  ensureSuffix,
  getChannelInviteLink,
  isNewsletter,
  WAHAInternalEvent,
  WhatsappSession,
} from '../../abc/session.abc';
import {
  AvailableInPlusVersion,
  NotImplementedByEngineError,
} from '../../exceptions';
import { toVcard } from '../../helpers';
import { createAgentProxy } from '../../helpers.proxy';
import { QR } from '../../QR';
import { NowebAuthFactoryCore } from './NowebAuthFactoryCore';
import { INowebStore } from './store/INowebStore';
import { NowebPersistentStore } from './store/NowebPersistentStore';
import { NowebStorageFactoryCore } from './store/NowebStorageFactoryCore';
import { extractMediaContent } from './utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const QRCode = require('qrcode');

export const BaileysEvents = {
  CONNECTION_UPDATE: 'connection.update',
  CREDS_UPDATE: 'creds.update',
  MESSAGES_UPDATE: 'messages.update',
  MESSAGES_UPSERT: 'messages.upsert',
  MESSAGE_RECEIPT_UPDATE: 'message-receipt.update',
  GROUPS_UPSERT: 'groups.upsert',
  PRESENCE_UPDATE: 'presence.update',
};

const PresenceStatuses = {
  unavailable: WAHAPresenceStatus.OFFLINE,
  available: WAHAPresenceStatus.ONLINE,
  composing: WAHAPresenceStatus.TYPING,
  recording: WAHAPresenceStatus.RECORDING,
  paused: WAHAPresenceStatus.PAUSED,
};
const ToEnginePresenceStatus = flipObject(PresenceStatuses);

export class WhatsappSessionNoWebCore extends WhatsappSession {
  private START_ATTEMPT_DELAY_SECONDS = 2;
  private AUTO_RESTART_AFTER_SECONDS = 28 * 60;

  engine = WAHAEngine.NOWEB;
  authFactory = new NowebAuthFactoryCore();
  storageFactory = new NowebStorageFactoryCore();
  private startDelayedJob: SingleDelayedJobRunner;
  private autoRestartJob: SinglePeriodicJobRunner;
  private msgRetryCounterCache: NodeCache;
  protected engineLogger: BaileysLogger;

  get listenConnectionEventsFromTheStart() {
    return true;
  }

  sock: ReturnType<typeof makeWASocket>;
  store: INowebStore;
  private qr: QR;

  public constructor(config) {
    super(config);
    this.qr = new QR();
    // external map to store retry counts of messages when decryption/encryption fails
    // keep this out of the socket itself, to prevent a message decryption/encryption loop across socket restarts
    this.msgRetryCounterCache = new NodeCache({
      stdTTL: 60 * 60, // 1 hour
      useClones: false,
    });

    this.engineLogger = this.loggerBuilder.child({
      name: 'NOWEBEngine',
    }) as unknown as BaileysLogger;

    // Restart job if session failed
    this.startDelayedJob = new SingleDelayedJobRunner(
      'start-engine',
      this.START_ATTEMPT_DELAY_SECONDS * SECOND,
      this.logger,
    );

    // Enable auto-restart
    const shiftSeconds = Math.floor(Math.random() * 30);
    const delay = this.AUTO_RESTART_AFTER_SECONDS + shiftSeconds;
    this.autoRestartJob = new SinglePeriodicJobRunner(
      'auto-restart',
      delay * SECOND,
      this.logger,
    );
  }

  async start() {
    this.status = WAHASessionStatus.STARTING;
    await this.buildClient();
  }

  getSocketConfig(agent, state): any {
    const fullSyncEnabled = this.sessionConfig?.noweb?.store?.fullSync || false;
    const browser = fullSyncEnabled
      ? Browsers.ubuntu('Desktop')
      : Browsers.ubuntu('Chrome');
    return {
      agent: agent,
      fetchAgent: agent,
      auth: {
        creds: state.creds,
        /** caching makes the store faster to send/recv messages */
        keys: makeCacheableSignalKeyStore(state.keys, this.engineLogger),
      },
      printQRInTerminal: false,
      browser: browser,
      logger: this.engineLogger,
      mobile: false,
      defaultQueryTimeoutMs: 120_000,
      keepAliveIntervalMs: 30_000,
      getMessage: (key) => this.getMessage(key),
      syncFullHistory: fullSyncEnabled,
      msgRetryCounterCache: this.msgRetryCounterCache,
    };
  }

  async makeSocket(): Promise<any> {
    const { state, saveCreds } = await this.authFactory.buildAuth(
      this.sessionStore,
      this.name,
    );
    const agent = this.makeAgent();
    const socketConfig = this.getSocketConfig(agent, state);
    const sock = makeWASocket(socketConfig);
    sock.ev.on('creds.update', saveCreds);
    return sock;
  }

  protected makeAgent(): Agent {
    if (!this.proxyConfig) {
      return undefined;
    }
    return createAgentProxy(this.proxyConfig);
  }

  async connectStore() {
    this.logger.debug(`Connecting store...`);
    if (!this.store) {
      this.logger.debug(`Making a new store...`);
      const storeEnabled = this.sessionConfig?.noweb?.store?.enabled || false;
      if (storeEnabled) {
        this.logger.debug('Using NowebPersistentStore');
        const storage = this.storageFactory.createStorage(
          this.sessionStore,
          this.name,
        );
        this.store = new NowebPersistentStore(
          this.loggerBuilder.child({ name: NowebPersistentStore.name }),
          storage,
        );
        await this.store.init().catch((err) => {
          this.logger.error(`Failed to initialize storage or store: ${err}`);
          this.status = WAHASessionStatus.FAILED;
          this.end();
          throw err;
        });
      } else {
        this.logger.debug('Using NowebInMemoryStore');
        this.store = new NowebInMemoryStore();
      }
    }
    this.logger.debug(`Binding store to socket...`);
    this.store.bind(this.sock.ev, this.sock);
  }

  resubscribeToKnownPresences() {
    for (const jid in this.store.presences) {
      this.sock.presenceSubscribe(jid);
    }
  }

  async buildClient() {
    this.sock = await this.makeSocket();
    this.issueMessageUpdateOnEdits();
    this.issuePresenceUpdateOnMessageUpsert();
    if (this.isDebugEnabled()) {
      this.listenEngineEventsInDebugMode();
    }
    await this.connectStore();
    if (this.listenConnectionEventsFromTheStart) {
      this.listenConnectionEvents();
      this.events.emit(WAHAInternalEvent.ENGINE_START);
    }
    this.enableAutoRestart();
  }

  private enableAutoRestart() {
    this.autoRestartJob.start(async () => {
      this.logger.info('Auto-restarting the client connection...');
      if (this.sock?.ws?.isConnecting) {
        this.logger.warn('Auto-restart skipped, the client is connecting...');
        return;
      }
      this.sock?.end(undefined);
    });
  }

  protected async getMessage(
    key: WAMessageKey,
  ): Promise<WAMessageContent | undefined> {
    if (!this.store) {
      return proto.Message.fromObject({});
    }
    const msg = await this.store.loadMessage(key.remoteJid, key.id);
    return msg?.message || undefined;
  }

  protected listenEngineEventsInDebugMode() {
    this.sock.ev.process((events) => {
      this.logger.debug({ events: events }, `NOWEB events`);
    });
  }

  private restartClient() {
    this.startDelayedJob.schedule(async () => {
      await this.buildClient();
    });
  }

  protected listenConnectionEvents() {
    this.logger.debug(`Start listening ${BaileysEvents.CONNECTION_UPDATE}...`);
    this.sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr, isNewLogin } = update;
      if (isNewLogin) {
        this.restartClient();
      } else if (connection === 'open') {
        this.qr.save('');
        this.status = WAHASessionStatus.WORKING;
        this.resubscribeToKnownPresences();
        return;
      } else if (connection === 'close') {
        const shouldReconnect =
          // @ts-ignore: Property output does not exist on type 'Error'
          lastDisconnect.error?.output?.statusCode !==
          DisconnectReason.loggedOut;
        this.qr.save('');
        // reconnect if not logged out
        if (shouldReconnect) {
          if (lastDisconnect.error) {
            this.logger.info(
              `Connection closed due to '${lastDisconnect.error}', reconnecting...`,
            );
          }
          this.restartClient();
        } else {
          this.logger.error(
            `Connection closed due to '${lastDisconnect.error}', do not reconnect the session.`,
          );
          await this.end();
          this.status = WAHASessionStatus.FAILED;
        }
      }

      // Save QR
      if (qr) {
        const url = await QRCode.toDataURL(qr);
        this.qr.save(url, qr);
        this.printQR(this.qr);
        this.status = WAHASessionStatus.SCAN_QR_CODE;
      }
    });
  }

  async stop() {
    this.status = WAHASessionStatus.STOPPED;
    this.events.removeAllListeners();
    await this.end();
    return;
  }

  private issueMessageUpdateOnEdits() {
    // Remove it after it's been merged
    // https://github.com/WhiskeySockets/Baileys/pull/855/
    this.sock.ev.on('messages.upsert', ({ messages }) => {
      for (const message of messages) {
        const content = normalizeMessageContent(message.message);
        const protocolMsg = content?.protocolMessage;
        if (
          protocolMsg !== null &&
          protocolMsg !== undefined &&
          protocolMsg.editedMessage
        ) {
          this.sock?.ev.emit('messages.update', [
            {
              key: {
                ...message.key,
                id: protocolMsg.key.id,
              },
              update: { message: protocolMsg.editedMessage },
            },
          ]);
        }
      }
    });
  }

  private issuePresenceUpdateOnMessageUpsert() {
    //
    // Fix for "typing" after sending a message
    // https://github.com/devlikeapro/waha/issues/379
    //
    this.sock.ev.on('messages.upsert', ({ messages }) => {
      const meId = this.sock?.authState?.creds?.me?.id;
      for (const message of messages) {
        if (!isRealMessage(message, meId)) {
          continue;
        }
        if (message.key.fromMe) {
          continue;
        }
        const jid = message.key.remoteJid;
        const participant = message.key.participant || jid;
        const jidPresences = this.store?.presences?.[jid];
        const participantPresence = jidPresences?.[participant];
        if (participantPresence?.lastKnownPresence === 'composing') {
          this.logger.debug(
            `Fixing presence for '${participant}' in '${jid} since it's typing`,
          );
          const presence: PresenceData = { lastKnownPresence: 'available' };
          this.sock?.ev?.emit('presence.update', {
            id: jid,
            presences: { [participant]: presence },
          });
        }
      }
    });
  }

  private async end() {
    this.autoRestartJob.stop();
    this.startDelayedJob.cancel();
    // @ts-ignore
    this.sock?.ev?.removeAllListeners();
    this.sock?.ws?.removeAllListeners();
    await this.store?.close();
    // wait until connection is not connecting to avoid error:
    // "WebSocket was closed before the connection was established"
    await waitUntil(async () => !this.sock?.ws?.isConnecting, 1_000, 10_000);
    this.sock?.end(undefined);
  }

  getSessionMeInfo(): MeInfo | null {
    const me = this.sock?.authState?.creds?.me;
    if (!me) {
      return null;
    }
    const meId = jidNormalizedUser(me.id);
    return {
      id: toCusFormat(meId),
      pushName: me.name,
    };
  }

  /**
   * START - Methods for API
   */

  /**
   * Auth methods
   */
  public getQR(): QR {
    return this.qr;
  }

  public async requestCode(
    phoneNumber: string,
    method: string,
    params?: any,
  ): Promise<PairingCodeResponse> {
    if (method) {
      const err = `NOWEB engine doesn't support any 'method', remove it and try again`;
      throw new UnprocessableEntityException(err);
    }

    if (this.status == WAHASessionStatus.STARTING) {
      this.logger.debug('Waiting for connection update...');
      await this.sock.waitForConnectionUpdate((update) => !!update.qr);
    }

    if (this.status != WAHASessionStatus.SCAN_QR_CODE) {
      const err = `Can request code only in SCAN_QR_CODE status. The current status is ${this.status}`;
      throw new UnprocessableEntityException(err);
    }

    this.logger.info(`Requesting pairing code for '${phoneNumber}'...`);
    const code: string = await this.sock.requestPairingCode(phoneNumber);
    // show it as ABCD-ABCD
    const parts = splitAt(code, 4);
    const codeRepr = parts.join('-');
    this.logger.info(`Your code: ${codeRepr}`);
    return { code: codeRepr };
  }

  async getScreenshot(): Promise<Buffer> {
    if (this.status === WAHASessionStatus.STARTING) {
      throw new UnprocessableEntityException(
        `The session is starting, please try again after few seconds`,
      );
    } else if (this.status === WAHASessionStatus.SCAN_QR_CODE) {
      return Promise.resolve(this.qr.get());
    } else if (this.status === WAHASessionStatus.WORKING) {
      throw new UnprocessableEntityException(
        `Can not get screenshot for non chrome based engine.`,
      );
    } else {
      throw new UnprocessableEntityException(`Unknown status - ${this.status}`);
    }
  }

  /**
   * Other methods
   */
  async checkNumberStatus(
    request: CheckNumberStatusQuery,
  ): Promise<WANumberExistResult> {
    const phone = request.phone.split('@')[0];
    const [result] = await this.sock.onWhatsApp(phone);
    if (!result || !result.exists) {
      return { numberExists: false };
    }
    return {
      numberExists: true,
      chatId: toCusFormat(result.jid),
    };
  }

  async sendText(request: MessageTextRequest) {
    const chatId = toJID(this.ensureSuffix(request.chatId));
    const message = {
      text: request.text,
      mentions: request.mentions?.map(toJID),
    };
    const options = await this.getMessageOptions(request);
    return this.sock.sendMessage(chatId, message, options);
  }

  public deleteMessage(chatId: string, messageId: string) {
    const jid = toJID(this.ensureSuffix(chatId));
    const key = parseMessageIdSerialized(messageId);
    return this.sock.sendMessage(jid, { delete: key });
  }

  public editMessage(
    chatId: string,
    messageId: string,
    request: EditMessageRequest,
  ) {
    const jid = toJID(this.ensureSuffix(chatId));
    const key = parseMessageIdSerialized(messageId);
    const message = {
      text: request.text,
      mentions: request.mentions?.map(toJID),
      edit: key,
    };
    return this.sock.sendMessage(jid, message);
  }

  async sendContactVCard(request: MessageContactVcardRequest) {
    const chatId = toJID(this.ensureSuffix(request.chatId));
    const contacts = request.contacts.map((el) => ({ vcard: toVcard(el) }));
    await this.sock.sendMessage(chatId, {
      contacts: {
        contacts: contacts,
      },
    });
  }

  async sendPoll(request: MessagePollRequest) {
    const requestPoll = request.poll;
    const poll = {
      name: requestPoll.name,
      values: requestPoll.options,
      selectableCount: requestPoll.multipleAnswers
        ? requestPoll.options.length
        : 1,
    };
    const message = { poll: poll };
    const remoteJid = toJID(request.chatId);
    const options = await this.getMessageOptions(request);
    const result = await this.sock.sendMessage(remoteJid, message, options);
    return this.toWAMessage(result);
  }

  async reply(request: MessageReplyRequest) {
    const options = await this.getMessageOptions(request);
    const message = {
      text: request.text,
      mentions: request.mentions?.map(toJID),
    };
    return await this.sock.sendMessage(request.chatId, message, options);
  }

  sendImage(request: MessageImageRequest) {
    throw new AvailableInPlusVersion();
  }

  sendFile(request: MessageFileRequest) {
    throw new AvailableInPlusVersion();
  }

  sendVoice(request: MessageVoiceRequest) {
    throw new AvailableInPlusVersion();
  }

  sendLocation(request: MessageLocationRequest) {
    return this.sock.sendMessage(request.chatId, {
      location: {
        degreesLatitude: request.latitude,
        degreesLongitude: request.longitude,
      },
    });
  }

  sendLinkPreview(request: MessageLinkPreviewRequest) {
    const text = `${request.title}\n${request.url}`;
    const chatId = toJID(this.ensureSuffix(request.chatId));
    return this.sock.sendMessage(chatId, { text: text });
  }

  async sendSeen(request: SendSeenRequest) {
    const key = parseMessageIdSerialized(request.messageId);
    const participant = request.participant
      ? toJID(this.ensureSuffix(request.participant))
      : undefined;
    const data = {
      remoteJid: key.remoteJid,
      id: key.id,
      participant: participant,
    };
    return this.sock.readMessages([data]);
  }

  async startTyping(request: ChatRequest) {
    return this.sock.sendPresenceUpdate('composing', request.chatId);
  }

  async stopTyping(request: ChatRequest) {
    return this.sock.sendPresenceUpdate('paused', request.chatId);
  }

  async getMessages(query: GetMessageQuery) {
    return this.getChatMessages(query.chatId, query.limit, query.downloadMedia);
  }

  public async getChatMessages(
    chatId: string,
    limit: number,
    downloadMedia: boolean,
  ) {
    downloadMedia = parseBool(downloadMedia);
    const messages = await this.store.getMessagesByJid(
      toJID(chatId),
      toNumber(limit),
    );

    const promises = [];
    for (const msg of messages) {
      promises.push(this.processIncomingMessage(msg, downloadMedia));
    }
    let result = await Promise.all(promises);
    result = result.filter(Boolean);
    return result;
  }

  async setReaction(request: MessageReactionRequest) {
    const key = parseMessageIdSerialized(request.messageId);
    const reactionMessage = {
      react: {
        text: request.reaction,
        key: key,
      },
    };
    return this.sock.sendMessage(key.remoteJid, reactionMessage);
  }

  async setStar(request: MessageStarRequest) {
    const key = parseMessageIdSerialized(request.messageId);
    await this.sock.chatModify(
      {
        star: {
          messages: [{ id: key.id, fromMe: key.fromMe }],
          star: request.star,
        },
      },
      toJID(request.chatId),
    );
  }

  /**
   * Chats methods
   */

  async getChats(query: GetChatsQuery) {
    const chats = await this.store.getChats(query.limit, query.offset);
    // Remove unreadCount, it's not ready yet
    chats.forEach((chat) => delete chat.unreadCount);
    return chats;
  }

  protected async chatsPutArchive(
    chatId: string,
    archive: boolean,
  ): Promise<any> {
    const jid = toJID(chatId);
    const messages = await this.store.getMessagesByJid(jid, 1);
    return await this.sock.chatModify(
      { archive: archive, lastMessages: messages },
      jid,
    );
  }

  public chatsArchiveChat(chatId: string): Promise<any> {
    return this.chatsPutArchive(chatId, true);
  }

  public chatsUnarchiveChat(chatId: string): Promise<any> {
    return this.chatsPutArchive(chatId, false);
  }

  /**
   * Labels methods
   */

  public async getLabels(): Promise<Label[]> {
    const labels = await this.store.getLabels();
    return labels.map(this.toLabel);
  }

  public async getChatsByLabelId(labelId: string) {
    const chats = await this.store.getChatsByLabelId(labelId);
    // Remove unreadCount, it's not ready yet
    chats.forEach((chat) => delete chat.unreadCount);
    return chats;
  }

  public async getChatLabels(chatId: string): Promise<Label[]> {
    const jid = toJID(chatId);
    const labels = await this.store.getChatLabels(jid);
    return labels.map(this.toLabel);
  }

  public async putLabelsToChat(chatId: string, labels: LabelID[]) {
    const jid = toJID(chatId);
    const labelsIds = labels.map((label) => label.id);
    const currentLabels = await this.store.getChatLabels(jid);
    const currentLabelsIds = currentLabels.map((label) => label.id);
    const addLabelsIds = lodash.difference(labelsIds, currentLabelsIds);
    const removeLabelsIds = lodash.difference(currentLabelsIds, labelsIds);
    for (const labelId of addLabelsIds) {
      await this.sock.addChatLabel(jid, labelId);
    }
    for (const labelId of removeLabelsIds) {
      await this.sock.removeChatLabel(jid, labelId);
    }
  }

  protected toLabel(label: NOWEBLabel): Label {
    const color = label.color;
    return {
      id: label.id,
      name: label.name,
      color: color,
      colorHex: Label.toHex(color),
    };
  }

  /**
   * Contacts methods
   */
  async getContact(query: ContactQuery) {
    const jid = toJID(query.contactId);
    const contact = await this.store.getContactById(jid);
    if (!contact) {
      return null;
    }
    return this.toWAContact(contact);
  }

  async getContacts() {
    const contacts = await this.store.getContacts();
    return contacts.map(this.toWAContact);
  }

  public async getContactAbout(query: ContactQuery) {
    throw new NotImplementedByEngineError();
  }

  public async getContactProfilePicture(query: ContactQuery) {
    const contact = this.ensureSuffix(query.contactId);
    const url = await this.sock.profilePictureUrl(contact, 'image');
    return { profilePictureURL: url };
  }

  public async blockContact(request: ContactRequest) {
    throw new NotImplementedByEngineError();
  }

  public async unblockContact(request: ContactRequest) {
    throw new NotImplementedByEngineError();
  }

  /**
   * Group methods
   */
  public createGroup(request: CreateGroupRequest) {
    const participants = request.participants.map(getId);
    return this.sock.groupCreate(request.name, participants);
  }

  public async getGroups() {
    return await this.sock.groupFetchAllParticipating();
  }

  public async getGroup(id) {
    const groups = await this.sock.groupFetchAllParticipating();
    return groups[id];
  }

  public async deleteGroup(id) {
    throw new NotImplementedByEngineError();
  }

  public async leaveGroup(id) {
    return this.sock.groupLeave(id);
  }

  public async setDescription(id, description) {
    return this.sock.groupUpdateDescription(id, description);
  }

  public async setSubject(id, subject) {
    return this.sock.groupUpdateSubject(id, subject);
  }

  public async getInviteCode(id): Promise<string> {
    return this.sock.groupInviteCode(id);
  }

  public async revokeInviteCode(id): Promise<string> {
    await this.sock.groupRevokeInvite(id);
    return this.sock.groupInviteCode(id);
  }

  public async getParticipants(id) {
    const groups = await this.sock.groupFetchAllParticipating();
    return groups[id].participants;
  }

  public async addParticipants(id, request: ParticipantsRequest) {
    const participants = request.participants.map(getId);
    return this.sock.groupParticipantsUpdate(id, participants, 'add');
  }

  public async removeParticipants(id, request: ParticipantsRequest) {
    const participants = request.participants.map(getId);
    return this.sock.groupParticipantsUpdate(id, participants, 'remove');
  }

  public async promoteParticipantsToAdmin(id, request: ParticipantsRequest) {
    const participants = request.participants.map(getId);
    return this.sock.groupParticipantsUpdate(id, participants, 'promote');
  }

  public async demoteParticipantsToUser(id, request: ParticipantsRequest) {
    const participants = request.participants.map(getId);
    return this.sock.groupParticipantsUpdate(id, participants, 'demote');
  }

  public async setPresence(presence: WAHAPresenceStatus, chatId?: string) {
    const enginePresence = ToEnginePresenceStatus[presence];
    if (!enginePresence) {
      throw new NotImplementedByEngineError(
        `NOWEB engine doesn't support '${presence}' presence.`,
      );
    }
    await this.sock.sendPresenceUpdate(enginePresence, chatId);
  }

  public async getPresences(): Promise<WAHAChatPresences[]> {
    const result: WAHAChatPresences[] = [];
    for (const remoteJid in this.store.presences) {
      const storedPresences = this.store.presences[remoteJid];
      result.push(this.toWahaPresences(remoteJid, storedPresences));
    }
    return result;
  }

  public async getPresence(chatId: string): Promise<WAHAChatPresences> {
    const remoteJid = toJID(chatId);
    if (!(remoteJid in this.store.presences)) {
      this.store.presences[remoteJid] = [];
      await this.sock.presenceSubscribe(remoteJid);
    }
    const result = this.store.presences[remoteJid];
    return this.toWahaPresences(remoteJid, result);
  }

  /**
   * Status methods
   */
  public sendTextStatus(status: TextStatus) {
    const message = { text: status.text };
    const JIDs = status.contacts.map(toJID);
    this.upsertMeInJIDs(JIDs);
    const options = {
      backgroundColor: status.backgroundColor,
      font: status.font,
      statusJidList: JIDs,
    };

    return this.sock.sendMessage(BROADCAST_ID, message, options);
  }

  public deleteStatus(request: DeleteStatusRequest) {
    const messageId = request.id;
    const key = parseMessageIdSerialized(messageId, true);
    key.fromMe = true;
    key.remoteJid = BROADCAST_ID;
    const JIDs = request.contacts.map(toJID);
    const options = {
      statusJidList: JIDs,
    };
    return this.sock.sendMessage(BROADCAST_ID, { delete: key }, options);
  }

  protected upsertMeInJIDs(JIDs: string[]) {
    if (!this.sock?.authState?.creds?.me) {
      return;
    }
    const myJID = jidNormalizedUser(this.sock.authState.creds.me.id);
    if (!JIDs.includes(myJID)) {
      JIDs.push(myJID);
    }
  }

  /**
   * Channels methods
   */
  protected toChannel(newsletter: NewsletterMetadata): Channel {
    const role =
      // @ts-ignore
      newsletter.viewer_metadata?.role ||
      (newsletter.viewer_metadata?.view_role as ChannelRole) ||
      ChannelRole.GUEST;
    const preview = newsletter.preview
      ? getUrlFromDirectPath(newsletter.preview)
      : null;
    const picture = newsletter.picture
      ? getUrlFromDirectPath(newsletter.picture)
      : null;
    return {
      id: newsletter.id,
      name: newsletter.name,
      description: newsletter.description,
      invite: getChannelInviteLink(newsletter.invite),
      preview: preview,
      picture: picture,
      verified: newsletter.verification === 'VERIFIED',
      role: role,
    };
  }

  public async channelsList(query: ListChannelsQuery): Promise<Channel[]> {
    const newsletters = await this.sock.newsletterSubscribed();
    let channels = newsletters.map(this.toChannel);
    if (query.role) {
      // @ts-ignore
      channels = channels.filter((channel) => channel.role === query.role);
    }
    return channels;
  }

  public async channelsCreateChannel(request: CreateChannelRequest) {
    const newsletter = await this.sock.newsletterCreate(
      request.name,
      request.description,
    );
    return this.toChannel(newsletter);
  }

  public async channelsGetChannel(id: string) {
    const newsletter = await this.sock.newsletterMetadata('jid', id);
    return this.toChannel(newsletter);
  }

  public async channelsGetChannelByInviteCode(inviteCode: string) {
    const newsletter = await this.sock.newsletterMetadata('invite', inviteCode);
    return this.toChannel(newsletter);
  }

  public async channelsDeleteChannel(id: string) {
    return await this.sock.newsletterDelete(id);
  }

  public async channelsFollowChannel(id: string): Promise<void> {
    return await this.sock.newsletterAction(id, 'follow');
  }

  public async channelsUnfollowChannel(id: string): Promise<void> {
    return await this.sock.newsletterAction(id, 'unfollow');
  }

  public async channelsMuteChannel(id: string): Promise<void> {
    return await this.sock.newsletterAction(id, 'mute');
  }

  public async channelsUnmuteChannel(id: string): Promise<void> {
    return await this.sock.newsletterAction(id, 'unmute');
  }

  /**
   * END - Methods for API
   */

  subscribeEngineEvent(event, handler): boolean {
    switch (event) {
      case WAHAEvents.MESSAGE:
        this.sock.ev.on('messages.upsert', ({ messages }) => {
          this.handleIncomingMessages(messages, handler, false);
        });
        return true;
      case WAHAEvents.MESSAGE_REACTION:
        this.sock.ev.on('messages.upsert', ({ messages }) => {
          const reactions = this.processMessageReaction(messages);
          reactions.map(handler);
        });
        return true;
      case WAHAEvents.MESSAGE_ANY:
        this.sock.ev.on('messages.upsert', ({ messages }) =>
          this.handleIncomingMessages(messages, handler, true),
        );
        return true;
      case WAHAEvents.MESSAGE_ACK: // Direct message ack
        this.sock.ev.on('messages.update', (events) => {
          events
            .filter(isMine)
            .filter(isAckUpdateMessageEvent)
            .map(this.convertMessageUpdateToMessageAck)
            .forEach(handler);
        });
        // Group message ack
        this.sock.ev.on('message-receipt.update', (events) => {
          events
            .filter(isMine)
            .map(this.convertMessageReceiptUpdateToMessageAck)
            .forEach(handler);
        });
        return true;
      case WAHAEvents.STATE_CHANGE:
        this.sock.ev.on('connection.update', handler);
        return true;
      case WAHAEvents.GROUP_JOIN:
        this.sock.ev.on('groups.upsert', handler);
        return true;
      case WAHAEvents.PRESENCE_UPDATE:
        this.sock.ev.on('presence.update', (data) =>
          handler(this.toWahaPresences(data.id, data.presences)),
        );
        return true;
      case WAHAEvents.POLL_VOTE:
        this.sock.ev.on('messages.update', (events) => {
          events.forEach((event) =>
            this.handleMessagesUpdatePollVote(event, handler),
          );
        });
        return true;
      case WAHAEvents.POLL_VOTE_FAILED:
        this.sock.ev.on('messages.upsert', ({ messages }) => {
          messages.forEach((message) =>
            this.handleMessageUpsertPollVoteFailed(message, handler),
          );
        });
        return true;
      case WAHAEvents.CALL_RECEIVED:
        this.sock.ev.on('call', (calls: WACallEvent[]) => {
          calls = lodash.filter(calls, { status: 'offer' });
          for (const call of calls) {
            const body = this.toCallData(call);
            handler(body);
          }
        });
        return true;
      case WAHAEvents.CALL_ACCEPTED:
        this.sock.ev.on('call', (calls: WACallEvent[]) => {
          calls = lodash.filter(calls, { status: 'accept' });
          for (const call of calls) {
            const body = this.toCallData(call);
            handler(body);
          }
        });
        return true;
      case WAHAEvents.CALL_REJECTED:
        this.sock.ev.on('call', (calls: WACallEvent[]) => {
          const acceptCalls = lodash.filter(calls, { status: 'accept' });
          if (acceptCalls.length > 0) {
            // We got two events when accepting calls - reject and accept
            // Like for each device
            // So if we see accepted call - ignore rejected
            return;
          }

          calls = lodash.filter(calls, { status: 'reject' });
          for (const call of calls) {
            const body = this.toCallData(call);
            if (body.isGroup == null) {
              // We get two "reject" events, one with null property, ignore it
              return;
            }
            handler(body);
          }
        });
        return true;
      case WAHAEvents.LABEL_UPSERT:
        this.sock.ev.on('labels.edit', (data: NOWEBLabel) => {
          if (data.deleted) {
            return;
          }
          const body = this.toLabel(data);
          handler(body);
        });
        return true;
      case WAHAEvents.LABEL_DELETED:
        this.sock.ev.on('labels.edit', (data: NOWEBLabel) => {
          if (!data.deleted) {
            return;
          }
          const body = this.toLabel(data);
          handler(body);
        });
        return true;
      case WAHAEvents.LABEL_CHAT_ADDED:
        this.sock.ev.on('labels.association', async ({ association, type }) => {
          if (type !== 'add') {
            return;
          }
          if (association.type !== LabelAssociationType.Chat) {
            return;
          }
          const labelData = await this.store.getLabelById(association.labelId);
          const label = labelData ? this.toLabel(labelData) : null;
          const body: LabelChatAssociation = {
            labelId: association.labelId,
            chatId: toCusFormat(association.chatId),
            label: label,
          };
          handler(body);
        });
        return true;
      case WAHAEvents.LABEL_CHAT_DELETED:
        this.sock.ev.on('labels.association', async ({ association, type }) => {
          if (type !== 'remove') {
            return;
          }
          if (association.type !== LabelAssociationType.Chat) {
            return;
          }
          const labelData = await this.store.getLabelById(association.labelId);
          const label = labelData ? this.toLabel(labelData) : null;
          const body: LabelChatAssociation = {
            labelId: association.labelId,
            chatId: toCusFormat(association.chatId),
            label: label,
          };
          handler(body);
        });
        return true;
      default:
        return false;
    }
  }

  private handleIncomingMessages(messages, handler, includeFromMe) {
    for (const message of messages) {
      // Do not include my messages
      if (!includeFromMe && message.key.fromMe) {
        continue;
      }
      this.processIncomingMessage(message).then((msg) => {
        if (!msg) {
          return;
        }
        handler(msg);
      });
    }
  }

  private processMessageReaction(messages: any[]): WAMessageReaction[] {
    const reactions = [];
    for (const message of messages) {
      if (!message) return [];
      if (!message.message) return [];
      if (!message.message.reactionMessage) return [];

      const id = buildMessageId(message.key);
      const fromToParticipant = getFromToParticipant(message);
      const reactionMessage = message.message.reactionMessage;
      const messageId = buildMessageId(reactionMessage.key);
      const reaction: WAMessageReaction = {
        id: id,
        timestamp: message.messageTimestamp,
        from: toCusFormat(fromToParticipant.from),
        fromMe: message.key.fromMe,
        to: toCusFormat(fromToParticipant.to),
        participant: toCusFormat(fromToParticipant.participant),
        reaction: {
          text: reactionMessage.text,
          messageId: messageId,
        },
      };
      reactions.push(reaction);
    }
    return reactions;
  }

  private async processIncomingMessage(message, downloadMedia = true) {
    // if there is no text or media message
    if (!message) return;
    if (!message.message) return;
    // Ignore reactions, we have dedicated handler for that
    if (message.message.reactionMessage) return;
    // Ignore poll votes, we have dedicated handler for that
    if (message.message.pollUpdateMessage) return;

    if (downloadMedia) {
      try {
        message = await this.downloadMedia(message);
      } catch (e) {
        this.logger.error('Failed when tried to download media for a message');
        this.logger.error(e, e.stack);
      }
    }

    try {
      return await this.toWAMessage(message);
    } catch (error) {
      this.logger.error('Failed to process incoming message');
      this.logger.error(error);
      console.trace(error);
      return null;
    }
  }

  protected toWAMessage(message): Promise<WAMessage> {
    const fromToParticipant = getFromToParticipant(message);
    const id = buildMessageId(message.key);
    const body = this.extractBody(message.message);
    const replyTo = this.extractReplyTo(message.message);
    const ack = message.ack || message.status - 1;
    return Promise.resolve({
      id: id,
      timestamp: message.messageTimestamp,
      from: toCusFormat(fromToParticipant.from),
      fromMe: message.key.fromMe,
      body: body,
      to: toCusFormat(fromToParticipant.to),
      participant: toCusFormat(fromToParticipant.participant),
      // Media
      hasMedia: Boolean(message.media),
      media: message.media,
      mediaUrl: message.media?.url,
      // @ts-ignore
      ack: ack,
      // @ts-ignore
      ackName: WAMessageAck[ack] || ACK_UNKNOWN,
      location: message.location,
      vCards: message.vCards,
      replyTo: replyTo,
      _data: message,
    });
  }

  protected extractBody(message): string | null {
    if (!message) {
      return null;
    }
    let body = message.conversation;
    if (!body) {
      // Some of the messages have no conversation, but instead have text in extendedTextMessage
      // https://github.com/devlikeapro/waha/issues/90
      body = message.extendedTextMessage?.text;
    }
    if (!body) {
      // Populate from caption
      const mediaContent = extractMediaContent(message);
      // @ts-ignore - AudioMessage doesn't have caption field
      body = mediaContent?.caption;
    }
    return body;
  }

  protected extractReplyTo(message): ReplyToMessage | null {
    const msgType = getContentType(message);
    const contextInfo = message[msgType]?.contextInfo;
    if (!contextInfo) {
      return null;
    }
    const quotedMessage = contextInfo.quotedMessage;
    const body = this.extractBody(quotedMessage);
    return {
      id: contextInfo.stanzaId,
      participant: contextInfo.participant,
      body: body,
    };
  }

  protected toWAContact(contact: Contact) {
    contact.id = toCusFormat(contact.id);
    // @ts-ignore
    contact.pushname = contact.notify;
    // @ts-ignore
    delete contact.notify;
    return contact;
  }

  protected convertMessageUpdateToMessageAck(event): WAMessageAckBody {
    const message = event;
    const fromToParticipant = getFromToParticipant(message);
    const id = buildMessageId(message.key);
    const ack = message.update.status - 1;
    const body: WAMessageAckBody = {
      id: id,
      from: toCusFormat(fromToParticipant.from),
      to: toCusFormat(fromToParticipant.to),
      participant: toCusFormat(fromToParticipant.participant),
      fromMe: message.key.fromMe,
      ack: ack,
      ackName: WAMessageAck[ack] || ACK_UNKNOWN,
    };
    return body;
  }

  protected convertMessageReceiptUpdateToMessageAck(event): WAMessageAckBody {
    const fromToParticipant = getFromToParticipant(event);
    const id = buildMessageId(event.key);

    const receipt = event.receipt;
    let ack;
    if (receipt.receiptTimestamp) {
      ack = WAMessageAck.SERVER;
    } else if (receipt.playedTimestamp) {
      ack = WAMessageAck.PLAYED;
    } else if (receipt.readTimestamp) {
      ack = WAMessageAck.READ;
    }
    const body: WAMessageAckBody = {
      id: id,
      from: toCusFormat(fromToParticipant.from),
      to: toCusFormat(fromToParticipant.to),
      participant: toCusFormat(fromToParticipant.participant),
      fromMe: event.key.fromMe,
      ack: ack,
      ackName: WAMessageAck[ack] || ACK_UNKNOWN,
    };
    return body;
  }

  protected async handleMessagesUpdatePollVote(event, handler) {
    const { key, update } = event;
    const pollUpdates = update?.pollUpdates;
    if (!pollUpdates) {
      return;
    }

    const pollCreationMessageKey = key;
    const pollCreationMessage = await this.getMessage(key);
    // Handle updates one by one, so we can get Vote Message for the specific vote
    for (const pollUpdate of pollUpdates) {
      const votes = getAggregateVotesInPollMessage({
        message: pollCreationMessage,
        pollUpdates: [pollUpdate],
      });

      // Get selected options for the author
      const selectedOptions = [];
      for (const voteAggregation of votes) {
        for (const voter of voteAggregation.voters) {
          if (voter === getKeyAuthor(pollUpdate.pollUpdateMessageKey)) {
            selectedOptions.push(voteAggregation.name);
          }
        }
      }

      // Build payload and call the handler
      const voteDestination = getDestination(pollUpdate.pollUpdateMessageKey);
      const pollVote: PollVote = {
        ...voteDestination,
        selectedOptions: selectedOptions,
        timestamp: pollUpdate.senderTimestampMs,
      };
      const payload: PollVotePayload = {
        vote: pollVote,
        poll: getDestination(pollCreationMessageKey),
      };
      handler(payload);
    }
  }

  protected async handleMessageUpsertPollVoteFailed(message, handler) {
    const pollUpdateMessage = message.message?.pollUpdateMessage;
    if (!pollUpdateMessage) {
      return;
    }
    const pollCreationMessageKey = pollUpdateMessage.pollCreationMessageKey;
    const pollCreationMessage = await this.getMessage(pollCreationMessageKey);
    if (pollCreationMessage) {
      // We found message, so later the engine will issue a message.update message
      return;
    }

    // We didn't find the creation message, so send failed one
    const pollUpdateMessageKey = message.key;
    const voteDestination = getDestination(pollUpdateMessageKey);
    const pollVote: PollVote = {
      ...voteDestination,
      selectedOptions: [],
      // change to below line when the PR merged, so we have the same timestamps
      // https://github.com/WhiskeySockets/Baileys/pull/348
      // Or without toNumber() - it depends on the PR above
      // timestamp: pollUpdateMessage.senderTimestampMs.toNumber()
      timestamp: message.messageTimestamp,
    };
    const payload: PollVotePayload = {
      vote: pollVote,
      poll: getDestination(pollCreationMessageKey),
    };
    handler(payload);
  }

  private toCallData(call: WACallEvent): CallData {
    // call.date can be either string 2024-07-18T09:45:55.000Z or Date
    const date = new Date(call.date);
    // convert to timestamp in seconds
    const timestamp: number = date.getTime() / 1000;
    return {
      id: call.id,
      from: toCusFormat(call.from),
      timestamp: timestamp,
      isVideo: call.isVideo,
      isGroup: call.isGroup,
    };
  }

  private toWahaPresences(
    remoteJid: string,
    storedPresences: { [participant: string]: PresenceData },
  ): WAHAChatPresences {
    const presences: WAHAPresenceData[] = [];
    for (const participant in storedPresences) {
      const data: PresenceData = storedPresences[participant];
      const lastKnownPresence = lodash.get(
        PresenceStatuses,
        data.lastKnownPresence,
        data.lastKnownPresence,
      );
      const presence: WAHAPresenceData = {
        participant: toCusFormat(participant),
        // @ts-ignore
        lastKnownPresence: lastKnownPresence,
        lastSeen: data.lastSeen || null,
      };
      presences.push(presence);
    }
    const chatId = toCusFormat(remoteJid);
    return { id: chatId, presences: presences };
  }

  protected downloadMedia(message) {
    const processor = new EngineMediaProcessor(this);
    return this.mediaManager.processMedia(processor, message, this.name);
  }

  protected async getMessageOptions(request: any): Promise<any> {
    let quoted;
    if (request.reply_to) {
      const key = parseMessageIdSerialized(request.reply_to, true);
      quoted = await this.store.loadMessage(toJID(request.chatId), key.id);
    }

    return {
      quoted: quoted,
    };
  }
}

export class EngineMediaProcessor implements IMediaEngineProcessor<any> {
  constructor(public session: WhatsappSessionNoWebCore) {}

  hasMedia(message: any): boolean {
    return Boolean(extractMediaContent(message.message));
  }

  getMessageId(message: any): string {
    return '';
  }

  getMimetype(message: any): string {
    return '';
  }

  getMediaBuffer(message: any): Promise<Buffer | null> {
    return Promise.resolve(undefined);
  }

  getFilename(message: any): string | null {
    const content = extractMessageContent(message.message);
    return content?.documentMessage?.fileName || null;
  }
}

/**
 * Convert from 11111111111@s.whatsapp.net to 11111111111@c.us
 */
function toCusFormat(remoteJid) {
  if (!remoteJid) {
    return remoteJid;
  }
  if (isJidGroup(remoteJid)) {
    return remoteJid;
  }
  if (isJidStatusBroadcast(remoteJid)) {
    return remoteJid;
  }
  if (isLidUser(remoteJid)) {
    return remoteJid;
  }
  if (isNewsletter(remoteJid)) {
    return remoteJid;
  }
  if (!remoteJid) {
    return;
  }
  if (remoteJid == 'me') {
    return remoteJid;
  }
  const number = remoteJid.split('@')[0];
  return ensureSuffix(number);
}

/**
 * Convert from 11111111111@c.us to 11111111111@s.whatsapp.net
 * @param chatId
 */
export function toJID(chatId) {
  if (isJidGroup(chatId)) {
    return chatId;
  }
  if (isJidStatusBroadcast(chatId)) {
    return chatId;
  }
  if (isNewsletter(chatId)) {
    return chatId;
  }
  const number = chatId.split('@')[0];
  return number + '@s.whatsapp.net';
}

/**
 * Build WAHA message id from engine one
 * {id: "AAA", remoteJid: "11111111111@s.whatsapp.net", "fromMe": false}
 * false_11111111111@c.us_AA
 */
function buildMessageId({ id, remoteJid, fromMe }) {
  const chatId = toCusFormat(remoteJid);
  return `${fromMe || false}_${chatId}_${id}`;
}

/**
 * Parse message id from WAHA to engine
 * false_11111111111@c.us_AAA
 * {id: "AAA", remoteJid: "11111111111@s.whatsapp.net", "fromMe": false}
 */
function parseMessageIdSerialized(messageId: string, soft: boolean = false) {
  if (!messageId.includes('_') && soft) {
    return { id: messageId };
  }

  const parts = messageId.split('_');
  if (parts.length != 3) {
    throw new Error(
      'Message id be in format false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA',
    );
  }
  const fromMe = parts[0] == 'true';
  const chatId = parts[1];
  const remoteJid = toJID(chatId);
  const id = parts[2];
  return { fromMe: fromMe, id: id, remoteJid: remoteJid };
}

function getId(object) {
  return object.id;
}

function isMine(message) {
  return message?.key?.fromMe;
}

function isNotMine(message) {
  return !message?.key?.fromMe;
}

function isAckUpdateMessageEvent(event) {
  return event?.update.status != null;
}

function getFromToParticipant(message) {
  const isGroupMessage = Boolean(message.key.participant);
  let participant: string;
  let to: string;
  if (isGroupMessage) {
    participant = message.key.participant;
    to = message.key.remoteJid;
  }
  const from = message.key.remoteJid;
  return {
    from: from,
    to: to,
    participant: participant,
  };
}

function getTo(key, meId = undefined) {
  // For group - always to group JID
  const isGroupMessage = Boolean(key.participant);
  if (isGroupMessage) {
    return key.remoteJid;
  }
  if (key.fromMe) {
    return key.remoteJid;
  }
  return meId || 'me';
}

function getFrom(key, meId) {
  // For group - always from participant
  const isGroupMessage = Boolean(key.participant);
  if (isGroupMessage) {
    return key.participant;
  }
  if (key.fromMe) {
    return meId || 'me';
  }
  return key.remoteJid;
}

function getDestination(key, meId = undefined): MessageDestination {
  return {
    id: buildMessageId(key),
    to: toCusFormat(getTo(key, meId)),
    from: toCusFormat(getFrom(key, meId)),
    fromMe: key.fromMe,
  };
}
