import {
  SECOND,
  WAEvents,
  WhatsappEngine,
  WhatsappStatus,
} from '../structures/enums.dto';
import makeWASocket, {
  DisconnectReason,
  isJidGroup,
  makeInMemoryStore,
  useMultiFileAuthState,
} from '@adiwajshing/baileys';

import {
  ensureSuffix,
  WAHAInternalEvent,
  WhatsappSession,
} from './abc/session.abc';
import { WAMessage, WANumberExistResult } from '../structures/responses.dto';
import {
  Button,
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
  SendSeenRequest,
} from '../structures/chatting.dto';
import {
  AvailableInPlusVersion,
  NotImplementedByEngineError,
} from './exceptions';
import { ContactQuery, ContactRequest } from '../structures/contacts.dto';
import {
  CreateGroupRequest,
  ParticipantsRequest,
} from '../structures/groups.dto';
import { QR } from './QR';
import { UnprocessableEntityException } from '@nestjs/common';
import { Message } from 'whatsapp-web.js';
import * as fs from 'fs';
import { Agent } from 'https';
import { createAgentProxy } from './helpers.proxy';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const QRCode = require('qrcode');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require('pino')();

export const BaileysEvents = {
  CONNECTION_UPDATE: 'connection.update',
  CREDS_UPDATE: 'creds.update',
  MESSAGES_UPSERT: 'messages.upsert',
  GROUPS_UPSERT: 'groups.upsert',
};

export class WhatsappSessionNoWebCore extends WhatsappSession {
  engine = WhatsappEngine.NOWEB;

  sock: any;
  store: any;
  private qr: QR;
  authFolder: string;

  public constructor(config) {
    super(config);
    this.qr = new QR();
    this.authFolder = this.getAuthFolder();
  }

  start() {
    return this.buildClient();
  }

  protected getAuthFolder() {
    const folder = this.sessionStorage.getFolderPath(this.name);
    return fs.mkdtempSync(folder);
  }

  async makeSocket() {
    const { state, saveCreds } = await useMultiFileAuthState(this.authFolder);
    const agent = this.makeAgent();
    const sock: any = makeWASocket({
      agent: agent,
      fetchAgent: agent,
      auth: state,
      printQRInTerminal: true,
      browser: ['Linux', 'Chrome', '111.0.5563.64'],
      logger: logger,
    });
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
    if (!this.store) {
      this.store = makeInMemoryStore({});
    }
    this.store.bind(this.sock.ev);
  }

  async buildClient() {
    this.sock = await this.makeSocket();
    this.connectStore();
    this.sock.ev.on(BaileysEvents.CONNECTION_UPDATE, async (update) => {
      const { connection, lastDisconnect, qr } = update;
      if (connection === 'connecting') {
        this.qr.save('');
        this.status = WhatsappStatus.WORKING;
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
        this.status = WhatsappStatus.FAILED;
        // reconnect if not logged out
        if (shouldReconnect) {
          setTimeout(() => this.buildClient(), 2 * SECOND);
        }
      }

      // Save QR
      if (qr) {
        this.status = WhatsappStatus.SCAN_QR_CODE;
        QRCode.toDataURL(qr).then((url) => {
          this.qr.save(url);
        });
      }
    });
    this.events.emit(WAHAInternalEvent.engine_start);
  }

  stop() {
    this.sock.ws.removeAllListeners();
    this.log.log('socket connection terminated');
    return;
  }

  /**
   * START - Methods for API
   */
  async getScreenshot(): Promise<Buffer | string> {
    if (this.status === WhatsappStatus.STARTING) {
      throw new UnprocessableEntityException(
        `The session is starting, please try again after few seconds`,
      );
    } else if (this.status === WhatsappStatus.SCAN_QR_CODE) {
      return Promise.resolve(this.qr.get());
    } else if (this.status === WhatsappStatus.WORKING) {
      throw new UnprocessableEntityException(
        `Can not get screenshot for non chrome based engine.`,
      );
    } else {
      throw new UnprocessableEntityException(`Unknown status - ${this.status}`);
    }
  }

  async checkNumberStatus(
    request: CheckNumberStatusQuery,
  ): Promise<WANumberExistResult> {
    const phone = request.phone.split('@')[0];
    const [result] = await this.sock.onWhatsApp(phone);
    if (!result) {
      return { numberExists: false };
    }
    return { numberExists: result.exists };
  }

  sendText(request: MessageTextRequest) {
    const chatId = this.ensureSuffix(request.chatId);
    return this.sock.sendMessage(chatId, { text: request.text });
  }

  sendTextButtons(request: MessageTextButtonsRequest) {
    const buttons = request.buttons.map((button: Button) => {
      return {
        buttonId: button.id,
        buttonText: { displayText: button.text },
        type: 1,
      };
    });

    const buttonMessage = {
      text: request.title,
      buttons: buttons,
      headerType: 1,
    };

    return this.sock.sendMessage(request.chatId, buttonMessage);
  }

  sendContactVCard(request: MessageContactVcardRequest) {
    throw new NotImplementedByEngineError();
  }

  async reply(request: MessageReplyRequest) {
    const { id } = parseMessageId(request.reply_to);
    const message = await this.store.loadMessage(toJID(request.chatId), id);
    return await this.sock.sendMessage(
      request.chatId,
      { text: request.text },
      { quoted: message },
    );
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

  async getMessages(query: GetMessageQuery) {
    throw new NotImplementedByEngineError();
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

  /**
   * END - Methods for API
   */

  subscribe(event, handler) {
    if (event === WAEvents.MESSAGE) {
      return this.sock.ev.on(BaileysEvents.MESSAGES_UPSERT, ({ messages }) =>
        this.handleIncomingMessages(messages, handler, false),
      );
    } else if (event === WAEvents.MESSAGE_ANY) {
      return this.sock.ev.on(BaileysEvents.MESSAGES_UPSERT, ({ messages }) =>
        this.handleIncomingMessages(messages, handler, true),
      );
    } else if (event === WAEvents.STATE_CHANGE) {
      return this.sock.ev.on(BaileysEvents.CONNECTION_UPDATE, handler);
    } else if (event === WAEvents.GROUP_JOIN) {
      return this.sock.ev.on(BaileysEvents.GROUPS_UPSERT, handler);
    } else {
      throw new NotImplementedByEngineError(
        `Engine does not support webhook event: ${event}`,
      );
    }
  }

  private handleIncomingMessages(messages, handler, includeFromMe) {
    for (const message of messages) {
      // if there is no text or media message
      if (!message) return;
      if (!message.message) return;
      // Do not include my messages
      if (!includeFromMe && message.key.fromMe) {
        continue;
      }
      this.processIncomingMessage(message).then(handler);
    }
  }

  private processIncomingMessage(message) {
    return this.downloadMedia(message).then(this.toWAMessage);
  }

  protected toWAMessage(message): Promise<WAMessage> {
    const isGroupMessage = Boolean(message.key.participant);
    let participant: string;
    let to: string;
    if (isGroupMessage) {
      participant = message.key.participant;
      to = message.key.remoteJid;
    }
    const from = message.key.remoteJid;
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
      from: toCusFormat(from),
      fromMe: message.key.fromMe,
      body: body,
      to: toCusFormat(to),
      participant: toCusFormat(participant),
      // @ts-ignore
      hasMedia: Boolean(message.mediaUrl),
      // @ts-ignore
      mediaUrl: message.mediaUrl,
      // @ts-ignore
      ack: message.ack,
      location: message.location,
      vCards: message.vCards,
      _data: message,
    });
  }

  protected async downloadMedia(message: Message) {
    if (!message.hasMedia) {
      return message;
    }

    // @ts-ignore
    message.mediaUrl = await this.storage.save(message.key.id, '', undefined);
    return message;
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
  const number = remoteJid.split('@')[0];
  return ensureSuffix(number);
}

/**
 * Convert from 11111111111@c.us to 11111111111@s.whatsapp.net
 * @param chatId
 */
function toJID(chatId) {
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
