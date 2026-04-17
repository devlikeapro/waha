import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Activity } from '@waha/core/abc/activity';
import {
  getChannelInviteLink,
  getPublicUrlFromDirectPath,
  parseGroupInviteLink,
  WhatsappSession,
} from '@waha/core/abc/session.abc';
import {
  Channel,
  ChannelListResult,
  ChannelMessage,
  ChannelPublicInfo,
  ChannelRole,
  ChannelSearchByText,
  ChannelSearchByView,
  CreateChannelRequest,
  ListChannelsQuery,
  PreviewChannelMessages,
} from '@waha/structures/channels.dto';
import { splitAt } from '@waha/helpers';
import { PairingCodeResponse } from '@waha/structures/auth.dto';
import {
  ChatSortField,
  GetChatMessageQuery,
  ChatSummary,
  GetChatMessagesFilter,
  GetChatMessagesQuery,
  OverviewFilter,
  ReadChatMessagesQuery,
  ReadChatMessagesResponse,
} from '@waha/structures/chats.dto';
import {
  ChatRequest,
  CheckNumberStatusQuery,
  EditMessageRequest,
  MessageContactVcardRequest,
  MessageForwardRequest,
  MessageImageRequest,
  MessageLocationRequest,
  MessagePollRequest,
  MessageReactionRequest,
  MessageReplyRequest,
  MessageFileRequest,
  MessageStarRequest,
  MessageTextRequest,
  MessageVoiceRequest,
  SendSeenRequest,
  WANumberExistResult,
  VCardContact,
  Contact,
} from '@waha/structures/chatting.dto';
import {
  ACK_UNKNOWN,
  SECOND,
  WAHAEngine,
  WAHAEvents,
  WAHAPresenceStatus,
  WAHASessionStatus,
  WAMessageAck,
} from '@waha/structures/enums.dto';
import { SingleDelayedJobRunner } from '@waha/utils/SingleDelayedJobRunner';
import { WAHA_CLIENT_DEVICE_NAME } from '@waha/core/env';
import { PaginationParams, SortOrder } from '@waha/structures/pagination.dto';
import { CallData } from '@waha/structures/calls.dto';
import {
  GroupV2JoinEvent,
  GroupV2LeaveEvent,
  GroupV2ParticipantsEvent,
  GroupV2UpdateEvent,
} from '@waha/structures/groups.events.dto';
import {
  Label,
  LabelChatAssociation,
  LabelDTO,
  LabelID,
} from '@waha/structures/labels.dto';
import { WAHAChatPresences } from '@waha/structures/presence.dto';
import { WAMessage } from '@waha/structures/responses.dto';
import { MeInfo } from '@waha/structures/sessions.dto';
import { TextStatus } from '@waha/structures/status.dto';
import { ReplyToMessage } from '@waha/structures/message.dto';
import {
  PollVotePayload,
  WAMessageAckBody,
  WAMessageEditedBody,
  WAMessageRevokedBody,
} from '@waha/structures/webhooks.dto';
import { PaginatorInMemory } from '@waha/utils/Paginator';
import { PinoWinstonAdapter } from '@waha/utils/logging/PinoWinstonAdapter';
import { sleep } from '@waha/utils/promiseTimeout';
import {
  create as createWPPClient,
  CreateOptions,
  GroupProperty,
  MessageType,
  SocketState,
  StatusFind,
  Whatsapp as WPPWhatsapp,
} from '@wppconnect-team/wppconnect';
import type { Logger as WinstonLogger } from 'winston';
import {
  WppGp2ToGroupV2Update,
  WppParticipantsIsMyJoin,
  WppParticipantsIsMyLeave,
  WppParticipantsToGroupV2Leave,
  WppParticipantsToGroupV2Participants,
  WppPresenceToPresence,
  WppReactionToMessageReaction,
  WppUpdateLabelToAssociations,
} from '@waha/core/engines/wpp/events.wpp';
import { WPPConfig } from '@waha/core/engines/wpp/WppConfig';
import { buildWppStreams } from '@waha/core/engines/wpp/reactive/wppStreams';
import {
  WppEditMessageOptions,
  WppMessageEditArgs,
  WppSendPollOptions,
  WppSendTextOptions,
  WppSendTextStatusOptions,
} from '@waha/core/engines/wpp/WppTypes';
import {
  AvailableInPlusVersion,
  NotImplementedByEngineError,
} from '@waha/core/exceptions';
import { IMediaEngineProcessor } from '@waha/core/media/IMediaEngineProcessor';
import { IWPPAuthManager } from '@waha/core/engines/wpp/IWPPAuthManager';
import { QR } from '@waha/core/QR';
import { removeSingletonFiles } from '@waha/core/utils/chrome';
import { getSessionNamespace } from '@waha/config';
import { killProcessesByPatterns } from '@waha/core/utils/processes';
import { DistinctAck } from '@waha/core/utils/reactive';
import { isJidGroup, toCusFormat } from '@waha/core/utils/jids';
import { WAMedia } from '@waha/structures/media.dto';
import * as lodash from 'lodash';
import {
  distinct,
  from,
  interval,
  merge,
  mergeMap,
  Observable,
  retry,
  share,
} from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import {
  Deserialized,
  parseMessageIdSerialized,
  SerializeMsgKey,
} from '@waha/core/utils/ids';
import { normalizePN, parseVCardV3 } from '@waha/core/vcard';
import { BinaryFile, RemoteFile } from '@waha/structures/files.dto';
import {
  CreateGroupRequest,
  GroupInfo,
  GroupParticipant,
  GroupParticipantRole,
  GroupSortField,
  ParticipantsRequest,
  SettingsSecurityChangeInfo,
} from '@waha/structures/groups.dto';
import { ContactQuery, ContactRequest } from '@waha/structures/contacts.dto';
import { LidToPhoneNumber } from '@waha/structures/lids.dto';
import { evaluateAndReturn } from '@wppconnect-team/wppconnect/dist/api/helpers';
import { getFromToParticipant } from '@waha/core/engines/noweb/session.noweb.core';
import { IsChrome } from '@waha/version';

declare global {
  interface Window {
    WPP: any;
  }

  const WPP: any;
}

interface WppMessageEditPayload {
  chatId: string;
  editedMessageId: string | null;
  editKey: string | null;
  message: any;
  raw: any;
}

export class WhatsappSessionWPPCore extends WhatsappSession {
  private START_ATTEMPT_DELAY_SECONDS = 2;

  engine = WAHAEngine.WPP;
  protected engineConfig?: WPPConfig;
  whatsapp: any;
  protected qr: QR;
  protected wpp?: WPPWhatsapp;
  protected authManager: IWPPAuthManager | null = null;
  private meInfo: MeInfo | null = null;
  private pairingCode?: string;
  private presencesByChatId = new Map<string, WAHAChatPresences>();
  private startAttemptId = 0;
  private shouldRestart: boolean;
  private startDelayedJob: SingleDelayedJobRunner;

  constructor(config) {
    super(config);
    this.qr = new QR();
    this.shouldRestart = true;
    this.startDelayedJob = new SingleDelayedJobRunner(
      'start-engine',
      this.START_ATTEMPT_DELAY_SECONDS * SECOND,
      this.logger,
    );
  }

  protected getUserDataDir(): string {
    const base = process.env.WAHA_LOCAL_STORE_BASE_DIR || './.sessions';
    return `${base}/${getSessionNamespace()}/${this.name}`;
  }

  async start() {
    this.shouldRestart = true;
    this.status = WAHASessionStatus.STARTING;
    this.pairingCode = null;
    const startAttemptId = ++this.startAttemptId;

    const args = this.getBrowserArgsForPuppeteer();
    args.push(...(this.engineConfig?.puppeteerArgs || []));
    args.unshift(`--a-waha-timestamp=${new Date()}`);
    args.unshift(`--a-waha-session=${this.name}`);
    const deviceName =
      this.sessionConfig?.client?.deviceName ?? WAHA_CLIENT_DEVICE_NAME;

    const userDataDir = this.getUserDataDir();
    const logger = this.logger.child({
      name: 'WPP',
      session: this.name,
    });
    // WPPConnect types logger as winston.Logger (extends EventEmitter), but
    // only ever calls log-level methods on it — never EventEmitter methods.
    const wppLogger = new PinoWinstonAdapter(
      logger,
    ) as unknown as WinstonLogger;
    const options: CreateOptions = {
      session: this.name,
      disableWelcome: true,
      updatesLog: false,
      logQR: false,
      waitForLogin: false,
      autoClose: 0,
      deviceSyncTimeout: 0,
      deviceName: deviceName || false,
      headless: true,
      debug: this.isDebugEnabled(),
      logger: wppLogger,
      whatsappVersion: this.engineConfig?.webVersion,
      browserArgs: args,
      puppeteerOptions: {
        protocolTimeout: 300_000,
        headless: true,
        executablePath: this.getBrowserExecutablePath(),
        args: args,
        dumpio: this.isDebugEnabled(),
        userDataDir: userDataDir,
      },
      catchQR: (base64Image, asciiQR, attempt, urlCode) => {
        if (!this.isCurrentStartAttempt(startAttemptId)) {
          return;
        }
        void base64Image;
        void asciiQR;
        void attempt;
        // WPP callback first arg is base64 image, while WAHA QR store expects raw QR text.
        this.qr.save(urlCode);
        this.printQR(this.qr);
        this.status = WAHASessionStatus.SCAN_QR_CODE;
      },
      catchLinkCode: (code) => {
        if (!this.isCurrentStartAttempt(startAttemptId)) {
          return;
        }
        this.pairingCode = code;
      },
      statusFind: (status) => {
        if (!this.isCurrentStartAttempt(startAttemptId)) {
          return;
        }
        this.applyStatusFind(status);
      },
    };

    if (this.proxyConfig?.server) {
      options.proxy = {
        url: this.proxyConfig.server,
        username: this.proxyConfig.username,
        password: this.proxyConfig.password,
      };
    }

    void this.createClientAsync(options, startAttemptId).catch((error) => {
      this.logger.error({ error: error }, 'Failed to create WPP client async');
    });

    return this;
  }

  async stop() {
    this.shouldRestart = false;
    this.startDelayedJob.cancel();
    this.status = WAHASessionStatus.STOPPED;
    this.stopEvents();
    this.mediaManager.close();
    await this.authManager?.stop();
    await this.end();
  }

  private restartClient() {
    if (!this.shouldRestart) {
      this.logger.debug(
        'Should not restart the client, ignoring restart request',
      );
      this.end().catch((error) => {
        this.logger.error(error, 'Failed to end() the client');
      });
      return;
    }

    this.startDelayedJob.schedule(async () => {
      if (!this.shouldRestart) {
        this.logger.warn(
          'Should not restart the client, ignoring restart request',
        );
        return;
      }
      await this.end();
      await this.start();
    });
  }

  protected failed() {
    this.status = WAHASessionStatus.FAILED;
    this.restartClient();
  }

  private async end() {
    ++this.startAttemptId;
    this.cleanupPresenceTimeout();
    this.meInfo = null;
    this.presencesByChatId.clear();
    this.qr.save('');
    const wpp = this.wpp;
    this.wpp = null;
    this.whatsapp = null;
    wpp?.page?.removeAllListeners();
    wpp?.page?.browser()?.removeAllListeners();
    await wpp?.close().catch((error) => {
      this.logger.warn({ error: error }, 'Failed to close WPP client');
    });
  }

  private isCurrentStartAttempt(startAttemptId: number): boolean {
    return this.startAttemptId === startAttemptId;
  }

  private async createClientAsync(
    options: CreateOptions,
    startAttemptId: number,
  ): Promise<void> {
    if (!this.isCurrentStartAttempt(startAttemptId)) {
      return;
    }

    await killProcessesByPatterns(
      [IsChrome ? 'chrome' : 'chromium', `--a-waha-session=${this.name}`],
      'SIGKILL',
      this.logger,
    );
    await removeSingletonFiles(this.getUserDataDir());

    await this.authManager?.beforeStart();

    let wpp: WPPWhatsapp;
    try {
      wpp = await createWPPClient(options);
    } catch (error) {
      if (!this.isCurrentStartAttempt(startAttemptId)) {
        return;
      }
      this.logger.error('Failed to start WPP client');
      this.logger.error(error, (error as Error)?.stack);
      this.status = WAHASessionStatus.FAILED;
      return;
    }

    if (!this.isCurrentStartAttempt(startAttemptId)) {
      await wpp.close().catch((error) => {
        this.logger.warn({ error: error }, 'Failed to close stale WPP client');
      });
      return;
    }

    this.wpp = wpp;
    // Keep the shared field assigned for inherited API methods.
    this.whatsapp = this.wpp as any;
    this.subscribeEngineEvents2();
    if (this.isDebugEnabled()) {
      this.listenEngineEventsInDebugMode();
    }

    // Listen for browser disconnected event
    wpp.page.browser().on('disconnected', () => {
      if (this.wpp !== wpp) {
        return;
      }
      if (this.shouldRestart) {
        this.logger.error('The browser has been disconnected');
      } else {
        this.logger.info('The browser has been disconnected');
      }
      this.failed();
    });

    // Listen for page close event
    wpp.page.on('close', () => {
      if (this.wpp !== wpp) {
        return;
      }
      this.logger.error('The WhatsApp Web page has been closed');
      this.failed();
    });

    wpp.onStateChange((state) => {
      if (this.wpp !== wpp) {
        return;
      }
      this.applySocketState(state);
    });

    const state = await wpp.getConnectionState().catch(() => null);
    if (!this.isCurrentStartAttempt(startAttemptId) || this.wpp !== wpp) {
      return;
    }
    this.applySocketState(state);
  }

  async unpair() {
    this.unpairing = true;
    this.shouldRestart = false;
    await this.wpp?.logout();
  }

  getSessionMeInfo(): MeInfo | null {
    return this.meInfo;
  }

  public getQR(): QR {
    return this.qr;
  }

  async getScreenshot(): Promise<Buffer> {
    if (!this.wpp?.page) {
      throw new Error('WPP page is not ready');
    }
    const screenshot = await this.wpp.page.screenshot({
      encoding: 'binary',
    });
    return screenshot as Buffer;
  }

  @Activity()
  public async checkNumberStatus(
    request: CheckNumberStatusQuery,
  ): Promise<WANumberExistResult> {
    let phone = request.phone.split('@')[0];
    phone = phone.replace(/\+/g, '');
    const profile = await this.wpp!.checkNumberStatus(this.ensureSuffix(phone));
    const chatId = Deserialized(profile?.id);
    if (!chatId) {
      return {
        numberExists: false,
      };
    }
    return {
      numberExists: true,
      chatId: chatId,
    };
  }

  @Activity()
  public async setProfileName(name: string): Promise<boolean> {
    await this.wpp!.setProfileName(name);
    return true;
  }

  @Activity()
  public async setProfileStatus(status: string): Promise<boolean> {
    await this.wpp!.setProfileStatus(status);
    return true;
  }

  @Activity()
  protected async setProfilePicture(
    file: BinaryFile | RemoteFile,
  ): Promise<boolean> {
    const content = await this.fileToBuffer(file);
    const mimetype = MimetypeForDataUrl(file.mimetype || 'image/jpeg');
    const base64 = content.toString('base64');
    const media = `data:${mimetype};base64,${base64}`;
    await this.wpp!.setProfilePic(media);
    return true;
  }

  @Activity()
  protected async deleteProfilePicture(): Promise<boolean> {
    await this.wpp!.removeMyProfilePicture();
    return true;
  }

  @Activity()
  public async rejectCall(from: string, id: string): Promise<void> {
    void from;
    await this.wpp!.rejectCall(id);
  }

  @Activity()
  public async sendLocation(request: MessageLocationRequest) {
    const quotedMessageId = this.getReplyToMessageId(request as any);
    const options = {
      lat: request.latitude,
      lng: request.longitude,
      name: request.title || '',
    } as any;
    if (quotedMessageId) {
      options.quotedMsg = quotedMessageId;
    }
    const sent = await this.wpp!.sendLocation(
      this.ensureSuffix(request.chatId),
      options,
    );
    return this.toWAMessage(sent);
  }

  @Activity()
  public async forwardMessage(
    request: MessageForwardRequest,
  ): Promise<WAMessage> {
    const sentMessages = await this.wpp!.forwardMessagesV2(
      this.ensureSuffix(request.chatId),
      request.messageId,
    );
    const sent = Array.isArray(sentMessages) && sentMessages.length > 0;
    return {
      sent: Boolean(sent),
    } as any;
  }

  @Activity()
  public async sendPoll(request: MessagePollRequest): Promise<WAMessage> {
    const quotedMessageId = this.getReplyToMessageId(request as any);
    const options: WppSendPollOptions = {
      selectableCount: request.poll.multipleAnswers
        ? request.poll.options.length
        : 1,
    };
    if (quotedMessageId) {
      options.quotedMsg = quotedMessageId;
    }
    const sent = await this.wpp!.sendPollMessage(
      this.ensureSuffix(request.chatId),
      request.poll.name,
      request.poll.options,
      options,
    );
    const message = this.toWAMessage(sent);
    const messageIdPart = this.getMessageIdPart(message.id);
    this.saveSentMessageId(messageIdPart);
    message.source = this.getMessageSource(messageIdPart);
    return message;
  }

  @Activity()
  public async sendContactVCard(
    request: MessageContactVcardRequest,
  ): Promise<WAMessage> {
    const chatId = this.ensureSuffix(request.chatId);
    const contacts: Array<{ id: string; name: string }> = [];

    // Raw vcard
    const vcards: VCardContact[] = request.contacts.filter((c) => c.vcard);
    for (const vcard of vcards) {
      const contact = parseVCardV3(vcard.vcard);
      const id =
        contact.whatsappId || normalizePN(contact.phoneNumbers[0] || '');
      if (!id) {
        continue;
      }
      contacts.push({
        id: this.ensureSuffix(id),
        name: contact.fullName || null,
      });
    }
    // Formated contact
    const contactsData: Contact[] = request.contacts.filter(
      (c) => !c.vcard,
    ) as any;
    for (const contact of contactsData) {
      const id = contact.whatsappId || normalizePN(contact.phoneNumber);
      contacts.push({
        id: this.ensureSuffix(id),
        name: contact.fullName || null,
      });
    }

    if (contacts.length <= 1) {
      const single = contacts[0];
      const sent = await this.wpp!.sendContactVcard(
        chatId,
        single.id,
        single.name || undefined,
      );
      return this.toWAMessage(sent);
    }

    const sent = await this.wpp!.sendContactVcardList(chatId, contacts);
    return this.toWAMessage(sent);
  }

  public sendImage(request: MessageImageRequest) {
    void request;
    throw new AvailableInPlusVersion();
  }

  public sendFile(request: MessageFileRequest) {
    void request;
    throw new AvailableInPlusVersion();
  }

  public sendVoice(request: MessageVoiceRequest) {
    void request;
    throw new AvailableInPlusVersion();
  }

  @Activity()
  public async reply(request: MessageReplyRequest) {
    const quotedMessageId = this.getReplyToMessageId(request as any);
    const options: WppSendTextOptions = {
      mentionedList: request.mentions?.map((id) => this.ensureSuffix(id)),
      quotedMsg: quotedMessageId,
      waitForAck: false,
    };
    const sent = await this.wpp!.sendText(
      this.ensureSuffix(request.chatId),
      request.text,
      options,
    );
    return this.toWAMessage(sent);
  }

  @Activity()
  public async startTyping(request: ChatRequest): Promise<void> {
    await this.wpp!.startTyping(this.ensureSuffix(request.chatId));
  }

  @Activity()
  public async stopTyping(request: ChatRequest) {
    const chatId = this.ensureSuffix(request.chatId);
    await Promise.all([
      this.wpp!.stopTyping(chatId),
      this.wpp!.stopRecording(chatId),
    ]);
  }

  @Activity()
  public async setReaction(request: MessageReactionRequest) {
    const reaction = request.reaction || false;
    return this.wpp!.sendReactionToMessage(request.messageId, reaction);
  }

  @Activity()
  public async setStar(request: MessageStarRequest): Promise<void> {
    await this.wpp!.starMessage(request.messageId, request.star);
  }

  @Activity()
  async sendText(request: MessageTextRequest) {
    const quotedMessageId = this.getReplyToMessageId(request as any);
    const options: WppSendTextOptions = {
      mentionedList: request.mentions?.map((id) => this.ensureSuffix(id)),
      quotedMsg: quotedMessageId,
      waitForAck: false,
    };
    const sent = await this.wpp!.sendText(
      this.ensureSuffix(request.chatId),
      request.text,
      options,
    );
    const message = this.toWAMessage(sent);
    const messageIdPart = this.getMessageIdPart(message.id);
    this.saveSentMessageId(messageIdPart);
    message.source = this.getMessageSource(messageIdPart);
    return message as any;
  }

  @Activity()
  async sendSeen(request: SendSeenRequest) {
    await this.wpp!.sendSeen(this.ensureSuffix(request.chatId));
  }

  @Activity()
  public async setPresence(presence: WAHAPresenceStatus, chatId?: string) {
    switch (presence) {
      case WAHAPresenceStatus.ONLINE:
        await this.wpp!.setOnlinePresence(true);
        break;
      case WAHAPresenceStatus.OFFLINE:
        await this.wpp!.setOnlinePresence(false);
        break;
      case WAHAPresenceStatus.TYPING: {
        await this.maintainPresenceOnline();
        const normalizedChatId = this.ensureSuffix(chatId);
        await this.wpp!.startTyping(normalizedChatId);
        break;
      }
      case WAHAPresenceStatus.RECORDING: {
        await this.maintainPresenceOnline();
        const normalizedChatId = this.ensureSuffix(chatId);
        await this.wpp!.startRecording(normalizedChatId);
        break;
      }
      case WAHAPresenceStatus.PAUSED: {
        await this.maintainPresenceOnline();
        const normalizedChatId = this.ensureSuffix(chatId);
        await Promise.all([
          this.wpp!.stopTyping(normalizedChatId),
          this.wpp!.stopRecording(normalizedChatId),
        ]);
        break;
      }
      default:
        throw new NotImplementedByEngineError(
          `WPP engine doesn't support '${presence}' presence.`,
        );
    }
    this.presence = presence;
  }

  public async getPresences(): Promise<WAHAChatPresences[]> {
    return Array.from(this.presencesByChatId.values());
  }

  @Activity()
  public async getPresence(id: string): Promise<WAHAChatPresences> {
    const chatId = this.ensureSuffix(id);
    await this.subscribePresence(chatId);
    const presence = this.presencesByChatId.get(chatId);
    if (presence) {
      return presence;
    }
    return {
      id: chatId,
      presences: [],
    };
  }

  @Activity()
  public async subscribePresence(id: string): Promise<any> {
    const chatId = this.ensureSuffix(id);
    await this.wpp!.subscribePresence(chatId);
    return null;
  }

  @Activity()
  public async sendTextStatus(status: TextStatus): Promise<any> {
    this.checkStatusRequest(status);
    const options: WppSendTextStatusOptions = {
      waitForAck: false,
    };
    if (status.font != null) {
      options.font = status.font;
    }
    if (status.backgroundColor != null) {
      options.backgroundColor = status.backgroundColor;
    }
    if (status.id) {
      options.messageId = status.id;
    }

    const sent = await this.wpp!.sendTextStatus(status.text, options);
    const sentId = extractWppMessageId(sent) || status.id || null;
    if (!sentId) {
      return {
        id: null,
        _data: sent,
      };
    }
    this.saveSentMessageId(this.getMessageIdPart(sentId));
    const sentMessage = await this.wpp!.getMessageById(sentId).catch(
      () => null,
    );
    if (!sentMessage) {
      return {
        id: sentId,
        _data: sent,
      };
    }
    return this.toWAMessage(sentMessage);
  }

  async getChats(pagination, filter: OverviewFilter | null = null) {
    const chats = await this.wpp!.listChats();
    let rows = chats.map((chat) => {
      return {
        ...chat,
        id: this.toChatId(chat),
      };
    });
    if (filter?.ids?.length) {
      const ids = new Set(filter.ids.map((id) => this.ensureSuffix(id)));
      rows = rows.filter((chat) => ids.has(chat.id));
    }

    const sortBy = this.toChatSortBy(pagination?.sortBy);
    const normalizedPagination = {
      ...pagination,
      sortBy: sortBy,
    };
    return new PaginatorInMemory(normalizedPagination).apply(rows);
  }

  public async getChatsOverview(
    pagination,
    filter?: OverviewFilter,
  ): Promise<ChatSummary[]> {
    pagination = {
      ...pagination,
      sortBy: ChatSortField.CONVERSATION_TIMESTAMP,
      sortOrder: SortOrder.DESC,
    };
    const chats = await this.getChats(pagination, filter);
    const promises = [];
    for (const chat of chats) {
      promises.push(this.fetchChatSummary(chat));
    }
    const result = await Promise.all(promises);
    return result;
  }

  protected async fetchChatSummary(chat: any): Promise<ChatSummary> {
    const chatId = this.toChatId(chat);
    const [picture, lastMessage] = await Promise.all([
      this.getContactProfilePicture(chatId, false),
      this.getLastMessage(chatId),
    ]);
    return {
      id: chatId,
      name: chat.name || null,
      picture: picture,
      lastMessage: lastMessage,
      _chat: chat,
    };
  }

  public async getChatMessages(
    chatId: string,
    query: GetChatMessagesQuery,
    filter: GetChatMessagesFilter,
  ): Promise<WAMessage[]> {
    if (chatId === 'all') {
      throw new NotImplementedByEngineError(
        "Can not get messages from 'all' in WPP",
      );
    }
    const id = this.ensureSuffix(chatId);

    const offset = query?.offset || 0;
    const limit = query?.limit || 10;
    const fetchCount = offset + limit;
    const downloadMedia = query.downloadMedia;
    const rawMessages = await this.wpp!.getMessages(id, {
      count: fetchCount,
      direction: 'before',
    });

    const messagesById = new Map<string, any>();
    for (const rawMessage of rawMessages) {
      const rawMessageId = Deserialized(rawMessage?.id);
      if (!rawMessageId) {
        continue;
      }
      messagesById.set(rawMessageId, rawMessage);
    }

    let messages = rawMessages.map((message) => this.toWAMessage(message));
    messages = this.filterMessages(messages, filter);
    messages = new PaginatorInMemory({
      limit: limit,
      offset: offset,
      sortBy: query?.sortBy || 'timestamp',
      sortOrder: query?.sortOrder || SortOrder.DESC,
    }).apply(messages);

    if (!downloadMedia) {
      return messages;
    }

    const promises = [];
    for (const message of messages) {
      const rawMessage = messagesById.get(message.id);
      if (!rawMessage) {
        promises.push(Promise.resolve(message));
        continue;
      }
      promises.push(this.processIncomingMessage(rawMessage, true));
    }
    let result = await Promise.all(promises);
    result = result.filter(Boolean);
    return result;
  }

  public async getChatMessage(
    chatId: string,
    messageId: string,
    query: GetChatMessageQuery,
  ): Promise<null | WAMessage> {
    void chatId;
    const message = await this.wpp!.getMessageById(messageId).catch(() => null);
    if (!message) {
      return null;
    }
    return this.processIncomingMessage(message, query.downloadMedia);
  }

  @Activity()
  public async deleteMessage(
    chatId: string,
    messageId: string,
  ): Promise<boolean> {
    const normalizedChatId = this.ensureSuffix(chatId);
    await this.wpp!.deleteMessage(normalizedChatId, messageId);
    return true;
  }

  @Activity()
  public async editMessage(
    chatId: string,
    messageId: string,
    request: EditMessageRequest,
  ): Promise<WAMessage> {
    void chatId;
    const options: WppEditMessageOptions = {};
    if (request.mentions?.length) {
      options.mentions = request.mentions.map((id) => this.ensureSuffix(id));
    }
    if (request.linkPreview != null) {
      options.linkPreview = request.linkPreview;
    }
    const sent = await this.wpp!.editMessage(messageId, request.text, options);
    return this.toWAMessage(sent);
  }

  @Activity()
  public deleteChat(chatId: string): Promise<boolean> {
    return this.wpp!.deleteChat(this.ensureSuffix(chatId));
  }

  @Activity()
  public clearMessages(chatId: string): Promise<boolean> {
    return this.wpp!.clearChat(this.ensureSuffix(chatId), true);
  }

  @Activity()
  public chatsArchiveChat(chatId: string): Promise<any> {
    return this.wpp!.archiveChat(this.ensureSuffix(chatId), true);
  }

  @Activity()
  public chatsUnarchiveChat(chatId: string): Promise<any> {
    return this.wpp!.archiveChat(this.ensureSuffix(chatId), false);
  }

  @Activity()
  public chatsUnreadChat(chatId: string): Promise<boolean> {
    return this.wpp!.markUnseenMessage(this.ensureSuffix(chatId));
  }

  @Activity()
  public async readChatMessages(
    chatId: string,
    request: ReadChatMessagesQuery,
  ): Promise<ReadChatMessagesResponse> {
    void request;
    await this.wpp!.sendSeen(this.ensureSuffix(chatId));
    return { ids: null };
  }

  @Activity()
  public async fetchContactProfilePicture(id: string): Promise<string | null> {
    const contactId = this.ensureSuffix(id);
    const profilePicture = await this.wpp!.getProfilePicFromServer(contactId);
    return (
      profilePicture?.eurl ||
      profilePicture?.imgFull ||
      profilePicture?.img ||
      null
    );
  }

  //
  // Contacts
  //

  public async getContact(query: ContactQuery) {
    const contact = await this.wpp!.getContact(
      this.ensureSuffix(query.contactId),
    );
    return this.toWAContact(contact);
  }

  public async getContacts(pagination: PaginationParams) {
    const contacts = await this.wpp!.getAllContacts();
    const rows = contacts.map((contact) => this.toWAContact(contact));
    return new PaginatorInMemory(pagination).apply(rows);
  }

  public async getContactAbout(
    query: ContactQuery,
  ): Promise<{ about: string }> {
    const result = await this.wpp!.getStatus(
      this.ensureSuffix(query.contactId),
    ).catch(() => null);
    if (!result) {
      return {
        about: null,
      };
    }
    if (typeof result === 'string') {
      return {
        about: result,
      };
    }
    return {
      about: result?.status || null,
    };
  }

  @Activity()
  public async blockContact(request: ContactRequest): Promise<void> {
    await this.wpp!.blockContact(this.ensureSuffix(request.contactId));
  }

  @Activity()
  public async unblockContact(request: ContactRequest): Promise<void> {
    await this.wpp!.unblockContact(this.ensureSuffix(request.contactId));
  }

  //
  // LID to Phone Number
  //

  public async getAllLids(
    pagination: PaginationParams,
  ): Promise<Array<LidToPhoneNumber>> {
    const lids = await this.listAllKnownLids();
    const paginator = new PaginatorInMemory(pagination);
    return paginator.apply(lids);
  }

  public async getLidsCount(): Promise<number> {
    const lids = await this.listAllKnownLids();
    return lids.length;
  }

  public async findPNByLid(lid: string): Promise<LidToPhoneNumber> {
    const normalizedLid = lid.includes('@') ? lid : `${lid}@lid`;
    const entry = await this.wpp!.getPnLidEntry(normalizedLid).catch(
      () => null,
    );
    return this.toLidMapping(entry, normalizedLid, null);
  }

  public async findLIDByPhoneNumber(
    phoneNumber: string,
  ): Promise<LidToPhoneNumber> {
    const normalizedPhoneNumber = this.ensureSuffix(phoneNumber);
    const entry = await this.wpp!.getPnLidEntry(normalizedPhoneNumber).catch(
      () => null,
    );
    return this.toLidMapping(entry, null, normalizedPhoneNumber);
  }

  //
  // Groups
  //

  @Activity()
  public createGroup(request: CreateGroupRequest): Promise<any> {
    const participants = request.participants.map((participant) =>
      this.ensureSuffix(participant.id),
    );
    return this.wpp!.createGroup(request.name, participants);
  }

  @Activity()
  public async joinGroup(code: string): Promise<string> {
    const response = await this.wpp!.joinGroup(code);
    const id = Deserialized(response?.id as any) || (response as any)?.id;
    return toCusFormat(id);
  }

  @Activity()
  public joinInfoGroup(code: string): Promise<any> {
    return this.wpp!.getGroupInfoFromInviteLink(code);
  }

  public async getGroups(pagination: PaginationParams): Promise<any> {
    const groups = await this.wpp!.listChats({
      onlyGroups: true,
    });
    const rows = groups.map((group) => ({
      ...group,
      id: this.toChatId(group),
    }));
    const normalizedPagination = {
      ...pagination,
      sortBy: this.toGroupSortBy(pagination?.sortBy),
    };
    return new PaginatorInMemory(normalizedPagination).apply(rows);
  }

  protected removeGroupsFieldParticipant(group: any) {
    delete group.participants;
    delete group.pendingParticipants;
    delete group.pastParticipants;
    delete group.membershipApprovalRequests;
    delete group.groupMetadata?.participants;
    delete group.groupMetadata?.pendingParticipants;
    delete group.groupMetadata?.pastParticipants;
    delete group.groupMetadata?.membershipApprovalRequests;
  }

  @Activity()
  public async refreshGroups(): Promise<boolean> {
    await this.wpp!.listChats({
      onlyGroups: true,
    });
    return true;
  }

  public getGroup(id: string): Promise<any> {
    return this.wpp!.getChatById(this.ensureSuffix(id));
  }

  public async getGroupParticipants(id: string): Promise<GroupParticipant[]> {
    const group = await this.wpp!.getChatById(this.ensureSuffix(id));
    const participants = group?.groupMetadata?.participants || [];
    return this.toGroupParticipants(participants);
  }

  public async getInfoAdminsOnly(id): Promise<SettingsSecurityChangeInfo> {
    const group = await this.wpp!.getChatById(this.ensureSuffix(id));
    const adminsOnly = Boolean(group?.groupMetadata?.restrict);
    return {
      adminsOnly: adminsOnly,
    };
  }

  @Activity()
  public setInfoAdminsOnly(id: string, value: boolean): Promise<boolean> {
    return this.wpp!.setGroupProperty(
      this.ensureSuffix(id),
      GroupProperty.RESTRICT,
      value,
    );
  }

  public async getMessagesAdminsOnly(
    id: string,
  ): Promise<SettingsSecurityChangeInfo> {
    const group = await this.wpp!.getChatById(this.ensureSuffix(id));
    const adminsOnly = Boolean(group?.groupMetadata?.announce);
    return {
      adminsOnly: adminsOnly,
    };
  }

  @Activity()
  public setMessagesAdminsOnly(id: string, value: boolean): Promise<boolean> {
    return this.wpp!.setGroupProperty(
      this.ensureSuffix(id),
      GroupProperty.ANNOUNCEMENT,
      value,
    );
  }

  @Activity()
  public deleteGroup(id: string): Promise<boolean> {
    return this.wpp!.deleteChat(this.ensureSuffix(id));
  }

  @Activity()
  public leaveGroup(id: string): Promise<void> {
    return this.wpp!.leaveGroup(this.ensureSuffix(id));
  }

  @Activity()
  public setDescription(id: string, description: string): Promise<boolean> {
    return this.wpp!.setGroupDescription(this.ensureSuffix(id), description);
  }

  protected async setGroupPicture(
    id: string,
    file: BinaryFile | RemoteFile,
  ): Promise<boolean> {
    const content = await this.fileToBuffer(file);
    const mimetype = MimetypeForDataUrl(file.mimetype || 'image/jpeg');
    const base64 = content.toString('base64');
    const media = `data:${mimetype};base64,${base64}`;
    await this.wpp!.setGroupIcon(this.ensureSuffix(id), media);
    return true;
  }

  protected deleteGroupPicture(id: string): Promise<boolean> {
    return this.wpp!.removeGroupIcon(this.ensureSuffix(id));
  }

  @Activity()
  public setSubject(id: string, subject: string): Promise<boolean> {
    return this.wpp!.setGroupSubject(this.ensureSuffix(id), subject);
  }

  @Activity()
  public async getInviteCode(id: string): Promise<string> {
    const inviteLink = await this.wpp!.getGroupInviteLink(
      this.ensureSuffix(id),
    );
    return this.unwrapGroupInviteCode(inviteLink);
  }

  @Activity()
  public async revokeInviteCode(id: string): Promise<string> {
    const inviteLink = await this.wpp!.revokeGroupInviteLink(
      this.ensureSuffix(id),
    );
    return this.unwrapGroupInviteCode(inviteLink);
  }

  public async getParticipants(id: string): Promise<any[]> {
    const group = await this.wpp!.getChatById(this.ensureSuffix(id));
    return group?.groupMetadata?.participants || [];
  }

  @Activity()
  public addParticipants(
    id: string,
    request: ParticipantsRequest,
  ): Promise<any> {
    const participants = request.participants.map((participant) =>
      this.ensureSuffix(participant.id),
    );
    return this.wpp!.addParticipant(this.ensureSuffix(id), participants);
  }

  @Activity()
  public removeParticipants(
    id: string,
    request: ParticipantsRequest,
  ): Promise<any> {
    const participants = request.participants.map((participant) =>
      this.ensureSuffix(participant.id),
    );
    return this.wpp!.removeParticipant(this.ensureSuffix(id), participants);
  }

  @Activity()
  public promoteParticipantsToAdmin(
    id: string,
    request: ParticipantsRequest,
  ): Promise<boolean> {
    const participants = request.participants.map((participant) =>
      this.ensureSuffix(participant.id),
    );
    return this.wpp!.promoteParticipant(this.ensureSuffix(id), participants);
  }

  @Activity()
  public demoteParticipantsToUser(
    id: string,
    request: ParticipantsRequest,
  ): Promise<true | void> {
    const participants = request.participants.map((participant) =>
      this.ensureSuffix(participant.id),
    );
    return this.wpp!.demoteParticipant(this.ensureSuffix(id), participants);
  }

  //
  // Labels
  //

  public async getLabels(): Promise<Label[]> {
    const labels = await this.wpp!.getAllLabels();
    return labels.map((label) => this.toLabel(label));
  }

  @Activity()
  public async createLabel(label: LabelDTO): Promise<Label> {
    const created = await this.wpp!.addNewLabel(label.name, {
      labelColor: label.color,
    } as any);
    return this.toLabel(created, label);
  }

  @Activity()
  public async updateLabel(label: Label): Promise<Label> {
    if (!this.wpp?.page) {
      throw new NotImplementedByEngineError('WPP page is not ready');
    }
    const updated = await this.wpp.page.evaluate(
      async (id, name, color) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!window?.WPP?.labels?.editLabel) {
          return null;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await window.WPP.labels.editLabel(id, {
          name: name,
          labelColor: color,
        });
      },
      label.id,
      label.name,
      label.color,
    );
    if (!updated) {
      throw new NotImplementedByEngineError(
        'WPP labels.editLabel is not available in current WPP state',
      );
    }
    return this.toLabel(updated, label);
  }

  @Activity()
  public async deleteLabel(label: Label): Promise<void> {
    await this.wpp!.deleteLabel(label.id);
  }

  public getChatsByLabelId(labelId: string): Promise<any> {
    return this.wpp!.listChats({
      withLabels: [labelId],
    });
  }

  public async getChatLabels(chatId: string): Promise<Label[]> {
    const normalizedChatId = this.ensureSuffix(chatId);
    const labels = await this.getLabels();
    const checks = labels.map(async (label) => {
      const chats = await this.wpp!.listChats({
        withLabels: [label.id],
      }).catch(() => []);
      const hasChat = chats.some(
        (chat) => this.toChatId(chat) === normalizedChatId,
      );
      if (!hasChat) {
        return null;
      }
      return label;
    });
    const rows = await Promise.all(checks);
    return rows.filter(Boolean);
  }

  @Activity()
  public async putLabelsToChat(chatId: string, labels: LabelID[]) {
    const normalizedChatId = this.ensureSuffix(chatId);
    const targetLabelIds = labels.map((label) => label.id);
    const currentLabels = await this.getChatLabels(normalizedChatId);
    const currentLabelIds = currentLabels.map((label) => label.id);

    const addLabelIds = lodash.difference(targetLabelIds, currentLabelIds);
    const removeLabelIds = lodash.difference(currentLabelIds, targetLabelIds);
    const operations = [
      ...addLabelIds.map((id) => ({
        labelId: id,
        type: 'add' as const,
      })),
      ...removeLabelIds.map((id) => ({
        labelId: id,
        type: 'remove' as const,
      })),
    ];
    if (operations.length === 0) {
      return;
    }
    await this.wpp!.addOrRemoveLabels(normalizedChatId, operations);
  }

  async requestCode(
    phoneNumber: string,
    method: string,
    params?: any,
  ): Promise<PairingCodeResponse> {
    void method;
    void params;
    if (!this.wpp?.page) {
      throw new Error('WPP page is not ready');
    }
    let code = this.pairingCode;
    if (!code) {
      code = await this.wpp.page.evaluate(async (phone) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!window?.WPP?.conn?.genLinkDeviceCodeForPhoneNumber) {
          return null;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await window.WPP.conn.genLinkDeviceCodeForPhoneNumber(phone);
      }, phoneNumber);
    }

    if (!code) {
      throw new NotImplementedByEngineError(
        'Pairing code is not available in current WPP state',
      );
    }
    const formatted = splitAt(code, 4).join('-');
    return { code: formatted };
  }

  public async getEngineInfo() {
    if (!this.wpp) {
      return null;
    }
    return {
      WWebVersion: await this.wpp.getWAVersion().catch(() => null),
      state: await this.wpp.getConnectionState().catch(() => null),
    };
  }

  subscribeEngineEvents2() {
    //
    // All engine events
    //
    const streams = buildWppStreams(this.wpp);
    const all$ = merge(...Object.values(streams)).pipe(
      retry({ delay: 2_000 }),
      share(),
    );
    this.events2.get(WAHAEvents.ENGINE_EVENT).switch(all$);

    //
    // Messages
    //
    const messages$ = streams.onMessage.pipe(
      map((p) => p.data),
      filter((msg) => msg?.type !== MessageType.GP2),
      filter((msg) => msg?.type !== MessageType.E2E_NOTIFICATION),
      filter((msg) => this.jids.include(msg?.chatId || msg?.from)),
      mergeMap((msg) => this.processIncomingWPPMessage(msg)),
    );
    this.events2.get(WAHAEvents.MESSAGE).switch(messages$);

    const messagesAny$ = streams.onAnyMessage.pipe(
      map((p) => p.data),
      filter((msg) => msg?.type !== MessageType.GP2),
      filter((msg) => msg?.type !== MessageType.E2E_NOTIFICATION),
      filter((msg) => this.jids.include(msg?.chatId || msg?.from)),
      mergeMap((msg) => this.processIncomingWPPMessage(msg)),
    );
    this.events2.get(WAHAEvents.MESSAGE_ANY).switch(messagesAny$);

    //
    // Message ACK
    // wppconnect's onAck fires via Backbone change:ack which passes
    // (model, ackValue, options) — three args packed by fromWppCallback into
    // an array. Occasionally only the ack level number arrives when the model
    // cannot be serialised through the Puppeteer IPC bridge; those are dropped
    // because there is no message context to build a proper ack body.
    //
    const messagesAck$ = streams.onAck.pipe(
      map((p) => p.data),
      map((data): WAMessageAckBody | null => {
        // plain ack number — no message context, nothing useful to emit
        if (typeof data === 'number') {
          return null;
        }
        // packed multi-arg: [model, ackValue, options]
        let model: any;
        let ackLevel: number;
        if (Array.isArray(data)) {
          [model, ackLevel] = data;
        } else {
          model = data;
          ackLevel = data?.ack;
        }
        if (!model?.id) {
          return null;
        }
        const msgId: string = Deserialized(model.id);
        const from: string =
          toCusFormat(model.id?.remote ?? model.from ?? model.chatId ?? '') ??
          null;
        const to: string = toCusFormat(model.to ?? '') ?? null;
        const fromMe: boolean = Boolean(model.id?.fromMe ?? model.fromMe);
        const ack: number =
          typeof ackLevel === 'number'
            ? ackLevel
            : model.ack ?? WAMessageAck.PENDING;
        return {
          id: msgId,
          from: from,
          to: to,
          participant: model.author ? toCusFormat(model.author) : null,
          fromMe: fromMe,
          ack: ack,
          ackName: WAMessageAck[ack] || ACK_UNKNOWN,
          _data: data,
        };
      }),
      filter(Boolean),
      filter(
        (ack) =>
          !!ack.id &&
          this.jids.include(isJidGroup(ack.from) ? ack.from : ack.to),
      ),
    );
    const messagesAckContacts$ = messagesAck$.pipe(
      filter((ack) => !isJidGroup(ack.to) && !isJidGroup(ack.from)),
      DistinctAck(),
    );
    const messagesAckGroups$ = messagesAck$.pipe(
      filter((ack) => isJidGroup(ack.to) || isJidGroup(ack.from)),
      DistinctAck(),
    );
    this.events2.get(WAHAEvents.MESSAGE_ACK).switch(messagesAckContacts$);
    this.events2.get(WAHAEvents.MESSAGE_ACK_GROUP).switch(messagesAckGroups$);

    //
    // Message Revoked
    // data: { author?, from, to, id, refId }
    //
    const messagesRevoked$ = streams.onRevokedMessage.pipe(
      map((p) => p.data),
      filter((data) => this.jids.include(data?.from || data?.to)),
      map((data): WAMessageRevokedBody => {
        const key = parseMessageIdSerialized(data.id);
        const editedKey = parseMessageIdSerialized(data.refId);
        return {
          revokedMessageId: editedKey.id,
          before: editedKey as any,
          after: key as any,
          _data: data,
        };
      }),
    );
    this.events2.get(WAHAEvents.MESSAGE_REVOKED).switch(messagesRevoked$);

    //
    // Message Reaction
    // data: { id, msgId, reactionText, read, sender, orphan, orphanReason, timestamp }
    //
    const messagesReaction$ = streams.onReactionMessage.pipe(
      map((p) => p.data),
      map((data) => WppReactionToMessageReaction(data)),
      filter((r) => this.jids.include(r.participant)),
    );
    this.events2.get(WAHAEvents.MESSAGE_REACTION).switch(messagesReaction$);

    //
    // Message Edited
    // onMessageEdit payload shape depends on WPP version:
    // - [chat, id, msg]
    // - { chat, id, msg }
    //
    const messagesEdit$ = streams.onMessageEdit.pipe(
      map((p) =>
        this.normalizeWppMessageEditData(p.data as WppMessageEditArgs | any),
      ),
      filter(Boolean),
      filter((payload) => {
        return this.jids.include(payload.chatId);
      }),
      map((payload): WAMessageEditedBody => {
        const message = this.toWAMessage(payload.message);
        const serializedOriginalId = payload.editedMessageId || message.id;
        // Short ID for DB lookup (matches how WEBJS uses message._data?.id?.id)
        const editedMessageId =
          parseMessageIdSerialized(serializedOriginalId, true).id ||
          serializedOriginalId;
        // Use the edit's own unique key as the event ID so ShouldProcessMessage
        // doesn't mistake it for the already-mapped original message
        const id = payload.editKey || message.id;
        return {
          ...message,
          id: id,
          editedMessageId: editedMessageId,
          _data: payload.raw,
        };
      }),
    );
    this.events2.get(WAHAEvents.MESSAGE_EDITED).switch(messagesEdit$);

    //
    // Presence
    //
    const presences$ = streams.onPresenceChanged.pipe(
      map((p) => p.data),
      filter((data) => this.jids.include(data?.id)),
      map((data): WAHAChatPresences => WppPresenceToPresence(data)),
      tap((presence) => {
        this.presencesByChatId.set(presence.id, {
          id: presence.id,
          presences: presence.presences.map((p) => ({ ...p })),
        });
      }),
    );
    this.events2.get(WAHAEvents.PRESENCE_UPDATE).switch(presences$);

    //
    // Groups – participant changes
    //
    const participantsChanged$ = streams.onParticipantsChanged.pipe(
      map((p) => p.data),
      share(),
    );

    const groupParticipants$ = participantsChanged$.pipe(
      filter(
        (data) =>
          !WppParticipantsIsMyJoin(data, this.getSessionMeInfo()) &&
          !WppParticipantsIsMyLeave(data, this.getSessionMeInfo()),
      ),
      map((data): GroupV2ParticipantsEvent | null =>
        WppParticipantsToGroupV2Participants(data),
      ),
      filter(Boolean),
    );
    this.events2
      .get(WAHAEvents.GROUP_V2_PARTICIPANTS)
      .switch(groupParticipants$);

    const groupV2Join$ = participantsChanged$.pipe(
      filter((data) => WppParticipantsIsMyJoin(data, this.getSessionMeInfo())),
      mergeMap(async (data): Promise<GroupV2JoinEvent> => {
        const groupId = toCusFormat(data.groupId);
        const group = await this.wpp!.getChatById(data.groupId);
        const participants = this.toGroupParticipants(
          group?.groupMetadata?.participants || [],
        );
        const groupInfo: GroupInfo = {
          id: groupId,
          subject: group?.name || '',
          description: group?.groupMetadata?.desc || '',
          invite: null,
          membersCanAddNewMember: !group?.groupMetadata?.restrict,
          membersCanSendMessages: !group?.groupMetadata?.announce,
          newMembersApprovalRequired:
            !!group?.groupMetadata?.membershipApprovalMode,
          participants: participants,
        };
        return {
          timestamp: Math.floor(Date.now() / 1000),
          group: groupInfo,
          _data: data,
        };
      }),
    );
    this.events2.get(WAHAEvents.GROUP_V2_JOIN).switch(groupV2Join$);

    const groupV2Leave$ = participantsChanged$.pipe(
      filter((data) => WppParticipantsIsMyLeave(data, this.getSessionMeInfo())),
      map((data): GroupV2LeaveEvent => WppParticipantsToGroupV2Leave(data)),
    );
    this.events2.get(WAHAEvents.GROUP_V2_LEAVE).switch(groupV2Leave$);

    const groupV2Update$ = streams.onAnyMessage.pipe(
      map((p) => p.data),
      filter((msg) => msg?.type === MessageType.GP2),
      distinct((msg) => msg?.id, interval(60_000)),
      map((msg): GroupV2UpdateEvent => WppGp2ToGroupV2Update(msg)),
      filter(Boolean),
    );
    this.events2.get(WAHAEvents.GROUP_V2_UPDATE).switch(groupV2Update$);

    //
    // Calls
    //
    const calls$ = streams.onIncomingCall.pipe(
      map((p) => this.normalizeWppIncomingCallData(p.data)),
      filter(Boolean),
    );
    this.events2.get(WAHAEvents.CALL_RECEIVED).switch(calls$);

    //
    // Poll Votes
    // data: { msgId, chatId, selectedOptions, timestamp, sender }
    //
    const pollVotes$ = streams.onPollResponse.pipe(
      map((p) => p.data),
      map((data): PollVotePayload | null => {
        const raw = data as any;
        const chatId = toCusFormat(Deserialized(raw.chatId));
        if (!chatId || !this.jids.include(chatId)) {
          return null;
        }
        const meId = this.getSessionMeInfo()?.id;
        const sender = toCusFormat(Deserialized(raw.sender));
        const fromMe = !!meId && toCusFormat(meId) === sender;
        const msgId = Deserialized(raw.msgId);
        return {
          poll: {
            id: msgId,
            from: fromMe ? sender : chatId,
            fromMe: fromMe,
            to: fromMe ? chatId : sender,
            participant: isJidGroup(chatId) ? sender : null,
          },
          vote: {
            id: msgId,
            from: sender,
            fromMe: fromMe,
            to: chatId,
            participant: isJidGroup(chatId) ? sender : null,
            selectedOptions: Array.isArray(data.selectedOptions)
              ? data.selectedOptions
                  .map((option) => option?.name)
                  .filter(Boolean)
              : [],
            timestamp: data.timestamp,
          },
          _data: data,
        };
      }),
      filter(Boolean),
    );
    this.events2.get(WAHAEvents.POLL_VOTE).switch(pollVotes$);

    //
    // Labels
    // data: { chat, ids, labels, type: 'add' | 'remove' }
    //
    const labelsUpdated$ = streams.onUpdateLabel.pipe(
      map((p) => p.data),
      mergeMap(
        (data): Observable<LabelChatAssociation> =>
          from(WppUpdateLabelToAssociations(data)),
      ),
      share(),
    );
    this.events2.get(WAHAEvents.LABEL_CHAT_ADDED).switch(
      streams.onUpdateLabel.pipe(
        map((p) => p.data),
        filter((data) => data.type === 'add'),
        mergeMap(
          (data): Observable<LabelChatAssociation> =>
            from(WppUpdateLabelToAssociations(data)),
        ),
      ),
    );
    this.events2.get(WAHAEvents.LABEL_CHAT_DELETED).switch(
      streams.onUpdateLabel.pipe(
        map((p) => p.data),
        filter((data) => data.type === 'remove'),
        mergeMap(
          (data): Observable<LabelChatAssociation> =>
            from(WppUpdateLabelToAssociations(data)),
        ),
      ),
    );
    void labelsUpdated$;

    //
    // State changes
    //
    const stateChanged$ = streams.onStateChange.pipe(map((p) => p.data));
    this.events2.get(WAHAEvents.STATE_CHANGE).switch(stateChanged$);
  }

  protected listenEngineEventsInDebugMode() {
    this.events2.get(WAHAEvents.ENGINE_EVENT).subscribe((data) => {
      this.logger.debug({ events: data }, `WPP event`);
    });
  }

  private toChatSortBy(sortBy?: string) {
    switch (sortBy) {
      case ChatSortField.CONVERSATION_TIMESTAMP:
        return 't';
      case ChatSortField.ID:
        return 'id';
      default:
        return sortBy;
    }
  }

  private toGroupSortBy(sortBy?: string): string {
    switch (sortBy) {
      case GroupSortField.ID:
        return 'id';
      case GroupSortField.SUBJECT:
        return 'groupMetadata.subject';
      default:
        return sortBy;
    }
  }

  private toChatId(chat: any): string {
    const id = chat?.id;
    if (typeof id === 'string') {
      return this.ensureSuffix(id);
    }
    return Deserialized(id);
  }

  private async listAllKnownLids(): Promise<Array<LidToPhoneNumber>> {
    const contacts = await this.wpp!.getAllContacts().catch(() => []);
    const ids = contacts
      .map((contact) => toCusFormat(Deserialized(contact?.id)))
      .filter(Boolean);

    const lookups = ids.map(async (id) =>
      this.wpp!.getPnLidEntry(id).catch(() => null),
    );
    const entries = await Promise.all(lookups);

    const byLid = new Map<string, LidToPhoneNumber>();
    for (const entry of entries) {
      const row = this.toLidMapping(entry, null, null);
      if (!row?.lid) {
        continue;
      }
      const existing = byLid.get(row.lid);
      if (!existing) {
        byLid.set(row.lid, row);
        continue;
      }
      if (!existing.pn && row.pn) {
        byLid.set(row.lid, row);
      }
    }
    return Array.from(byLid.values());
  }

  private toLidMapping(
    entry: any,
    fallbackLid: string | null,
    fallbackPhoneNumber: string | null,
  ): LidToPhoneNumber {
    const lid = toCusFormat(
      Deserialized(entry?.lid) || entry?.lid || fallbackLid || null,
    );
    const phoneNumber = toCusFormat(
      Deserialized(entry?.phoneNumber) ||
        entry?.phoneNumber ||
        fallbackPhoneNumber ||
        null,
    );
    return {
      lid: lid,
      pn: phoneNumber,
    };
  }

  private toWAContact(contact: any) {
    if (!contact) {
      return null;
    }
    const id = toCusFormat(Deserialized(contact.id));
    return {
      ...contact,
      id: id,
    };
  }

  protected async fileToBuffer(file: BinaryFile | RemoteFile): Promise<Buffer> {
    if ('url' in file) {
      return this.fetch(file.url);
    }
    return Buffer.from(file.data, 'base64');
  }

  private toGroupParticipants(participants: any[]): GroupParticipant[] {
    const result: GroupParticipant[] = [];
    for (const participant of participants) {
      result.push(this.toGroupParticipant(participant));
    }
    return result;
  }

  private toGroupParticipant(participant: any): GroupParticipant {
    const id = toCusFormat(Deserialized(participant?.id) || participant?.id);
    let role = GroupParticipantRole.PARTICIPANT;
    if (participant?.isSuperAdmin) {
      role = GroupParticipantRole.SUPERADMIN;
    } else if (participant?.isAdmin) {
      role = GroupParticipantRole.ADMIN;
    }
    return {
      id: id,
      pn: null,
      role: role,
    };
  }

  private toLabel(label: any, fallback?: Partial<LabelDTO>): Label {
    const color = label?.colorIndex ?? label?.color ?? fallback?.color ?? 0;
    return {
      id: String(label?.id || ''),
      name: label?.name || fallback?.name || '',
      color: color,
      colorHex: label?.hexColor || Label.toHex(color),
    };
  }

  private unwrapGroupInviteCode(inviteLink: string): string {
    if (!inviteLink) {
      return inviteLink;
    }
    if (inviteLink.includes('/')) {
      return parseGroupInviteLink(inviteLink);
    }
    return inviteLink;
  }

  private getMessageIdPart(messageId: string): string {
    if (!messageId) {
      return null;
    }
    const parts = messageId.split('_');
    if (parts.length >= 3) {
      return parts[2];
    }
    return messageId;
  }

  protected getReplyToMessageId(request: {
    reply_to?: string;
    replyTo?: string;
  }): string | undefined {
    return request.reply_to || request.replyTo || undefined;
  }

  private extractQuotedMessageId(
    message: any,
    quotedMessage: any,
  ): string | null {
    const quotedMessageId =
      Deserialized(quotedMessage?.id) ||
      this.serializeQuotedMessageId(message?.quotedMsgId) ||
      this.serializeQuotedMessageId(message?._data?.quotedMsgId) ||
      message?.quotedStanzaID ||
      message?._data?.quotedStanzaID ||
      message?.quotedStanzaId ||
      message?._data?.quotedStanzaId ||
      null;
    return quotedMessageId;
  }

  private serializeQuotedMessageId(value: any): string | null {
    if (!value) {
      return null;
    }
    const serialized = Deserialized(value);
    if (serialized) {
      return serialized;
    }
    try {
      return SerializeMsgKey(value);
    } catch (error) {
      void error;
      return null;
    }
  }

  protected toWAMessage(message: any): WAMessage {
    const serializedId = Deserialized(message?.id);
    const messageIdPart = this.getMessageIdPart(serializedId);
    const timestamp = message?.timestamp || message?.t || null;
    const ack = message?.ack ?? WAMessageAck.PENDING;
    const hasMedia = getHasMedia(message);
    const replyTo = this.extractReplyTo(message);
    return {
      id: serializedId,
      timestamp: timestamp,
      from: message?.from || null,
      fromMe: Boolean(message?.fromMe),
      source: this.getMessageSource(messageIdPart),
      to: message?.to || null,
      participant: message?.author || null,
      body: getMessageBody(message),
      hasMedia: hasMedia,
      media: null,
      mediaUrl: message?.clientUrl || null,
      ack: ack,
      ackName: WAMessageAck[ack] || ACK_UNKNOWN,
      location: null,
      vCards: null,
      replyTo: replyTo,
      _data: message,
    };
  }

  private normalizeWppMessageEditData(
    data: WppMessageEditArgs | any,
  ): WppMessageEditPayload | null {
    let chat: any;
    let id: any;
    let msg: any;
    if (Array.isArray(data)) {
      chat = data[0];
      id = data[1];
      msg = data[2];
    } else {
      chat = data?.chat;
      id = data?.id;
      msg = data?.msg ?? data?.message ?? data;
    }

    const rawChatId =
      Deserialized(msg?.chatId) ||
      Deserialized(msg?.from) ||
      Deserialized(chat) ||
      msg?.chatId ||
      msg?.from ||
      chat ||
      null;
    if (!rawChatId) {
      return null;
    }
    const editedMessageId =
      Deserialized(id) || Deserialized(msg?.id) || id || msg?.id || null;
    const editKey = Deserialized(msg?.latestEditMsgKey) || null;
    return {
      chatId: toCusFormat(rawChatId),
      editedMessageId: editedMessageId,
      editKey: editKey,
      message: msg,
      raw: data,
    };
  }

  private normalizeWppIncomingCallData(data: any): CallData | null {
    let call = data;
    if (Array.isArray(data)) {
      call = data[0];
    }
    if (Array.isArray(call)) {
      call = call[0];
    }
    if (!call || typeof call !== 'object') {
      return null;
    }

    const id = Deserialized(call.id) || call.id || null;
    const fromRaw =
      Deserialized(call.peerJid) ||
      Deserialized(call.from) ||
      call.peerJid ||
      call.from ||
      null;
    const from = fromRaw ? toCusFormat(fromRaw) : null;
    const timestampRaw = call.offerTime ?? call.timestamp ?? call.t ?? null;
    const timestamp =
      typeof timestampRaw === 'number'
        ? timestampRaw
        : Number(timestampRaw) || Math.floor(Date.now() / 1000);
    const isVideo = Boolean(call.isVideo);
    const isGroup = Boolean(call.isGroup);

    return {
      id: id,
      from: from,
      timestamp: timestamp,
      isVideo: isVideo,
      isGroup: isGroup,
      _data: data,
    };
  }

  protected extractReplyTo(message: any): ReplyToMessage | null {
    const quotedMessage = message?.quotedMsg || message?._data?.quotedMsg;
    const quotedMessageId = this.extractQuotedMessageId(message, quotedMessage);
    if (!quotedMessageId) {
      return null;
    }
    const quotedParticipant =
      message?.quotedParticipant ||
      message?._data?.quotedParticipant ||
      quotedMessage?.author ||
      quotedMessage?.from ||
      null;
    const hasMedia = getHasMedia(quotedMessage);
    return {
      id: quotedMessageId,
      participant: toCusFormat(
        Deserialized(quotedParticipant) || quotedParticipant,
      ),
      body: getMessageBody(quotedMessage),
      hasMedia: hasMedia,
      media: null,
      _data: quotedMessage,
    };
  }

  protected async processIncomingMessage(message: any, downloadMedia = true) {
    const wamessage = this.toWAMessage(message);
    if (downloadMedia) {
      const media = await this.downloadMediaSafe(message);
      wamessage.media = media;
    }
    if (downloadMedia && wamessage.replyTo?.hasMedia) {
      const quotedMessage = message?.quotedMsg || message?._data?.quotedMsg;
      if (quotedMessage) {
        wamessage.replyTo.media = await this.downloadMediaSafe(quotedMessage);
      }
    }
    return wamessage;
  }

  protected async downloadMedia(message: any): Promise<WAMedia | null> {
    const processor = new WPPEngineMediaProcessor(this.wpp);
    return this.mediaManager.processMedia(processor, message, this.name);
  }

  protected checkStatusRequest(request: { contacts?: any[] }) {
    if (request.contacts && request.contacts?.length > 0) {
      const msg =
        "WPP doesn't accept 'contacts'. Remove the field to send status to all contacts.";
      throw new UnprocessableEntityException(msg);
    }
  }

  protected async downloadMediaSafe(message): Promise<WAMedia | null> {
    try {
      return await this.downloadMedia(message);
    } catch (error) {
      this.logger.error('Failed when tried to download media for a message');
      this.logger.error(error, error.stack);
    }
    return null;
  }

  private filterMessages(
    messages: WAMessage[],
    filter?: GetChatMessagesFilter,
  ): WAMessage[] {
    if (!filter) {
      return messages;
    }
    return messages.filter((message) => {
      if (
        filter['filter.timestamp.lte'] != null &&
        message.timestamp > filter['filter.timestamp.lte']
      ) {
        return false;
      }
      if (
        filter['filter.timestamp.gte'] != null &&
        message.timestamp < filter['filter.timestamp.gte']
      ) {
        return false;
      }
      if (
        filter['filter.fromMe'] != null &&
        message.fromMe !== filter['filter.fromMe']
      ) {
        return false;
      }
      if (
        filter['filter.ack'] != null &&
        message.ack !== filter['filter.ack']
      ) {
        return false;
      }
      return true;
    });
  }

  private async getLastMessage(chatId: string): Promise<WAMessage | null> {
    if (!chatId) {
      return null;
    }
    const messages = await this.wpp!.getMessages(chatId, {
      count: 1,
      direction: 'before',
    }).catch(() => []);
    const last = lodash.last(messages);
    if (!last) {
      return null;
    }
    return this.toWAMessage(last);
  }

  private async processIncomingWPPMessage(msg: any) {
    if (msg?.fromMe) {
      await sleep(3_000);
    }
    return this.processIncomingMessage(msg, true);
  }

  private async refreshMeInfo() {
    const host = await this.wpp?.getHostDevice().catch(() => null);
    let id = Deserialized(host?.wid);
    if (!id) {
      id = (await this.wpp?.getWid().catch(() => null)) ?? null;
    }
    if (!id) {
      this.meInfo = null;
      return;
    }
    const lid = await this.wpp.getPnLidEntry(id).catch((error) => {
      this.logger.warn({ error }, `Failed get my lid by id ${id}`);
      return null;
    });
    this.meInfo = {
      id: Deserialized(id),
      lid: Deserialized(lid?.lid),
      pushName: host?.pushname || null,
    };
  }

  private applyStatusFind(status: StatusFind | keyof typeof StatusFind) {
    switch (status) {
      case StatusFind.notLogged:
        this.status = WAHASessionStatus.SCAN_QR_CODE;
        break;
      case StatusFind.isLogged:
      case StatusFind.inChat:
      case StatusFind.qrReadSuccess:
        this.status = WAHASessionStatus.WORKING;
        this.refreshMeInfo().catch((error) => {
          this.logger.warn({ error }, 'Failed to refresh WPP host info');
        });
        void this.authManager?.afterConnected();
        break;
      case StatusFind.browserClose:
      case StatusFind.serverClose:
        this.failed();
        break;
      case StatusFind.qrReadError:
      case StatusFind.qrReadFail:
      case StatusFind.disconnectedMobile:
      case StatusFind.phoneNotConnected:
      case StatusFind.autocloseCalled:
        this.status = WAHASessionStatus.FAILED;
        break;
      default:
        break;
    }
  }

  private applySocketState(state?: SocketState | null) {
    switch (state) {
      case SocketState.CONNECTED:
        this.status = WAHASessionStatus.WORKING;
        this.refreshMeInfo().catch((error) => {
          this.logger.warn({ error }, 'Failed to refresh WPP host info');
        });
        void this.authManager?.afterConnected();
        break;
      case SocketState.UNPAIRED:
      case SocketState.UNPAIRED_IDLE:
        this.status = WAHASessionStatus.SCAN_QR_CODE;
        break;
      case SocketState.OPENING:
      case SocketState.PAIRING:
        this.status = WAHASessionStatus.STARTING;
        break;
      case SocketState.CONFLICT:
      case SocketState.DEPRECATED_VERSION:
      case SocketState.PROXYBLOCK:
      case SocketState.SMB_TOS_BLOCK:
      case SocketState.TIMEOUT:
      case SocketState.TOS_BLOCK:
      case SocketState.UNLAUNCHED:
        this.status = WAHASessionStatus.FAILED;
        break;
      default:
        break;
    }
  }

  //
  // Channels methods
  //

  private wppChatToChannel(chat: any): Channel {
    const m = chat?.newsletterMetadata || {};
    const inviteCode = m?.invite || '';
    const picPath = m?.picture?.directPath || null;
    const picture = picPath ? getPublicUrlFromDirectPath(picPath) : null;
    const previewPath = m?.preview?.directPath || null;
    const preview = previewPath
      ? getPublicUrlFromDirectPath(previewPath)
      : picture;
    const role = (m?.viewerMetadata?.role ||
      m?.viewerMetadata?.viewRole ||
      ChannelRole.SUBSCRIBER) as ChannelRole;
    return {
      id: chat?.id || '',
      name: chat?.name || '',
      description: m?.description?.text || null,
      invite: getChannelInviteLink(inviteCode),
      preview: preview,
      picture: picture,
      verified: m?.verification === 'VERIFIED',
      role: role,
      subscribersCount: Number(m?.subscribersCount) || 0,
    };
  }

  private wppCreateResultToChannel(result: any): Channel {
    return {
      id: result?.idJid || '',
      name: result?.name || '',
      description: result?.description || null,
      invite:
        result?.inviteLink || getChannelInviteLink(result?.inviteCode || ''),
      preview: null,
      picture: null,
      verified: false,
      role: ChannelRole.OWNER,
      subscribersCount: result?.subscribersCount || 0,
    };
  }

  private listChatToChannel(chat: any): Channel {
    const pic = chat?.contact?.profilePicThumbObj;
    const picture = pic?.imgFull || pic?.img || pic?.eurl || null;
    const role = chat?.isReadOnly ? ChannelRole.SUBSCRIBER : ChannelRole.OWNER;
    return {
      id: chat?.id?._serialized || '',
      name: chat?.name || '',
      description: null,
      invite: '',
      preview: picture,
      picture: picture,
      verified: false,
      role: role,
      subscribersCount: 0,
    };
  }

  public async channelsList(query: ListChannelsQuery): Promise<Channel[]> {
    const chats = await this.wpp.listChats({ onlyNewsletter: true });
    let channels = (chats || []).map((chat: any) =>
      this.listChatToChannel(chat),
    );
    if (query.role) {
      channels = channels.filter((c) => c.role === (query.role as any));
    }
    return channels;
  }

  @Activity()
  public async channelsCreateChannel(
    request: CreateChannelRequest,
  ): Promise<Channel> {
    let result = await this.wpp!.createNewsletter(request.name, {
      description: request.description,
    });
    if (request.picture) {
      const buffer = await this.fileToBuffer(request.picture);
      const picture = WPPMedia(
        buffer,
        request.picture.mimetype || 'image/jpeg',
      );
      result = await this.wpp!.editNewsletter(result.idJid, {
        picture: picture,
      });
    }
    return this.wppCreateResultToChannel(result);
  }

  @Activity()
  public async channelsGetChannel(id: string): Promise<Channel> {
    const chats = await this.wpp.listChats({ onlyNewsletter: true });
    const chat = (chats || []).find((c: any) => c?.id?._serialized === id);
    if (!chat) {
      throw new NotFoundException(`Channel ${id} not found`);
    }
    return this.listChatToChannel(chat);
  }

  public channelsGetChannelByInviteCode(inviteCode: string): Promise<Channel> {
    void inviteCode;
    throw new NotImplementedByEngineError();
  }

  @Activity()
  public async channelsDeleteChannel(id: string): Promise<void> {
    await this.wpp!.destroyNewsletter(id);
  }

  @Activity()
  public async channelsFollowChannel(id: string): Promise<void> {
    await evaluateAndReturn(
      this.wpp!.page,
      async (channelId: string) => WPP.newsletter.follow(channelId),
      id,
    );
  }

  @Activity()
  public async channelsUnfollowChannel(id: string): Promise<void> {
    await evaluateAndReturn(
      this.wpp!.page,
      async (channelId: string) => WPP.newsletter.unfollow(channelId),
      id,
    );
  }

  @Activity()
  public async channelsMuteChannel(id: string): Promise<void> {
    await this.wpp!.muteNesletter(id);
  }

  @Activity()
  public async channelsUnmuteChannel(id: string): Promise<void> {
    await evaluateAndReturn(
      this.wpp!.page,
      async (channelId: string) => WPP.newsletter.mute(channelId, false),
      id,
    );
  }

  public async previewChannelMessages(
    inviteCode: string,
    query: PreviewChannelMessages,
  ): Promise<ChannelMessage[]> {
    const messages = await this.getChatMessages(inviteCode, query, {});
    return messages.map((message) => {
      return {
        message: message,
        reactions: {},
        viewCount: 0,
      };
    });
  }

  public searchChannelsByView(
    query: ChannelSearchByView,
  ): Promise<ChannelListResult> {
    void query;
    throw new NotImplementedByEngineError();
  }

  @Activity()
  public async searchChannelsByText(
    query: ChannelSearchByText,
  ): Promise<ChannelListResult> {
    const result = await evaluateAndReturn(
      this.wpp!.page,
      async (
        text: string,
        categories: string[],
        limit: number,
        startCursor: string,
      ) =>
        WPP.newsletter.search(text, {
          categories: categories,
          limit: limit,
          cursorToken: startCursor || undefined,
        }),
      query.text,
      query.categories || [],
      query.limit || 50,
      query.startCursor || '',
    );
    const channels: ChannelPublicInfo[] = (result?.newsletters || []).map(
      (n: any) => ({
        id: n.idJid || '',
        name: n.name || '',
        description: n.description || null,
        invite: getChannelInviteLink(n.inviteCode || ''),
        preview: null,
        picture: n.picture || null,
        verified: n.verification === 'VERIFIED',
        subscribersCount: n.subscribersCount || 0,
      }),
    );
    const pageInfo = result?.pageInfo;
    return {
      channels: channels,
      page: {
        startCursor: query.startCursor || null,
        endCursor: pageInfo?.endCursor || null,
        hasNextPage: pageInfo?.hasNextPage || false,
        hasPreviousPage: Boolean(query.startCursor),
      },
    };
  }
}

function extractWppMessageId(response: unknown): string | null {
  if (!response || typeof response !== 'object') {
    return null;
  }
  const payload = response as { id?: unknown };
  if (typeof payload.id !== 'string') {
    return null;
  }
  return payload.id;
}

function extractBase64(value: string): string | null {
  if (!value) {
    return null;
  }
  if (!value.startsWith('data:')) {
    return value;
  }
  const commaIndex = value.indexOf(',');
  if (commaIndex < 0) {
    return null;
  }
  return value.slice(commaIndex + 1);
}

function getHasMedia(message: any) {
  if (message?.type === 'revoked') {
    return false;
  }
  return Boolean(message?.isMedia || message?.isMMS || message?.mimetype);
}

function getMessageBody(message: any) {
  if (getHasMedia(message)) {
    return message.caption;
  }
  return message.body;
}

export class WPPEngineMediaProcessor implements IMediaEngineProcessor<any> {
  constructor(private readonly wpp?: WPPWhatsapp) {}

  hasMedia(message: any): boolean {
    return getHasMedia(message);
  }

  getFilename(message: any): string | null {
    return message?.filename || null;
  }

  getMimetype(message: any): string {
    return message?.mimetype || 'application/octet-stream';
  }

  getMessageId(message: any): string {
    return Deserialized(message.id);
  }

  getChatId(message: any): string {
    const chatId = Deserialized(message.chatId);
    return toCusFormat(chatId) ?? toCusFormat(message?.from ?? '') ?? null;
  }

  async getMediaBuffer(message: any): Promise<Buffer | null> {
    const base64OrDataUri = await this.wpp.downloadMedia(message);
    if (!base64OrDataUri || typeof base64OrDataUri !== 'string') {
      return null;
    }
    const base64 = extractBase64(base64OrDataUri);
    if (!base64) {
      return null;
    }
    return Buffer.from(base64, 'base64');
  }
}

/**
 * WPP media transport format to base64 with mimetype
 */
export function WPPMedia(content: Buffer, mimetype: string): string {
  mimetype = MimetypeForDataUrl(mimetype);
  const data = content.toString('base64');
  return `data:${mimetype};base64,${data}`;
}

export function MimetypeForDataUrl(mimetype: string): string {
  return mimetype
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .join(';')
    .replace(/\s*=\s*/g, '=');
}
