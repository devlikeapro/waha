import { ConsoleLogger } from '@nestjs/common';
import { EventEmitter } from 'events';
import * as fs from 'fs';
import { MessageId } from 'whatsapp-web.js';

import { OTPRequest, RequestCodeRequest } from '../../structures/auth.dto';
import {
  ChatRequest,
  CheckNumberStatusQuery,
  GetMessageQuery,
  MessageContactVcardRequest,
  MessageFileRequest,
  MessageImageRequest,
  MessageLinkPreviewRequest,
  MessageLocationRequest,
  MessagePollRequest,
  MessageReactionRequest,
  MessageReplyRequest,
  MessageTextRequest,
  MessageVideoRequest,
  MessageVoiceRequest,
} from '../../structures/chatting.dto';
import { ContactQuery, ContactRequest } from '../../structures/contacts.dto';
import {
  WAHAEngine,
  WAHAEvents,
  WAHAPresenceStatus,
  WAHASessionStatus,
} from '../../structures/enums.dto';
import {
  CreateGroupRequest,
  ParticipantsRequest,
  SettingsSecurityChangeInfo,
} from '../../structures/groups.dto';
import { WAHAChatPresences } from '../../structures/presence.dto';
import {
  MeInfo,
  ProxyConfig,
  SessionConfig,
} from '../../structures/sessions.dto';
import {
  ImageStatus,
  TextStatus,
  VideoStatus,
  VoiceStatus,
} from '../../structures/status.dto';
import { WASessionStatusBody } from '../../structures/webhooks.dto';
import { NotImplementedByEngineError } from '../exceptions';
import { QR } from '../QR';
import { MediaManager } from './media.abc';
import { LocalSessionStorage } from './storage.abc';

const CHROME_PATH = '/usr/bin/google-chrome-stable';
const CHROMIUM_PATH = '/usr/bin/chromium';

export function getBrowserExecutablePath() {
  if (fs.existsSync(CHROME_PATH)) {
    return CHROME_PATH;
  }
  return CHROMIUM_PATH;
}

export function ensureSuffix(phone) {
  const suffix = '@c.us';
  if (phone.includes('@')) {
    return phone;
  }
  return phone + suffix;
}

export enum WAHAInternalEvent {
  ENGINE_START = 'engine.start',
  SESSION_STATUS_CHANGED = 'session.status.changed',
}

export interface SessionParams {
  name: string;
  mediaManager: MediaManager;
  log: ConsoleLogger;
  sessionStorage: LocalSessionStorage;
  proxyConfig?: ProxyConfig;
  sessionConfig?: SessionConfig;
}

export abstract class WhatsappSession {
  public events: EventEmitter;
  public engine: WAHAEngine;

  public name: string;
  protected mediaManager: MediaManager;
  protected log: ConsoleLogger;
  protected sessionStorage: LocalSessionStorage;
  protected proxyConfig?: ProxyConfig;
  public sessionConfig?: SessionConfig;

  private _status: WAHASessionStatus;

  public constructor({
    name,
    log,
    sessionStorage,
    proxyConfig,
    mediaManager,
    sessionConfig,
  }: SessionParams) {
    this.events = new EventEmitter();
    this.name = name;
    this.proxyConfig = proxyConfig;
    this.log = log;
    this.sessionStorage = sessionStorage;
    this.mediaManager = mediaManager;
    this.sessionConfig = sessionConfig;
  }

  protected set status(value: WAHASessionStatus) {
    this._status = value;
    this.events.emit(WAHAInternalEvent.SESSION_STATUS_CHANGED, value);
  }

  public get status() {
    return this._status;
  }

  getBrowserExecutablePath() {
    return getBrowserExecutablePath();
  }

  getBrowserArgsForPuppeteer() {
    // Run optimized version of Chrome
    // References:
    // https://github.com/pedroslopez/whatsapp-web.js/issues/1420
    // https://www.bannerbear.com/blog/ways-to-speed-up-puppeteer-screenshots/
    return [
      '--no-sandbox',
      '--disable-client-side-phishing-detection',
      '--disable-setuid-sandbox',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-popup-blocking',
      '--disable-offer-store-unmasked-wallet-cards',
      '--disable-speech-api',
      '--hide-scrollbars',
      '--mute-audio',
      '--disable-extensions',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-default-browser-check',
      '--no-pings',
      '--password-store=basic',
      '--use-mock-keychain',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
    ];
  }

  protected isDebugEnabled() {
    return this.log.isLevelEnabled('debug');
  }

  /** Start the session */
  abstract start();

  /** Stop the session */
  abstract stop(): Promise<void>;

  /** Subscribe the handler to specific hook */
  subscribeSessionEvent(
    hook: WAHAEvents | string,
    handler: (message) => void,
  ): boolean {
    switch (hook) {
      case WAHAEvents.SESSION_STATUS:
        this.events.on(WAHAInternalEvent.SESSION_STATUS_CHANGED, (value) => {
          const body: WASessionStatusBody = { name: this.name, status: value };
          handler(body);
        });
        return true;
      default:
        return false;
    }
  }

  abstract subscribeEngineEvent(
    hook: WAHAEvents | string,
    handler: (message) => void,
  ): boolean;

  /**
   * START - Methods for API
   */

  /**
   * Auth methods
   */

  public getQR(): QR {
    throw new NotImplementedByEngineError();
  }

  public requestCode(phoneNumber: string, method: string) {
    throw new NotImplementedByEngineError();
  }

  public authorizeCode(code: string) {
    throw new NotImplementedByEngineError();
  }

  abstract getScreenshot(): Promise<Buffer>;

  public getSessionMeInfo(): Promise<MeInfo | null> {
    throw new NotImplementedByEngineError();
  }

  /**
   * Other methods
   */
  abstract checkNumberStatus(request: CheckNumberStatusQuery);

  abstract sendText(request: MessageTextRequest);

  sendContactVCard(request: MessageContactVcardRequest) {
    throw new NotImplementedByEngineError();
  }

  sendPoll(request: MessagePollRequest) {
    throw new NotImplementedByEngineError();
  }

  abstract sendLocation(request: MessageLocationRequest);

  sendLinkPreview(request: MessageLinkPreviewRequest) {
    throw new NotImplementedByEngineError();
  }

  abstract sendImage(request: MessageImageRequest);

  abstract sendFile(request: MessageFileRequest);

  abstract sendVoice(request: MessageVoiceRequest);

  sendVideo(request: MessageVideoRequest) {
    throw new NotImplementedByEngineError();
  }

  abstract reply(request: MessageReplyRequest);

  abstract sendSeen(chat: ChatRequest);

  abstract startTyping(chat: ChatRequest);

  abstract stopTyping(chat: ChatRequest);

  getMessages(query: GetMessageQuery) {
    throw new NotImplementedByEngineError();
  }

  abstract setReaction(request: MessageReactionRequest);

  /**
   * Chats methods
   */
  public getChats() {
    throw new NotImplementedByEngineError();
  }

  public deleteChat(chatId) {
    throw new NotImplementedByEngineError();
  }

  public getChatMessages(
    chatId: string,
    limit: number,
    downloadMedia: boolean,
  ) {
    throw new NotImplementedByEngineError();
  }

  public clearMessages(chatId) {
    throw new NotImplementedByEngineError();
  }

  /**
   * Contacts methods
   */
  public getContact(query: ContactQuery) {
    throw new NotImplementedByEngineError();
  }

  public getContacts() {
    throw new NotImplementedByEngineError();
  }

  public getContactAbout(query: ContactQuery) {
    throw new NotImplementedByEngineError();
  }

  public getContactProfilePicture(query: ContactQuery) {
    throw new NotImplementedByEngineError();
  }

  public blockContact(request: ContactRequest) {
    throw new NotImplementedByEngineError();
  }

  public unblockContact(request: ContactRequest) {
    throw new NotImplementedByEngineError();
  }

  /**
   * Group methods
   */
  public createGroup(request: CreateGroupRequest) {
    throw new NotImplementedByEngineError();
  }

  public getGroups() {
    throw new NotImplementedByEngineError();
  }

  public getGroup(id) {
    throw new NotImplementedByEngineError();
  }

  public getInfoAdminsOnly(id): Promise<SettingsSecurityChangeInfo> {
    throw new NotImplementedByEngineError();
  }

  public setInfoAdminsOnly(id, value) {
    throw new NotImplementedByEngineError();
  }

  public deleteGroup(id) {
    throw new NotImplementedByEngineError();
  }

  public leaveGroup(id) {
    throw new NotImplementedByEngineError();
  }

  public setDescription(id, description) {
    throw new NotImplementedByEngineError();
  }

  public setSubject(id, description) {
    throw new NotImplementedByEngineError();
  }

  public getInviteCode(id): Promise<string> {
    throw new NotImplementedByEngineError();
  }

  public revokeInviteCode(id): Promise<string> {
    throw new NotImplementedByEngineError();
  }

  public getParticipants(id) {
    throw new NotImplementedByEngineError();
  }

  public addParticipants(id, request: ParticipantsRequest) {
    throw new NotImplementedByEngineError();
  }

  public removeParticipants(id, request: ParticipantsRequest) {
    throw new NotImplementedByEngineError();
  }

  public promoteParticipantsToAdmin(id, request: ParticipantsRequest) {
    throw new NotImplementedByEngineError();
  }

  public demoteParticipantsToUser(id, request: ParticipantsRequest) {
    throw new NotImplementedByEngineError();
  }

  public setPresence(presence: WAHAPresenceStatus, chatId?: string) {
    throw new NotImplementedByEngineError();
  }

  public getPresences(): Promise<WAHAChatPresences[]> {
    throw new NotImplementedByEngineError();
  }

  public getPresence(id: string): Promise<WAHAChatPresences> {
    throw new NotImplementedByEngineError();
  }

  public subscribePresence(id: string): Promise<void> {
    throw new NotImplementedByEngineError();
  }

  /**
   * Status methods
   */
  public sendTextStatus(status: TextStatus) {
    throw new NotImplementedByEngineError();
  }

  public sendImageStatus(status: ImageStatus) {
    throw new NotImplementedByEngineError();
  }

  public sendVoiceStatus(status: VoiceStatus) {
    throw new NotImplementedByEngineError();
  }

  public sendVideoStatus(status: VideoStatus) {
    throw new NotImplementedByEngineError();
  }

  /**
   * END - Methods for API
   */

  /**
   * Add WhatsApp suffix (@c.us) to the phone number if it doesn't have it yet
   * @param phone
   */
  protected ensureSuffix(phone) {
    return ensureSuffix(phone);
  }

  protected deserializeId(messageId: string): MessageId {
    const parts = messageId.split('_');
    return {
      fromMe: parts[0] === 'true',
      remote: parts[1],
      id: parts[2],
      _serialized: messageId,
    };
  }
}
