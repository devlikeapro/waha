import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
import {
  Chat,
  Client,
  ClientOptions,
  Contact,
  Events,
  GroupChat,
  Location,
  Message,
  Reaction,
} from 'whatsapp-web.js';
import { Message as MessageInstance } from 'whatsapp-web.js/src/structures';

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
} from '../../../structures/chatting.dto';
import { ContactQuery, ContactRequest } from '../../../structures/contacts.dto';
import {
  ACK_UNKNOWN,
  WAHAEngine,
  WAHAEvents,
  WAHAPresenceStatus,
  WAHASessionStatus,
  WAMessageAck,
} from '../../../structures/enums.dto';
import {
  CreateGroupRequest,
  ParticipantsRequest,
  SettingsSecurityChangeInfo,
} from '../../../structures/groups.dto';
import {
  WAMessage,
  WAMessageReaction,
} from '../../../structures/responses.dto';
import { MeInfo } from '../../../structures/sessions.dto';
import { WAMessageRevokedBody } from '../../../structures/webhooks.dto';
import { IEngineMediaProcessor } from '../../abc/media.abc';
import { WAHAInternalEvent, WhatsappSession } from '../../abc/session.abc';
import {
  AvailableInPlusVersion,
  NotImplementedByEngineError,
} from '../../exceptions';
import { QR } from '../../QR';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const QRCode = require('qrcode');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const qrcode = require('qrcode-terminal');

export class WhatsappSessionWebJSCore extends WhatsappSession {
  engine = WAHAEngine.WEBJS;

  whatsapp: Client;
  protected qr: QR;

  public constructor(config) {
    super(config);
    this.qr = new QR();
  }

  protected getClientOptions(): ClientOptions {
    // Folder with current file
    const path = __dirname;
    return {
      puppeteer: {
        headless: true,
        executablePath: this.getBrowserExecutablePath(),
        args: this.getBrowserArgsForPuppeteer(),
      },
      webVersion: '2.2412.54',
      webVersionCache: {
        type: 'local',
        path: path,
        strict: true,
      },
    };
  }

  protected async buildClient() {
    const clientOptions = this.getClientOptions();
    this.addProxyConfig(clientOptions);
    return new Client(clientOptions);
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

  async start() {
    this.status = WAHASessionStatus.STARTING;
    this.whatsapp = await this.buildClient();
    this.whatsapp
      .initialize()
      .then(() => {
        // Listen for browser disconnected event
        this.whatsapp.pupBrowser.on('disconnected', () => {
          this.status = WAHASessionStatus.FAILED;
          this.log.error('The browser has been disconnected');
        });
        // Listen for page close event
        this.whatsapp.pupPage.on('close', () => {
          this.status = WAHASessionStatus.FAILED;
          this.log.error('The WhatsApp Web page has been closed');
        });
        if (this.isDebugEnabled()) {
          this.log.debug("Logging 'console' event for web page");
          this.whatsapp.pupPage.on('console', (msg) =>
            this.log.debug(`WEBJS page log: ${msg.text()}`),
          );
          this.whatsapp.pupPage.evaluate(() =>
            console.log(`url is ${location.href}`),
          );
        }
      })
      .catch((error) => {
        this.status = WAHASessionStatus.FAILED;
        this.log.error(error);
        return;
      });
    if (this.isDebugEnabled()) {
      this.listenEngineEventsInDebugMode();
    }
    this.listenConnectionEvents();
    this.events.emit(WAHAInternalEvent.ENGINE_START);
    return this;
  }

  async stop() {
    await this.whatsapp.destroy();
    this.status = WAHASessionStatus.STOPPED;
  }

  async getSessionMeInfo(): Promise<MeInfo | null> {
    const clientInfo = this.whatsapp?.info;
    if (!clientInfo) {
      return null;
    }
    const wid = clientInfo.wid;
    const meInfo: MeInfo = {
      id: wid._serialized,
      pushName: clientInfo.pushname,
    };
    return meInfo;
  }

  protected listenEngineEventsInDebugMode() {
    // Iterate over Events enum and log with debug level all incoming events
    // This is useful for debugging
    for (const key in Events) {
      const event = Events[key];
      this.whatsapp.on(event, (...data: any[]) => {
        const log = { event: event, data: data };
        this.log.debug(`WEBJS event: ${JSON.stringify(log)}`);
      });
    }
  }

  protected listenConnectionEvents() {
    this.whatsapp.on(Events.QR_RECEIVED, (qr) => {
      this.log.debug('QR received');
      // Convert to image and save
      QRCode.toDataURL(qr).then((url) => {
        this.qr.save(url, qr);
      });
      // Print in terminal
      qrcode.generate(qr, { small: true });
      this.status = WAHASessionStatus.SCAN_QR_CODE;
    });

    this.whatsapp.on(Events.READY, () => {
      this.status = WAHASessionStatus.WORKING;
      this.qr.save('');
      this.log.log(`Session '${this.name}' has been authenticated!`);
    });

    this.whatsapp.on(Events.DISCONNECTED, () => {
      this.status = WAHASessionStatus.FAILED;
      this.qr.save('');
      this.log.log(`Session '${this.name}' has been disconnected!`);
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

  sendImage(request: MessageImageRequest) {
    throw new AvailableInPlusVersion();
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
  getChats() {
    return this.whatsapp.getChats();
  }

  async getChatMessages(chatId: string, limit: number, downloadMedia: boolean) {
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
      default:
        return false;
    }
  }

  private async processIncomingMessage(message: Message, downloadMedia = true) {
    if (downloadMedia) {
      try {
        message = await this.downloadMedia(message);
      } catch (e) {
        this.log.error('Failed when tried to download media for a message');
        this.log.error(e, e.stack);
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
