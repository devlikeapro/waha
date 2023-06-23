import { ConsoleLogger } from '@nestjs/common';
import { EventEmitter } from 'events';
import * as fs from 'fs';
import { MessageId } from 'whatsapp-web.js';

import {
  ChatRequest,
  CheckNumberStatusQuery,
  GetMessageQuery,
  MessageContactVcardRequest,
  MessageFileRequest,
  MessageImageRequest,
  MessageLinkPreviewRequest,
  MessageLocationRequest,
  MessageReactionRequest,
  MessageReplyRequest,
  MessageTextButtonsRequest,
  MessageTextRequest,
  MessageVoiceRequest,
} from '../../structures/chatting.dto';
import { ContactQuery, ContactRequest } from '../../structures/contacts.dto';
import {
  WAHAEngine,
  WAHAEvents,
  WAHASessionStatus,
} from '../../structures/enums.dto';
import {
  CreateGroupRequest,
  ParticipantsRequest,
} from '../../structures/groups.dto';
import { WAHAChatPresences } from '../../structures/presence.dto';
import { ProxyConfig, SessionConfig } from '../../structures/sessions.dto';
import { NotImplementedByEngineError } from '../exceptions';
import { LocalSessionStorage, MediaStorage } from './storage.abc';

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
  engine_start = 'engine.start',
}

export interface SessionParams {
  name: string;
  storage: MediaStorage;
  log: ConsoleLogger;
  sessionStorage: LocalSessionStorage;
  proxyConfig?: ProxyConfig;
  sessionConfig: SessionConfig;
}

export abstract class WhatsappSession {
  public status: WAHASessionStatus;
  public events: EventEmitter;
  public engine: WAHAEngine;

  public name: string;
  protected storage: MediaStorage;
  protected log: ConsoleLogger;
  protected sessionStorage: LocalSessionStorage;
  protected proxyConfig?: ProxyConfig;
  public sessionConfig: SessionConfig;

  public constructor({
    name,
    log,
    sessionStorage,
    proxyConfig,
    storage,
    sessionConfig,
  }: SessionParams) {
    this.name = name;
    this.proxyConfig = proxyConfig;
    this.status = WAHASessionStatus.STARTING;
    this.log = log;
    this.sessionStorage = sessionStorage;
    this.events = new EventEmitter();
    this.storage = storage;
    this.sessionConfig = sessionConfig;
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

  /** Start the session */
  abstract start();

  /** Stop the session */
  abstract stop(): void;

  /** Subscribe the handler to specific hook */
  abstract subscribe(hook: WAHAEvents | string, handler: (message) => void);

  /**
   * START - Methods for API
   */
  abstract getScreenshot(): Promise<Buffer | string>;

  abstract checkNumberStatus(request: CheckNumberStatusQuery);

  abstract sendText(request: MessageTextRequest);

  abstract sendContactVCard(request: MessageContactVcardRequest);

  abstract sendTextButtons(request: MessageTextButtonsRequest);

  abstract sendLocation(request: MessageLocationRequest);

  abstract sendLinkPreview(request: MessageLinkPreviewRequest);

  abstract sendImage(request: MessageImageRequest);

  abstract sendFile(request: MessageFileRequest);

  abstract sendVoice(request: MessageVoiceRequest);

  abstract reply(request: MessageReplyRequest);

  abstract sendSeen(chat: ChatRequest);

  abstract startTyping(chat: ChatRequest);

  abstract stopTyping(chat: ChatRequest);

  abstract getMessages(query: GetMessageQuery);

  abstract setReaction(request: MessageReactionRequest);

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
