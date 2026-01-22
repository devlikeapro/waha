import type { conversation_message_create } from '@figuro/chatwoot-sdk/dist/models/conversation_message_create';
import { ILogger } from '@waha/apps/app_sdk/ILogger';
import {
  JobLink,
  NextAttemptDelayInWholeSeconds,
} from '@waha/apps/app_sdk/JobUtils';
import { Conversation } from '@waha/apps/chatwoot/client/Conversation';
import { MessageType } from '@waha/apps/chatwoot/client/types';
import { ErrorRenderer } from '@waha/apps/chatwoot/error/ErrorRenderer';
import { Locale } from '@waha/apps/chatwoot/i18n/locale';
import { Job } from 'bullmq';
import { TKey } from '@waha/apps/chatwoot/i18n/templates';

const renderer: ErrorRenderer = new ErrorRenderer();

export class ChatWootErrorReporter {
  private errorRenderer: ErrorRenderer = renderer;

  constructor(
    private logger: ILogger,
    private job: Job,
    private l: Locale,
  ) {}

  async ReportError(
    conversation: Conversation,
    header: string,
    type: MessageType,
    error: any,
    replyTo?: number,
  ) {
    const errorText = this.errorRenderer.text(error);
    this.logger.error(errorText);
    try {
      const data = this.errorRenderer.data(error);
      this.logger.error(JSON.stringify(data, null, 2));
    } catch (err) {
      this.logger.error(`Error occurred while login details for error: ${err}`);
    }
    const template = this.l.key(TKey.JOB_REPORT_ERROR);
    const nextDelay = NextAttemptDelayInWholeSeconds(this.job);
    if (nextDelay) {
      // TODO: Add a way to enable it back in config
      // https://github.com/devlikeapro/waha/issues/1395
      // There's retries more left - ignore it for now
      return;
    }
    if (!conversation) {
      this.logger.error(
        'Chatwoot error report skipped: conversation not ready',
      );
      return;
    }
    const attempts = {
      current: this.job.attemptsMade + 1,
      max: this.job.opts?.attempts || 1,
      nextDelay: nextDelay,
    };
    const content = template.render({
      header: header,
      error: nextDelay != null ? null : errorText,
      details: JobLink(this.job),
      attempts: attempts,
    });
    const request: conversation_message_create = {
      content: content,
      message_type: type as any,
      private: true, // Always private note
    };
    if (replyTo) {
      request.content_attributes = {
        in_reply_to: replyTo,
      };
    }
    await conversation.send(request);
  }

  /**
   * Reports a job as recovered after retries.
   * This method will only send a report if the job has been retried (not on its first attempt).
   *
   * @param conversation The conversation to send the report to
   * @param type The message type
   * @param replyTo Optional message ID to reply to
   * @returns Promise that resolves when the report is sent, or void if no report is sent
   */
  async ReportSucceeded(
    conversation: Conversation,
    type: MessageType,
    replyTo?: number,
  ): Promise<void> {
    // TODO: Add a way to enable it back in config
    // https://github.com/devlikeapro/waha/issues/1395
    return null;

    if (!conversation) {
      this.logger.warn(
        'Chatwoot success report skipped: conversation not ready',
      );
      return;
    }
    const template = this.l.key(TKey.JOB_REPORT_SUCCEEDED);
    const attempts = {
      current: this.job.attemptsMade + 1,
      max: this.job.opts?.attempts || 1,
    };

    const content = template.render({
      details: JobLink(this.job),
      attempts: attempts,
    });

    const request: conversation_message_create = {
      content: content,
      message_type: type as any,
      private: true, // Always private note
    };

    if (replyTo) {
      request.content_attributes = {
        in_reply_to: replyTo,
      };
    }

    await conversation.send(request);
  }
}
