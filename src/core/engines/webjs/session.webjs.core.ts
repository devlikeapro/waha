import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
import { IEngineMediaProcessor } from '@waha/core/abc/media.abc';
import {
  getChannelInviteLink,
  WAHAInternalEvent,
  WhatsappSession,
} from '@waha/core/abc/session.abc';
import { WebjsClient } from '@waha/core/engines/webjs/WebjsClient';
import {
  AvailableInPlusVersion,
  NotImplementedByEngineError,
} from '@waha/core/exceptions';
import { QR } from '@waha/core/QR';
import { parseBool } from '@waha/helpers';
import { CallData } from '@waha/structures/calls.dto';
import {
  Channel,
  ChannelRole,
  CreateChannelRequest,
  ListChannelsQuery,
} from '@waha/structures/channels.dto';
import { ChatArchiveEvent, GetChatsQuery } from '@waha/structures/chats.dto';
import {
  ChatRequest,
  CheckNumberStatusQuery,
  EditMessageRequest,
  GetMessageQuery,
  MessageFileRequest,
  MessageImageRequest,
  MessageLocationRequest,
  MessageReactionRequest,
  MessageReplyRequest,
  MessageStarRequest,
  MessageTextRequest,
  MessageVoiceRequest,
  SendSeenRequest,
  WANumberExistResult,
  FileRequest,
} from '@waha/structures/chatting.dto';
import { ContactQuery, ContactRequest } from '@waha/structures/contacts.dto';
import {
  ACK_UNKNOWN,
  SECOND,
  WAHAEngine,
  WAHAEvents,
  WAHAPresenceStatus,
  WAHASessionStatus,
  WAMessageAck,
} from '@waha/structures/enums.dto';
import {
  CreateGroupRequest,
  ParticipantsRequest,
  SettingsSecurityChangeInfo,
} from '@waha/structures/groups.dto';
import { Label, LabelID } from '@waha/structures/labels.dto';
import { WAMessage, WAMessageReaction } from '@waha/structures/responses.dto';
import { MeInfo } from '@waha/structures/sessions.dto';
import { WAMessageRevokedBody } from '@waha/structures/webhooks.dto';
import { SingleDelayedJobRunner } from '@waha/utils/SingleDelayedJobRunner';
import {
  Call,
  Channel as WEBJSChannel,
  Chat,
  ClientOptions,
  Contact,
  Events,
  GroupChat,
  Label as WEBJSLabel,
  Location,
  Message,
  Reaction,
  MessageMedia
} from 'whatsapp-web.js';
import { Message as MessageInstance } from 'whatsapp-web.js/src/structures';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const QRCode = require('qrcode');

export interface WebJSConfig {
  webVersion?: string;
}

export class WhatsappSessionWebJSCore extends WhatsappSession {
  private START_ATTEMPT_DELAY_SECONDS = 2;

  engine = WAHAEngine.WEBJS;
  protected engineConfig?: WebJSConfig;

  private startDelayedJob: SingleDelayedJobRunner;
  private shouldRestart: boolean;

  whatsapp: WebjsClient;
  protected qr: QR;

  public constructor(config) {
    super(config);
    this.qr = new QR();
    this.shouldRestart = true;

    // Restart job if session failed
    this.startDelayedJob = new SingleDelayedJobRunner(
      'start-engine',
      this.START_ATTEMPT_DELAY_SECONDS * SECOND,
      this.logger,
    );
  }

  /**
   * Folder with the current class
   */
  protected getClassDirName() {
    return __dirname;
  }

  protected getClientOptions(): ClientOptions {
    const path = this.getClassDirName();
    const webVersion =
      this.engineConfig?.webVersion || '2.3000.1014522270-alpha';
    // this.log.debug(`Using web version: '${webVersion}'`);
    return {
      puppeteer: {
        headless: true,
        executablePath: this.getBrowserExecutablePath(),
        args: this.getBrowserArgsForPuppeteer(),
        dumpio: this.isDebugEnabled(),
      },
      webVersion: webVersion,
      webVersionCache: {
        type: 'none',
        // path: path,
        // strict: true,
      },
    };
  }

  protected async buildClient() {
    const clientOptions = this.getClientOptions();
    this.addProxyConfig(clientOptions);
    return new WebjsClient(clientOptions);
  }

  private restartClient() {
    if (!this.shouldRestart) {
      this.logger.debug(
        'Should not restart the client, ignoring restart request',
      );
      return;
    }

    this.startDelayedJob.schedule(async () => {
      if (!this.shouldRestart) {
        this.logger.warn(
          'Should not restart the client, ignoring restart request',
        );
        return;
      }
      await this.start();
    });
  }

  protected addProxyConfig(clientOptions: ClientOptions) {
    if (this.proxyConfig?.server !== undefined) {
      // push the proxy server to the args
      clientOptions.puppeteer.args.push(
        `--proxy-server=${this.proxyConfig?.server}`,
      );

      // Authenticate
      if (this.proxyConfig?.username && this.proxyConfig?.password) {
        clientOptions.proxyAuthentication = {
          username: this.proxyConfig?.username,
          password: this.proxyConfig?.password,
        };
      }
    }
  }

  protected async init() {
    await this.end();
    this.shouldRestart = true;
    this.whatsapp = await this.buildClient();
    this.whatsapp
      .initialize()
      .then(() => {
        // Listen for browser disconnected event
        this.whatsapp.pupBrowser.on('disconnected', () => {
          this.status = WAHASessionStatus.FAILED;
          this.logger.error('The browser has been disconnected');
          this.restartClient();
        });
        // Listen for page close event
        this.whatsapp.pupPage.on('close', () => {
          this.status = WAHASessionStatus.FAILED;
          this.logger.error('The WhatsApp Web page has been closed');
          this.restartClient();
        });

        // Listen for page error event
        if (this.isDebugEnabled()) {
          this.logger.debug("Logging 'console' event for web page");
          this.whatsapp.pupPage.on('console', (msg) =>
            this.logger.debug(`WEBJS page log: ${msg.text()}`),
          );
          this.whatsapp.pupPage.evaluate(() =>
            console.log(`url is ${location.href}`),
          );
        }
      })
      .catch((error) => {
        this.status = WAHASessionStatus.FAILED;
        this.logger.error(error);
        this.restartClient();
        return;
      });
    if (this.isDebugEnabled()) {
      this.listenEngineEventsInDebugMode();
    }
    this.listenConnectionEvents();
    this.events.emit(WAHAInternalEvent.ENGINE_START);
  }

  async start() {
    this.status = WAHASessionStatus.STARTING;
    await this.init();
    return this;
  }

  async stop() {
    this.shouldRestart = false;
    this.status = WAHASessionStatus.STOPPED;
    this.events.removeAllListeners();
    await this.end();
  }

  private async end() {
    try {
      this.whatsapp?.removeAllListeners();
      this.startDelayedJob.cancel();
      this.whatsapp?.destroy().catch((error) => {
        this.logger.debug('Failed to destroy the client', error);
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  getSessionMeInfo(): MeInfo | null {
    const clientInfo = this.whatsapp?.info;
    if (!clientInfo) {
      return null;
    }
    const wid = clientInfo.wid;
    return {
      id: wid?._serialized,
      pushName: clientInfo?.pushname,
    };
  }

  protected listenEngineEventsInDebugMode() {
    // Iterate over Events enum and log with debug level all incoming events
    // This is useful for debugging
    for (const key in Events) {
      const event = Events[key];
      this.whatsapp.on(event, (...data: any[]) => {
        const log = { event: event, data: data };
        this.logger.debug({ event: log }, `WEBJS event`);
      });
    }
  }

  protected listenConnectionEvents() {
    this.whatsapp.on(Events.QR_RECEIVED, async (qr) => {
      this.logger.debug('QR received');
      // Convert to image and save
      const url = await QRCode.toDataURL(qr);
      this.qr.save(url, qr);
      this.printQR(this.qr);
      this.status = WAHASessionStatus.SCAN_QR_CODE;
    });

    this.whatsapp.on(Events.READY, () => {
      this.status = WAHASessionStatus.WORKING;
      this.qr.save('');
      this.logger.info(`Session '${this.name}' is ready!`);
    });

    this.whatsapp.on(Events.AUTHENTICATED, () => {
      this.status = WAHASessionStatus.WORKING;
      this.qr.save('');
      this.logger.info(`Session '${this.name}' has been authenticated!`);
    });

    this.whatsapp.on(Events.AUTHENTICATION_FAILURE, () => {
      this.status = WAHASessionStatus.FAILED;
      this.qr.save('');
      this.logger.info(`Session '${this.name}' has been disconnected!`);
    });

    this.whatsapp.on(Events.DISCONNECTED, () => {
      this.status = WAHASessionStatus.FAILED;
      this.qr.save('');
      this.logger.info(`Session '${this.name}' has been disconnected!`);
    });
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

  async getScreenshot(): Promise<Buffer> {
    if (this.status === WAHASessionStatus.FAILED) {
      throw new UnprocessableEntityException(
        `The session under FAILED status. Please try to restart it.`,
      );
    }
    const screenshot = await this.whatsapp.pupPage.screenshot({
      encoding: 'binary',
    });
    return screenshot as Buffer;
  }

  async checkNumberStatus(
    request: CheckNumberStatusQuery,
  ): Promise<WANumberExistResult> {
    const phone = request.phone.split('@')[0];
    const result = await this.whatsapp.getNumberId(phone);
    if (!result) {
      return {
        numberExists: false,
      };
    }
    return {
      numberExists: true,
      chatId: result._serialized,
    };
  }

  sendText(request: MessageTextRequest) {
    const options = {
      // It's fine to sent just ids instead of Contact object
      mentions: request.mentions as unknown as string[],
     linkPreview: false,
    };
    return this.whatsapp.sendMessage(
      this.ensureSuffix(request.chatId),
      request.text,
      options,
    );
  }

  public deleteMessage(chatId: string, messageId: string) {
    const message = this.recreateMessage(messageId);
    return message.delete(true);
  }

  public editMessage(
    chatId: string,
    messageId: string,
    request: EditMessageRequest,
  ) {
    const message = this.recreateMessage(messageId);
    const options = {
      // It's fine to sent just ids instead of Contact object
      mentions: request.mentions as unknown as string[],
    };
    return message.edit(request.text, options);
  }

  reply(request: MessageReplyRequest) {
    const options = {
      quotedMessageId: request.reply_to,
      // It's fine to sent just ids instead of Contact object
      mentions: request.mentions as unknown as string[],
    };
    return this.whatsapp.sendMessage(request.chatId, request.text, options);
  }

  async sendImage(request: MessageImageRequest) {
    const chatId = this.ensureSuffix(request.chatId);

    const media = await MessageMedia.fromUrl(request.file.url, {
        filename: request.file.filename,
        //mimetype: request.file.mimetype,
    });

    const options = {
        caption: request.caption,
        //mentions: request.mentions as unknown as string[],
    };

    return this.whatsapp.sendMessage(chatId, media, options);
  }

  sendFile(request: MessageFileRequest) {
    throw new AvailableInPlusVersion();
  }

  sendVoice(request: MessageVoiceRequest) {
    throw new AvailableInPlusVersion();
  }

  async sendLocation(request: MessageLocationRequest) {
    const location = new Location(request.latitude, request.longitude, {
      name: request.title,
    });
    return this.whatsapp.sendMessage(request.chatId, location);
  }

  async sendSeen(request: SendSeenRequest) {
    const chat: Chat = await this.whatsapp.getChatById(request.chatId);
    await chat.sendSeen();
  }

  async startTyping(request: ChatRequest) {
    const chat: Chat = await this.whatsapp.getChatById(request.chatId);
    await chat.sendStateTyping();
  }

  async stopTyping(request: ChatRequest) {
    const chat: Chat = await this.whatsapp.getChatById(request.chatId);
    await chat.clearState();
  }

  async getMessages(query: GetMessageQuery) {
    return this.getChatMessages(query.chatId, query.limit, query.downloadMedia);
  }

  async setReaction(request: MessageReactionRequest) {
    const message = this.recreateMessage(request.messageId);
    return message.react(request.reaction);
  }

  /**
   * Recreate message instance from id
   */
  private recreateMessage(msgId: string): MessageInstance {
    const messageId = this.deserializeId(msgId);
    const data = {
      id: messageId,
    };
    return new MessageInstance(this.whatsapp, data);
  }

  async setStar(request: MessageStarRequest) {
    const message = this.recreateMessage(request.messageId);
    if (request.star) {
      await message.star();
    } else {
      await message.unstar();
    }
  }

  /**
   * Chats methods
   */
  getChats(query: GetChatsQuery) {
    return this.whatsapp.getChats(query.limit, query.offset);
  }

  async getChatMessages(chatId: string, limit: number, downloadMedia: boolean) {
    downloadMedia = parseBool(downloadMedia);
    const chat: Chat = await this.whatsapp.getChatById(
      this.ensureSuffix(chatId),
    );
    const messages = await chat.fetchMessages({
      limit: limit,
    });
    // Go over messages, download media, and convert to right format.
    const result = [];
    for (const message of messages) {
      const msg = await this.processIncomingMessage(message, downloadMedia);
      result.push(msg);
    }
    return result;
  }

  async deleteChat(chatId) {
    const chat = await this.whatsapp.getChatById(chatId);
    return chat.delete();
  }

  async clearMessages(chatId) {
    const chat = await this.whatsapp.getChatById(chatId);
    return chat.clearMessages();
  }

  public chatsArchiveChat(chatId: string): Promise<any> {
    const id = this.ensureSuffix(chatId);
    return this.whatsapp.archiveChat(id);
  }

  public chatsUnarchiveChat(chatId: string): Promise<any> {
    const id = this.ensureSuffix(chatId);
    return this.whatsapp.unarchiveChat(id);
  }

  /**
   *
   * Label methods
   */

  public async getLabels(): Promise<Label[]> {
    const labels = await this.whatsapp.getLabels();
    return labels.map(this.toLabel);
  }

  public getChatsByLabelId(labelId: string) {
    return this.whatsapp.getChatsByLabelId(labelId);
  }

  public async getChatLabels(chatId: string): Promise<Label[]> {
    const id = this.ensureSuffix(chatId);
    const labels = await this.whatsapp.getChatLabels(id);
    return labels.map(this.toLabel);
  }

  public async putLabelsToChat(chatId: string, labels: LabelID[]) {
    const labelIds = labels.map((label) => label.id);
    const chatIds = [this.ensureSuffix(chatId)];
    await this.whatsapp.addOrRemoveLabels(labelIds, chatIds);
  }

  protected toLabel(label: WEBJSLabel): Label {
    const color = label.colorIndex;
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
  getContact(query: ContactQuery) {
    return this.whatsapp
      .getContactById(this.ensureSuffix(query.contactId))
      .then(this.toWAContact);
  }

  getContacts() {
    return this.whatsapp
      .getContacts()
      .then((contacts) => contacts.map(this.toWAContact));
  }

  public async getContactAbout(query: ContactQuery) {
    const contact = await this.whatsapp.getContactById(
      this.ensureSuffix(query.contactId),
    );
    return { about: await contact.getAbout() };
  }

  public async getContactProfilePicture(query: ContactQuery) {
    const contact = await this.whatsapp.getContactById(
      this.ensureSuffix(query.contactId),
    );
    return { profilePictureURL: await contact.getProfilePicUrl() };
  }

  public async blockContact(request: ContactRequest) {
    const contact = await this.whatsapp.getContactById(
      this.ensureSuffix(request.contactId),
    );
    await contact.block();
  }

  public async unblockContact(request: ContactRequest) {
    const contact = await this.whatsapp.getContactById(
      this.ensureSuffix(request.contactId),
    );
    await contact.unblock();
  }

  /**
   * Group methods
   */
  public createGroup(request: CreateGroupRequest) {
    const participantIds = request.participants.map(
      (participant) => participant.id,
    );
    return this.whatsapp.createGroup(request.name, participantIds);
  }

  public async getInfoAdminsOnly(id): Promise<SettingsSecurityChangeInfo> {
    const groupChat = (await this.whatsapp.getChatById(id)) as GroupChat;
    return {
      // Undocumented property, can be changed in the future
      // @ts-ignore
      adminsOnly: groupChat.groupMetadata.restrict,
    };
  }

  public async setInfoAdminsOnly(id, value) {
    const groupChat = (await this.whatsapp.getChatById(id)) as GroupChat;
    return groupChat.setInfoAdminsOnly(value);
  }

  public async getMessagesAdminsOnly(id): Promise<SettingsSecurityChangeInfo> {
    const groupChat = (await this.whatsapp.getChatById(id)) as GroupChat;
    // @ts-ignore
    return {
      // Undocumented property, can be changed in the future
      // @ts-ignore
      adminsOnly: groupChat.groupMetadata.announce,
    };
  }

  public async setMessagesAdminsOnly(id, value) {
    const groupChat = (await this.whatsapp.getChatById(id)) as GroupChat;
    return groupChat.setMessagesAdminsOnly(value);
  }

  public getGroups() {
    return this.whatsapp
      .getChats()
      .then((chats) => chats.filter((chat) => chat.isGroup));
  }

  public getGroup(id) {
    return this.whatsapp.getChatById(id);
  }

  public async deleteGroup(id) {
    const groupChat = (await this.whatsapp.getChatById(id)) as GroupChat;
    return groupChat.delete();
  }

  public async leaveGroup(id) {
    const groupChat = (await this.whatsapp.getChatById(id)) as GroupChat;
    return groupChat.leave();
  }

  public async setDescription(id, description) {
    const groupChat = (await this.whatsapp.getChatById(id)) as GroupChat;
    return groupChat.setDescription(description);
  }

  public async setSubject(id, subject) {
    const groupChat = (await this.whatsapp.getChatById(id)) as GroupChat;
    return groupChat.setSubject(subject);
  }

  public async getInviteCode(id): Promise<string> {
    const groupChat = (await this.whatsapp.getChatById(id)) as GroupChat;
    return groupChat.getInviteCode();
  }

  public async revokeInviteCode(id): Promise<string> {
    const groupChat = (await this.whatsapp.getChatById(id)) as GroupChat;
    await groupChat.revokeInvite();
    return groupChat.getInviteCode();
  }

  public async getParticipants(id) {
    const groupChat = (await this.whatsapp.getChatById(id)) as GroupChat;
    return groupChat.participants;
  }

  public async addParticipants(id, request: ParticipantsRequest) {
    const groupChat = (await this.whatsapp.getChatById(id)) as GroupChat;
    const participantIds = request.participants.map(
      (participant) => participant.id,
    );
    return groupChat.addParticipants(participantIds);
  }

  public async removeParticipants(id, request: ParticipantsRequest) {
    const groupChat = (await this.whatsapp.getChatById(id)) as GroupChat;
    const participantIds = request.participants.map(
      (participant) => participant.id,
    );
    return groupChat.removeParticipants(participantIds);
  }

  public async promoteParticipantsToAdmin(id, request: ParticipantsRequest) {
    const groupChat = (await this.whatsapp.getChatById(id)) as GroupChat;
    const participantIds = request.participants.map(
      (participant) => participant.id,
    );
    return groupChat.promoteParticipants(participantIds);
  }

  public async demoteParticipantsToUser(id, request: ParticipantsRequest) {
    const groupChat = (await this.whatsapp.getChatById(id)) as GroupChat;
    const participantIds = request.participants.map(
      (participant) => participant.id,
    );
    return groupChat.demoteParticipants(participantIds);
  }

  /**
   * Channels methods
   */
  protected ChatToChannel(chat: WEBJSChannel): Channel {
    // @ts-ignore
    const metadata = chat.channelMetadata;
    let role = metadata.membershipType.toUpperCase();
    if (role === 'VIEWER') {
      role = ChannelRole.GUEST;
    }
    return {
      id: chat.id._serialized,
      name: chat.name,
      description: chat.description,
      invite: getChannelInviteLink(metadata.inviteCode),
      preview: null,
      picture: null,
      verified: metadata.verified,
      role: role,
    };
  }

  protected ChannelMetadataToChannel(metadata: any): Channel {
    let role = metadata.membershipType.toUpperCase();
    if (role === 'VIEWER') {
      role = ChannelRole.GUEST;
    }
    return {
      id: metadata.id,
      name: metadata.titleMetadata.title,
      description: metadata.descriptionMetadata.description,
      invite: metadata.inviteLink,
      preview: metadata.pictureUrl,
      picture: metadata.pictureUrl,
      verified: metadata.isVerified,
      role: role,
    };
  }

  public async channelsList(query: ListChannelsQuery): Promise<Channel[]> {
    const data = await this.whatsapp.getChannels();
    let channels = data.map(this.ChatToChannel);
    if (query.role) {
      // @ts-ignore
      channels = channels.filter((channel) => channel.role === query.role);
    }

    const promises = channels.map(async (channel) =>
      this.whatsapp.getProfilePicUrl(channel.id),
    );
    const pictures = await Promise.all(promises);
    channels = channels.map((channel, index) => {
      channel.picture = pictures[index] || null;
      channel.preview = channel.picture;
      return channel;
    });
    return channels;
  }

  public channelsCreateChannel(
    request: CreateChannelRequest,
  ): Promise<Channel> {
    throw new NotImplementedByEngineError();
  }

  public async channelsGetChannel(id: string): Promise<Channel> {
    return await this.channelsGetChannelByInviteCode(id);
  }

  public async channelsGetChannelByInviteCode(
    inviteCode: string,
  ): Promise<Channel> {
    const metadata = await this.whatsapp.getChannelByInviteCode(inviteCode);
    const channel = this.ChannelMetadataToChannel(metadata);
    channel.preview =
      (await this.whatsapp.getProfilePicUrl(channel.id)) || null;
    channel.picture = channel.preview;
    return channel;
  }

  public channelsDeleteChannel(id: string): Promise<void> {
    throw new NotImplementedByEngineError();
  }

  public channelsFollowChannel(id: string): Promise<void> {
    throw new NotImplementedByEngineError();
  }

  public channelsUnfollowChannel(id: string): Promise<void> {
    throw new NotImplementedByEngineError();
  }

  public channelsMuteChannel(id: string): Promise<void> {
    throw new NotImplementedByEngineError();
  }

  public channelsUnmuteChannel(id: string): Promise<void> {
    throw new NotImplementedByEngineError();
  }

  /**
   * Presences methods
   */
  public async setPresence(presence: WAHAPresenceStatus, chatId?: string) {
    let chat: Chat;
    switch (presence) {
      case WAHAPresenceStatus.ONLINE:
        await this.whatsapp.sendPresenceAvailable();
        break;
      case WAHAPresenceStatus.OFFLINE:
        await this.whatsapp.sendPresenceUnavailable();
        break;
      case WAHAPresenceStatus.TYPING:
        chat = await this.whatsapp.getChatById(chatId);
        await chat.sendStateTyping();
        break;
      case WAHAPresenceStatus.RECORDING:
        chat = await this.whatsapp.getChatById(chatId);
        await chat.sendStateRecording();
        break;
      case WAHAPresenceStatus.PAUSED:
        chat = await this.whatsapp.getChatById(chatId);
        await chat.clearState();
        break;
      default:
        throw new NotImplementedByEngineError(
          `WEBJS engine doesn't support '${presence}' presence.`,
        );
    }
  }

  /**
   * END - Methods for API
   */

  subscribeEngineEvent(event, handler): boolean {
    switch (event) {
      case WAHAEvents.MESSAGE:
        this.whatsapp.on(Events.MESSAGE_RECEIVED, (message) =>
          this.processIncomingMessage(message).then(handler),
        );
        return true;
      case WAHAEvents.MESSAGE_REVOKED:
        this.whatsapp.on(
          Events.MESSAGE_REVOKED_EVERYONE,
          async (after, before) => {
            const afterMessage = after ? await this.toWAMessage(after) : null;
            const beforeMessage = before
              ? await this.toWAMessage(before)
              : null;
            const body: WAMessageRevokedBody = {
              after: afterMessage,
              before: beforeMessage,
            };
            handler(body);
          },
        );
        return true;
      case WAHAEvents.MESSAGE_REACTION:
        this.whatsapp.on('message_reaction', (message) =>
          handler(this.processMessageReaction(message)),
        );
        return true;
      case WAHAEvents.MESSAGE_ANY:
        this.whatsapp.on(Events.MESSAGE_CREATE, (message) =>
          this.processIncomingMessage(message).then(handler),
        );
        return true;
      case WAHAEvents.STATE_CHANGE:
        this.whatsapp.on(Events.STATE_CHANGED, handler);
        return true;
      case WAHAEvents.MESSAGE_ACK:
        // We do not download media here
        this.whatsapp.on(Events.MESSAGE_ACK, (message) =>
          this.toWAMessage(message).then(handler),
        );
        return true;
      case WAHAEvents.GROUP_JOIN:
        this.whatsapp.on(Events.GROUP_JOIN, handler);
        return true;
      case WAHAEvents.GROUP_LEAVE:
        this.whatsapp.on(Events.GROUP_LEAVE, handler);
        return true;
      case WAHAEvents.CHAT_ARCHIVE:
        this.whatsapp.on('chat_archived', (chat, archived, _) => {
          const body: ChatArchiveEvent = {
            id: chat.id._serialized,
            archived: archived,
            timestamp: chat.timestamp,
          };
          handler(body);
        });
        return true;
      case WAHAEvents.CALL_RECEIVED:
        this.whatsapp.on('call', (call: Call) => {
          const body: CallData = {
            id: call.id,
            from: call.from,
            timestamp: call.timestamp,
            isVideo: call.isVideo,
            isGroup: call.isGroup,
          };
          handler(body);
        });
        return true;
      default:
        return false;
    }
  }

  private async processIncomingMessage(message: Message, downloadMedia = true) {
    if (downloadMedia) {
      try {
        message = await this.downloadMedia(message);
      } catch (e) {
        this.logger.error('Failed when tried to download media for a message');
        this.logger.error(e, e.stack);
      }
    }
    return await this.toWAMessage(message);
  }

  private processMessageReaction(reaction: Reaction): WAMessageReaction {
    return {
      id: reaction.id._serialized,
      from: reaction.senderId,
      fromMe: reaction.id.fromMe,
      participant: reaction.senderId,
      to: reaction.id.remote,
      timestamp: reaction.timestamp,
      reaction: {
        text: reaction.reaction,
        messageId: reaction.msgId._serialized,
      },
    };
  }

  protected toWAMessage(message: Message): Promise<WAMessage> {
    // @ts-ignore
    return Promise.resolve({
      id: message.id._serialized,
      timestamp: message.timestamp,
      from: message.from,
      fromMe: message.fromMe,
      to: message.to,
      body: message.body,
      // Media
      // @ts-ignore
      hasMedia: Boolean(message.media),
      // @ts-ignore
      media: message.media,
      // @ts-ignore
      mediaUrl: message.media?.url,
      // @ts-ignore
      ack: message.ack,
      ackName: WAMessageAck[message.ack] || ACK_UNKNOWN,
      location: message.location,
      vCards: message.vCards,
      _data: message.rawData,
    });
  }

  public async getEngineInfo() {
    // Add 1 seconds timeout
    return {
      WWebVersion: await this.whatsapp?.getWWebVersion(),
      state: await this.whatsapp?.getState(),
    };
  }

  protected toWAContact(contact: Contact) {
    // @ts-ignore
    contact.id = contact.id._serialized;
    return contact;
  }

  protected downloadMedia(message: Message) {
    const processor = new EngineMediaProcessor();
    return this.mediaManager.processMedia(processor, message);
  }
}

export class EngineMediaProcessor implements IEngineMediaProcessor<Message> {
  hasMedia(message: Message): boolean {
    if (!message.hasMedia) {
      return false;
    }
    // Can't get media for revoked messages
    return message.type !== 'revoked';
  }

  getMessageId(message: Message): string {
    return '';
  }

  getMimetype(message: Message): string {
    return '';
  }

  getMediaBuffer(message: Message): Promise<Buffer | null> {
    return Promise.resolve(undefined);
  }

  getFilename(message: Message): string | null {
    // @ts-ignore
    return message.rawData?.filename || null;
  }
}
