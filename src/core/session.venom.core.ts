import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
import * as Buffer from 'buffer';
import { create, CreateConfig, Message, Whatsapp } from 'venom-bot';

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
  MessageTextRequest,
  WANumberExistResult,
} from '../structures/chatting.dto';
import {
  WAHAEngine,
  WAHAEvents,
  WAHASessionStatus,
} from '../structures/enums.dto';
import { WAMessage } from '../structures/responses.dto';
import { IEngineMediaProcessor } from './abc/media.abc';
import { WAHAInternalEvent, WhatsappSession } from './abc/session.abc';
import { NotImplementedByEngineError } from './exceptions';
import { QR } from './QR';

export class WhatsappSessionVenomCore extends WhatsappSession {
  engine = WAHAEngine.VENOM;

  whatsapp: Whatsapp;
  private qr: QR;

  public constructor(config) {
    super(config);
    this.qr = new QR();
  }

  protected buildClient() {
    const venomOptions: CreateConfig = {
      headless: true,
      devtools: false,
      debug: false,
      logQR: true,
      browserArgs: this.getBrowserArgsForPuppeteer(),
      autoClose: 60000,
      puppeteerOptions: {},
    };
    this.addProxyConfig(venomOptions);
    return create(this.name, this.getCatchQR(), undefined, venomOptions);
  }

  protected addProxyConfig(venomOptions: CreateConfig) {
    if (this.proxyConfig?.server !== undefined) {
      venomOptions.addProxy = [this.proxyConfig?.server];
    }
    if (
      this.proxyConfig?.username !== undefined &&
      this.proxyConfig?.password !== undefined
    ) {
      venomOptions.userProxy = this.proxyConfig?.username;
      venomOptions.userPass = this.proxyConfig?.password;
    }
  }

  protected getCatchQR() {
    return (base64Qrimg, asciiQR, attempts, urlCode) => {
      this.qr.save(base64Qrimg, urlCode);
      this.status = WAHASessionStatus.SCAN_QR_CODE;
      this.log.debug('Number of attempts to read the qrcode: ', attempts);
      this.log.log('Terminal qrcode:');
      // Log QR image in console without this.log to make it pretty
      console.log(asciiQR);
    };
  }

  async start() {
    this.status = WAHASessionStatus.STARTING;
    try {
      this.whatsapp = await this.buildClient();
    } catch (error) {
      this.status = WAHASessionStatus.FAILED;
      this.log.error(error);
      this.qr.save('');
      return;
    }

    this.status = WAHASessionStatus.WORKING;
    this.events.emit(WAHAInternalEvent.ENGINE_START);
    return this;
  }

  async stop() {
    await this.whatsapp.close();
    this.status = WAHASessionStatus.STOPPED;
  }

  subscribeEngineEvent(event: WAHAEvents | string, handler: (message) => void) {
    switch (event) {
      case WAHAEvents.MESSAGE:
        this.whatsapp.onMessage((message: Message) =>
          this.processIncomingMessage(message).then(handler),
        );
        return true;
      case WAHAEvents.MESSAGE_ANY:
        this.whatsapp.onAnyMessage((message: Message) =>
          this.processIncomingMessage(message).then(handler),
        );
        return true;
      case WAHAEvents.STATE_CHANGE:
        this.whatsapp.onStateChange(handler);
        return true;
      case WAHAEvents.MESSAGE_ACK:
        this.whatsapp.onAck(handler);
        return true;
      case WAHAEvents.GROUP_JOIN:
        this.whatsapp.onAddedToGroup(handler);
        return true;
      default:
        return false;
    }
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

  getScreenshot(): Promise<Buffer> {
    if (this.status === WAHASessionStatus.STARTING) {
      throw new UnprocessableEntityException(
        `The session is starting, please try again after few seconds`,
      );
    } else if (this.status === WAHASessionStatus.SCAN_QR_CODE) {
      return Promise.resolve(this.qr.get());
    } else if (this.status === WAHASessionStatus.WORKING) {
      return this.whatsapp.page.screenshot();
    } else {
      throw new UnprocessableEntityException(`Unknown status - ${this.status}`);
    }
  }

  async checkNumberStatus(
    request: CheckNumberStatusQuery,
  ): Promise<WANumberExistResult> {
    try {
      return await this.whatsapp.checkNumberStatus(
        this.ensureSuffix(request.phone),
      );
    } catch (error) {
      // Catch number doesn't exist error and return it as is
      if (error.status === 404 && !error.numberExists) {
        return error;
      }
      throw error;
    }
  }

  sendContactVCard(request: MessageContactVcardRequest) {
    return this.whatsapp.sendContactVcard(
      request.chatId,
      request.contactsId,
      request.name,
    );
  }

  sendText(request: MessageTextRequest) {
    return this.whatsapp.sendText(
      this.ensureSuffix(request.chatId),
      request.text,
    );
  }

  reply(request: MessageReplyRequest) {
    return this.whatsapp.reply(request.chatId, request.text, request.reply_to);
  }

  sendFile(request: MessageFileRequest) {
    throw new NotImplementedByEngineError();
  }

  sendImage(request: MessageImageRequest) {
    throw new NotImplementedByEngineError();
  }

  async sendVoice(request) {
    throw new NotImplementedByEngineError();
  }

  sendLinkPreview(request: MessageLinkPreviewRequest) {
    return this.whatsapp.sendLinkPreview(
      request.chatId,
      request.url,
      request.title,
    );
  }

  sendLocation(request: MessageLocationRequest) {
    return this.whatsapp.sendLocation(
      request.chatId,
      String(request.latitude),
      String(request.longitude),
      request.title,
    );
  }

  sendSeen(chat: ChatRequest) {
    return this.whatsapp.markMarkSeenMessage(chat.chatId);
  }

  startTyping(chat: ChatRequest) {
    return this.whatsapp.startTyping(chat.chatId, false);
  }

  stopTyping(chat: ChatRequest) {
    return;
    // The method is not available yet in new venom-bot
    // return this.whatsapp.stopTyping(chat.chatId);
  }

  async getChatMessages(chatId: string, limit: number) {
    const messages = await this.whatsapp.getAllMessagesInChat(
      chatId,
      true,
      false,
    );
    // Go over messages, download media, and convert to right format.
    const result = [];
    for (const [count, message] of messages.entries()) {
      if (count > limit) {
        // Have enough in the list, stop processing
        break;
      }
      result.push(await this.processIncomingMessage(message));
    }
    return result;
  }

  async getMessages(query: GetMessageQuery) {
    return this.getChatMessages(query.chatId, query.limit);
  }

  setReaction(request: MessageReactionRequest) {
    throw new NotImplementedByEngineError();
  }

  /**
   * END - Methods for API
   */

  protected downloadMedia(message: Message) {
    const processor = new EngineMediaProcessor(this);
    return this.mediaManager.processMedia(processor, message);
  }

  private processIncomingMessage(message: Message) {
    return this.downloadMedia(message).then(this.toWAMessage);
  }

  protected toWAMessage(message: Message): Promise<WAMessage> {
    // @ts-ignore
    return Promise.resolve({
      id: message.id,
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
      location: undefined,
      vCards: undefined,
      _data: message,
    });
  }
}

export class EngineMediaProcessor implements IEngineMediaProcessor<Message> {
  constructor(public session: WhatsappSessionVenomCore) {}

  hasMedia(message: any): boolean {
    if (!message.isMMS || !message.isMedia) {
      return message;
    }
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

  getFilename(message: Message): string | null {
    return null;
  }
}
