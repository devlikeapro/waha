import {
  CallsAppChannelConfig,
  CallsAppConfig,
} from '@waha/apps/calls/dto/config.dto';
import { SessionPlugin } from '@waha/core/abc/session.plugin';
import { PluginEvent } from '@waha/core/abc/session.plugin.events';
import { CallData } from '@waha/structures/calls.dto';
import { MessageTextRequest } from '@waha/structures/chatting.dto';
import { WAHAEvents, WAHAPresenceStatus } from '@waha/structures/enums.dto';
import { sleep } from '@waha/utils/promiseTimeout';
import { Observable } from 'rxjs';

/**
 * Rejects incoming calls and optionally sends an auto-reply message.
 */
export class CallsPlugin extends SessionPlugin<CallsAppConfig> {
  @PluginEvent(WAHAEvents.CALL_RECEIVED)
  onCallReceived(calls$: Observable<CallData>) {
    calls$.subscribe((call: CallData) => {
      this.handleCall(call).catch((error) => {
        this.logger.error(
          { err: error, callId: call?.id },
          'Failed to handle incoming call',
        );
      });
    });
  }

  private configFor(call: CallData): CallsAppChannelConfig {
    return call?.isGroup ? this.config?.group : this.config?.dm;
  }

  private async handleCall(call: CallData): Promise<void> {
    if (!call.from) {
      this.logger.warn({ call: call?.id }, 'Incoming call has no chat id');
      return;
    }
    if (!call.id) {
      this.logger.warn({ from: call.from }, 'Incoming call has no from');
      return;
    }

    const config = this.configFor(call);
    if (!config) {
      this.logger.warn({ callId: call.id }, 'No calls config found, skipping');
      return;
    }

    const message = (config.message || '').trim();
    const shouldReject = !!config.reject;
    const shouldMessage = message.length > 0;

    if (!shouldReject && !shouldMessage) {
      this.logger.debug(
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
    this.logger.debug(
      { from: call.from, id: call.id },
      'Rejecting incoming call',
    );
    await this.session.rejectCall(call.from, call.id);
    this.logger.info({ from: call.from, id: call.id }, 'Call rejected');
  }

  private async replyWithTyping(
    chatId: string,
    message: string,
  ): Promise<void> {
    this.logger.info(
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
      this.logger.warn(
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
      this.logger.warn(
        { err: error, chatId: chatId },
        'Failed to clear typing presence after reply',
      );
    }
  }
}
