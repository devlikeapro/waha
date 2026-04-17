import { Subscription } from 'rxjs';
import {
  CallsAppChannelConfig,
  CallsAppConfig,
} from '@waha/apps/calls/dto/config.dto';
import { Logger } from 'pino';
import { App } from '@waha/apps/app_sdk/dto/app.dto';
import { PinoLogger } from 'nestjs-pino';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { WAHAEvents, WAHAPresenceStatus } from '@waha/structures/enums.dto';
import { CallData } from '@waha/structures/calls.dto';
import { MessageTextRequest } from '@waha/structures/chatting.dto';
import { sleep } from '@waha/utils/promiseTimeout';

export class CallsListener {
  private subscription?: Subscription;
  private config: CallsAppConfig;
  private readonly log: Logger;
  private readonly session: WhatsappSession;

  constructor(
    app: App<CallsAppConfig>,
    session: WhatsappSession,
    logger: PinoLogger,
  ) {
    this.session = session;
    this.config = app.config;
    this.log = logger.logger.child({
      app: 'calls',
      session: app.session,
    });
  }

  attach(): void {
    this.detach();

    const observable = this.session.getEventObservable(
      WAHAEvents.CALL_RECEIVED,
    );
    if (!observable) {
      this.log.warn('CALL_RECEIVED event stream is not available, skipping');
      return;
    }

    this.subscription = observable.subscribe((payload) => {
      this.handleCall(payload as CallData).catch((error) => {
        this.log.error(
          { err: error, callId: (payload as any)?.id },
          'Failed to handle incoming call',
        );
      });
    });

    this.log.info('Calls app listener is attached');
  }

  detach(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }

  private configFor(call: CallData): CallsAppChannelConfig {
    return call?.isGroup ? this.config?.group : this.config?.dm;
  }

  private async handleCall(call: CallData): Promise<void> {
    if (!call.from) {
      this.log.warn({ call: call?.id }, 'Incoming call has no chat id');
      return;
    }
    if (!call.id) {
      this.log.warn({ from: call.from }, 'Incoming call has no from');
      return;
    }

    const config = this.configFor(call);
    if (!config) {
      this.log.warn({ callId: call.id }, 'No calls config found, skipping');
      return;
    }

    const message = (config.message || '').trim();
    const shouldReject = !!config.reject;
    const shouldMessage = message.length > 0;

    if (!shouldReject && !shouldMessage) {
      this.log.debug(
        { callId: call.id, chatId: call.from },
        'No actions configured for this call',
      );
      return;
    }

    if (shouldReject) {
      const waitBeforeDeclineMs = (config.waitBeforeDecline ?? 0) * 1000;
      await sleep(waitBeforeDeclineMs);
      await this.rejectCall(call);
    }

    if (shouldMessage) {
      const waitBeforeResponseMs = (config.waitBeforeResponse ?? 0) * 1000;
      await sleep(waitBeforeResponseMs);
      await this.replyWithTyping(call.from, message);
    }
  }

  private async rejectCall(call: CallData): Promise<void> {
    this.log.debug({ from: call.from, id: call.id }, 'Rejecting incoming call');
    await this.session.rejectCall(call.from, call.id);
    this.log.info({ from: call.from, id: call.id }, 'Call rejected');
  }

  private async replyWithTyping(
    chatId: string,
    message: string,
  ): Promise<void> {
    this.log.info(
      { chatId: chatId },
      'Sending auto-response for rejected call',
    );

    await this.setTyping(chatId);
    await this.setPaused(chatId);
    await this.session.sendText({
      session: this.session.name,
      chatId: chatId,
      text: message,
    } as MessageTextRequest);
  }

  private async setTyping(chatId: string): Promise<void> {
    try {
      await this.session.setPresence(WAHAPresenceStatus.TYPING, chatId);
    } catch (error) {
      this.log.warn(
        { err: error, chatId: chatId },
        'Failed to set typing presence before reply',
      );
      return;
    }

    await sleep(2000);
  }

  private async setPaused(chatId: string): Promise<void> {
    try {
      await this.session.setPresence(WAHAPresenceStatus.PAUSED, chatId);
    } catch (error) {
      this.log.warn(
        { err: error, chatId: chatId },
        'Failed to clear typing presence after reply',
      );
    }
  }
}
