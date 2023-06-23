import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
import { create, CreateConfig, Message, Whatsapp } from 'venom-bot';

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
} from '../structures/chatting.dto';
import {
  WAHAEngine,
  WAHAEvents,
  WAHASessionStatus,
} from '../structures/enums.dto';
import { WAMessage, WANumberExistResult } from '../structures/responses.dto';
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
      this.qr.save(base64Qrimg);
      this.status = WAHASessionStatus.SCAN_QR_CODE;
      this.log.debug('Number of attempts to read the qrcode: ', attempts);
      this.log.log('Terminal qrcode:');
      // Log QR image in console without this.log to make it pretty
      console.log(asciiQR);
    };
  }

  async start() {
    try {
      this.whatsapp = await this.buildClient();
    } catch (error) {
      this.status = WAHASessionStatus.FAILED;
      this.log.error(error);
      this.qr.save('');
      return;
    }

    this.status = WAHASessionStatus.WORKING;
    this.events.emit(WAHAInternalEvent.engine_start);
    return this;
  }

  stop() {
    return this.whatsapp.close();
  }

  subscribe(event: WAHAEvents | string, handler: (message) => void) {
    if (event === WAHAEvents.MESSAGE) {
      return this.whatsapp.onMessage((message: Message) =>
        this.processIncomingMessage(message).then(handler),
      );
    } else if (event === WAHAEvents.MESSAGE_ANY) {
      return this.whatsapp.onAnyMessage((message: Message) =>
        this.processIncomingMessage(message).then(handler),
      );
    } else if (event === WAHAEvents.STATE_CHANGE) {
      return this.whatsapp.onStateChange(handler);
    } else if (event === WAHAEvents.MESSAGE_ACK) {
      return this.whatsapp.onAck(handler);
    } else if (event === WAHAEvents.GROUP_JOIN) {
      return this.whatsapp.onAddedToGroup(handler);
    } else {
      throw new NotImplementedByEngineError(
        `Engine does not support webhook event: ${event}`,
      );
    }
  }

  /**
   * START - Methods for API
   */
  getScreenshot(): Promise<Buffer | string> {
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

  sendTextButtons(request: MessageTextButtonsRequest) {
    const buttons = request.buttons.map((button: Button) => {
      return {
        buttonId: button.id,
        buttonText: {
          displayText: button.text,
        },
      };
    });
    return this.whatsapp.sendButtons(
      this.ensureSuffix(request.chatId),
      request.title,
      request.footer,
      buttons,
    );
  }

  startTyping(chat: ChatRequest) {
    return this.whatsapp.startTyping(chat.chatId, false);
  }

  stopTyping(chat: ChatRequest) {
    return;
    // The method is not available yet in new venom-bot
    // return this.whatsapp.stopTyping(chat.chatId);
  }

  async getMessages(query: GetMessageQuery) {
    const messages = await this.whatsapp.getAllMessagesInChat(
      query.chatId,
      true,
      false,
    );
    // Go over messages, download media, and convert to right format.
    const result = [];
    for (const [count, message] of messages.entries()) {
      if (count > query.limit) {
        // Have enough in the list, stop processing
        break;
      }
      result.push(await this.processIncomingMessage(message));
    }
    return result;
  }

  setReaction(request: MessageReactionRequest) {
    throw new NotImplementedByEngineError();
  }

  /**
   * END - Methods for API
   */

  protected async downloadAndDecryptMedia(message: Message) {
    if (!message.isMMS || !message.isMedia) {
      return message;
    }
    // @ts-ignore
    message.mediaUrl = await this.storage.save(message.id, '', undefined);
    return message;
  }

  private processIncomingMessage(message: Message) {
    return this.downloadAndDecryptMedia(message).then(this.toWAMessage);
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
      // @ts-ignore
      hasMedia: Boolean(message.mediaUrl),
      // @ts-ignore
      mediaUrl: message.mediaUrl,
      // @ts-ignore
      ack: message.ack,
      location: undefined,
      vCards: undefined,
      _data: message,
    });
  }
}
