import makeWASocket, {
  Browsers,
  DisconnectReason,
  getAggregateVotesInPollMessage,
  getKeyAuthor,
  isJidGroup,
  jidNormalizedUser,
  makeInMemoryStore,
  PresenceData,
  proto,
  useMultiFileAuthState,
  WAMessageContent,
  WAMessageKey,
} from '@adiwajshing/baileys';
import { UnprocessableEntityException } from '@nestjs/common';
import * as Buffer from 'buffer';
import * as fs from 'fs/promises';
import { Agent } from 'https';
import * as lodash from 'lodash';
import { PairingCodeResponse } from 'src/structures/auth.dto';

import { flipObject, splitAt } from '../helpers';
import {
  ChatRequest,
  CheckNumberStatusQuery,
  MessageDestination,
  MessageFileRequest,
  MessageImageRequest,
  MessageLinkPreviewRequest,
  MessageLocationRequest,
  MessagePollRequest,
  MessageReactionRequest,
  MessageReplyRequest,
  MessageTextRequest,
  MessageVoiceRequest,
  SendSeenRequest,
  WANumberExistResult,
} from '../structures/chatting.dto';
import { ContactQuery, ContactRequest } from '../structures/contacts.dto';
import {
  ACK_UNKNOWN,
  SECOND,
  WAHAEngine,
  WAHAEvents,
  WAHAPresenceStatus,
  WAHASessionStatus,
  WAMessageAck,
} from '../structures/enums.dto';
import {
  CreateGroupRequest,
  ParticipantsRequest,
} from '../structures/groups.dto';
import {
  WAHAChatPresences,
  WAHAPresenceData,
} from '../structures/presence.dto';
import { WAMessage } from '../structures/responses.dto';
import { MeInfo } from '../structures/sessions.dto';
import { BROADCAST_ID, TextStatus } from '../structures/status.dto';
import {
  PollVote,
  PollVotePayload,
  WAMessageAckBody,
} from '../structures/webhooks.dto';
import { IEngineMediaProcessor } from './abc/media.abc';
import {
  ensureSuffix,
  WAHAInternalEvent,
  WhatsappSession,
} from './abc/session.abc';
import {
  AvailableInPlusVersion,
  NotImplementedByEngineError,
} from './exceptions';
import { createAgentProxy } from './helpers.proxy';
import { QR } from './QR';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const QRCode = require('qrcode');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require('pino')();

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
  engine = WAHAEngine.NOWEB;

  sock: any;
  store: any;
  private qr: QR;

  public constructor(config) {
    super(config);
    this.qr = new QR();
  }

  start() {
    this.status = WAHASessionStatus.STARTING;
    this.buildClient();
  }

  getSocketConfig(agent, state) {
    return {
      agent: agent,
      fetchAgent: agent,
      auth: state,
      printQRInTerminal: true,
      browser: Browsers.macOS('Chrome'),
      logger: logger,
      mobile: false,
      defaultQueryTimeoutMs: undefined,
      getMessage: (key) => this.getMessage(key),
    };
  }

  async makeSocket() {
    const authFolder = this.sessionStorage.getFolderPath(this.name);
    await fs.mkdir(authFolder, { recursive: true });
    const { state, saveCreds } = await useMultiFileAuthState(authFolder);
    const agent = this.makeAgent();
    const socketConfig = this.getSocketConfig(agent, state);
    const sock: any = makeWASocket(socketConfig);
    sock.ev.on(BaileysEvents.CREDS_UPDATE, saveCreds);
    return sock;
  }

  protected makeAgent(): Agent {
    if (!this.proxyConfig) {
      return undefined;
    }
    return createAgentProxy(this.proxyConfig);
  }

  connectStore() {
    this.log.debug(`Connecting store...`);
    if (!this.store) {
      this.log.debug(`Making a new auth store...`);
      this.store = makeInMemoryStore({});
    }
    this.log.debug(`Binding store to socket...`);
    this.store.bind(this.sock.ev);
  }

  resubscribeToKnownPresences() {
    for (const jid in this.store.presences) {
      this.sock.presenceSubscribe(jid);
    }
  }

  async buildClient() {
    this.sock = await this.makeSocket();
    this.connectStore();
    if (this.isDebugEnabled()) {
      this.listenEngineEventsInDebugMode();
    }
    this.listenConnectionEvents();
    this.events.emit(WAHAInternalEvent.ENGINE_START);
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
      this.log.debug(`Received NOWEB events`, events);
    });
  }

  protected listenConnectionEvents() {
    this.log.debug(`Start listening ${BaileysEvents.CONNECTION_UPDATE}...`);
    this.sock.ev.on(BaileysEvents.CONNECTION_UPDATE, async (update) => {
      const { connection, lastDisconnect, qr } = update;
      if (connection === 'open') {
        this.qr.save('');
        this.status = WAHASessionStatus.WORKING;
        this.resubscribeToKnownPresences();
        return;
      } else if (connection === 'close') {
        const shouldReconnect =
          lastDisconnect.error?.output?.statusCode !==
          DisconnectReason.loggedOut;
        this.log.error(
          'connection closed due to ',
          lastDisconnect.error,
          ', reconnecting ',
          shouldReconnect,
        );
        this.qr.save('');
        // reconnect if not logged out
        if (shouldReconnect) {
          setTimeout(() => this.buildClient(), 2 * SECOND);
        } else {
          this.status = WAHASessionStatus.FAILED;
        }
      }

      // Save QR
      if (qr) {
        this.status = WAHASessionStatus.SCAN_QR_CODE;
        QRCode.toDataURL(qr).then((url) => {
          this.qr.save(url, qr);
        });
      }
    });
  }

  async stop() {
    this.sock.ev.removeAllListeners();
    this.sock.ws.removeAllListeners();
    this.sock.ws.close();
    this.status = WAHASessionStatus.STOPPED;
    return;
  }

  async getSessionMeInfo(): Promise<MeInfo | null> {
    const me = this.sock.authState?.creds?.me;
    if (!me) {
      return null;
    }
    const meId = jidNormalizedUser(me.id);
    const meInfo: MeInfo = {
      id: toCusFormat(meId),
      pushName: me.name,
    };
    return meInfo;
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
  ): Promise<PairingCodeResponse> {
    if (method) {
      const err = `NOWEB engine doesn't support any 'method', remove it and try again`;
      throw new UnprocessableEntityException(err);
    }

    if (this.status == WAHASessionStatus.STARTING) {
      this.log.debug('Waiting for connection update...');
      await this.sock.waitForConnectionUpdate((update) => !!update.qr);
    }

    if (this.status != WAHASessionStatus.SCAN_QR_CODE) {
      const err = `Can request code only in SCAN_QR_CODE status. The current status is ${this.status}`;
      throw new UnprocessableEntityException(err);
    }

    this.log.log(`Requesting pairing code for '${phoneNumber}'...`);
    const code: string = await this.sock.requestPairingCode(phoneNumber);
    // show it as ABCD-ABCD
    const parts = splitAt(code, 4);
    const codeRepr = parts.join('-');
    this.log.log(`Your code: ${codeRepr}`);
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

  sendText(request: MessageTextRequest) {
    const chatId = this.ensureSuffix(request.chatId);
    const message = {
      text: request.text,
      mentions: request.mentions?.map(toJID),
    };
    return this.sock.sendMessage(chatId, message);
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
    const result = await this.sock.sendMessage(remoteJid, message);
    return this.toWAMessage(result);
  }

  async reply(request: MessageReplyRequest) {
    const { id } = parseMessageId(request.reply_to);
    const quotedMessage = await this.store.loadMessage(
      toJID(request.chatId),
      id,
    );
    const message = {
      text: request.text,
      mentions: request.mentions?.map(toJID),
    };
    return await this.sock.sendMessage(request.chatId, message, {
      quoted: quotedMessage,
    });
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
    const chatId = this.ensureSuffix(request.chatId);
    return this.sock.sendMessage(chatId, { text: text });
  }

  async sendSeen(request: SendSeenRequest) {
    const key = parseMessageId(request.messageId);
    const data = {
      remoteJid: key.remoteJid,
      id: key.id,
      participant: request.participant,
    };
    return this.sock.readMessages([data]);
  }

  async startTyping(request: ChatRequest) {
    return this.sock.sendPresenceUpdate('composing', request.chatId);
  }

  async stopTyping(request: ChatRequest) {
    return this.sock.sendPresenceUpdate('paused', request.chatId);
  }

  async setReaction(request: MessageReactionRequest) {
    const key = parseMessageId(request.messageId);
    const reactionMessage = {
      react: {
        text: request.reaction,
        key: key,
      },
    };
    return this.sock.sendMessage(key.remoteJid, reactionMessage);
  }

  /**
   * Contacts methods
   */
  getContact(query: ContactQuery) {
    throw new NotImplementedByEngineError();
  }

  getContacts() {
    throw new NotImplementedByEngineError();
  }

  public async getContactAbout(query: ContactQuery) {
    throw new NotImplementedByEngineError();
  }

  public async getContactProfilePicture(query: ContactQuery) {
    throw new NotImplementedByEngineError();
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
    await this.subscribePresence(chatId);
    const remoteJid = toJID(chatId);
    const storedPresences = this.store.presences[remoteJid];
    return this.toWahaPresences(remoteJid, storedPresences || []);
  }

  public async subscribePresence(chatId: string): Promise<void> {
    const remoteJid = toJID(chatId);
    if (this.store.presences[remoteJid]) {
      return;
    }
    // Have no info - subscribe to listen for events
    await this.sock.presenceSubscribe(remoteJid);
    return;
  }

  /**
   * Status methods
   */
  public sendTextStatus(status: TextStatus) {
    const message = { text: status.text };
    const options = {
      backgroundColor: status.backgroundColor,
      font: status.font,
      statusJidList: status.contacts.map(toJID),
    };
    return this.sock.sendMessage(BROADCAST_ID, message, options);
  }

  /**
   * END - Methods for API
   */

  subscribeEngineEvent(event, handler): boolean {
    switch (event) {
      case WAHAEvents.MESSAGE:
        this.sock.ev.on(BaileysEvents.MESSAGES_UPSERT, ({ messages }) => {
          this.handleIncomingMessages(messages, handler, false);
        });
        return true;
      case WAHAEvents.MESSAGE_ANY:
        this.sock.ev.on(BaileysEvents.MESSAGES_UPSERT, ({ messages }) =>
          this.handleIncomingMessages(messages, handler, true),
        );
        return true;
      case WAHAEvents.MESSAGE_ACK: // Direct message ack
        this.sock.ev.on(BaileysEvents.MESSAGES_UPDATE, (events) => {
          events
            .filter(isMine)
            .filter(isAckUpdateMessageEvent)
            .map(this.convertMessageUpdateToMessageAck)
            .forEach(handler);
        });
        // Group message ack
        this.sock.ev.on(BaileysEvents.MESSAGE_RECEIPT_UPDATE, (events) => {
          events
            .filter(isMine)
            .map(this.convertMessageReceiptUpdateToMessageAck)
            .forEach(handler);
        });
        return true;
      case WAHAEvents.STATE_CHANGE:
        this.sock.ev.on(BaileysEvents.CONNECTION_UPDATE, handler);
        return true;
      case WAHAEvents.GROUP_JOIN:
        this.sock.ev.on(BaileysEvents.GROUPS_UPSERT, handler);
        return true;
      case WAHAEvents.PRESENCE_UPDATE:
        this.sock.ev.on(BaileysEvents.PRESENCE_UPDATE, (data) =>
          handler(this.toWahaPresences(data.id, data.presences)),
        );
        return true;
      case WAHAEvents.POLL_VOTE:
        this.sock.ev.on(BaileysEvents.MESSAGES_UPDATE, (events) => {
          events.forEach((event) =>
            this.handleMessagesUpdatePollVote(event, handler),
          );
        });
        return true;
      case WAHAEvents.POLL_VOTE_FAILED:
        this.sock.ev.on(BaileysEvents.MESSAGES_UPSERT, ({ messages }) => {
          messages.forEach((message) =>
            this.handleMessageUpsertPollVoteFailed(message, handler),
          );
        });
        return true;
      default:
        return false;
    }
  }

  private handleIncomingMessages(messages, handler, includeFromMe) {
    for (const message of messages) {
      // if there is no text or media message
      if (!message) return;
      if (!message.message) return;
      // Ignore poll votes, we have dedicated handler for that
      if (message.message.pollUpdateMessage) return;
      // Do not include my messages
      if (!includeFromMe && message.key.fromMe) {
        continue;
      }
      this.processIncomingMessage(message).then(handler);
    }
  }

  private processIncomingMessage(message) {
    return this.downloadMedia(message)
      .then(this.toWAMessage)
      .catch((error) => {
        this.log.error('Failed to process incoming message');
        this.log.error(error);
        console.trace(error);
      });
  }

  protected toWAMessage(message): Promise<WAMessage> {
    const fromToParticipant = getFromToParticipant(message);
    const id = buildMessageId(message.key);
    let body = message.message.conversation;
    if (!body) {
      // Some of the messages have no conversation, but instead have text in extendedTextMessage
      // https://github.com/devlikeapro/whatsapp-http-api/issues/90
      body = message.message.extendedTextMessage?.text;
    }
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
      ack: message.ack,
      // @ts-ignore
      ackName: WAMessageAck[message.ack] || ACK_UNKNOWN,
      location: message.location,
      vCards: message.vCards,
      _data: message,
    });
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

  private toWahaPresences(
    remoteJid,
    storedPresences: PresenceData[],
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
    return this.mediaManager.processMedia(processor, message);
  }
}

export class EngineMediaProcessor implements IEngineMediaProcessor<any> {
  constructor(public session: WhatsappSessionNoWebCore) {}

  hasMedia(message: any): boolean {
    const messageType = Object.keys(message.message)[0];
    const hasMedia =
      messageType === 'imageMessage' ||
      messageType == 'audioMessage' ||
      messageType == 'documentMessage' ||
      messageType == 'videoMessage';
    return hasMedia;
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
    return message.message?.documentMessage?.fileName || null;
  }
}

/**
 * Convert from 11111111111@s.whatsapp.net to 11111111111@c.us
 */
function toCusFormat(remoteJid) {
  if (isJidGroup(remoteJid)) {
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
function parseMessageId(messageId) {
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
