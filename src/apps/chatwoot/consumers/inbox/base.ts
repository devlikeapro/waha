import { AppConsumer } from '@waha/apps/app_sdk/AppConsumer';
import { JobLoggerWrapper } from '@waha/apps/app_sdk/JobLoggerWrapper';
import { HasBeenRetried } from '@waha/apps/app_sdk/JobUtils';
import { FindChatID } from '@waha/apps/chatwoot/client/ids';
import { EventName } from '@waha/apps/chatwoot/client/types';
import { ChatWootConversationKey } from '@waha/apps/chatwoot/consumers/mutex';
import { InboxData } from '@waha/apps/chatwoot/consumers/types';
import { DIContainer } from '@waha/apps/chatwoot/di/DIContainer';
import {
  ChatIDNotFoundForContactError,
  ChatWootAppNotFoundError,
  PhoneNumberNotFoundInWhatsAppError,
} from '@waha/apps/chatwoot/errors';
import { WAHASessionAPI } from '@waha/apps/app_sdk/waha/WAHASelf';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { RMutexService } from '@waha/modules/rmutex/rmutex.service';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';

import { AppRepository } from '../../storage';
import { TKey } from '@waha/apps/chatwoot/i18n/templates';
import { Conversation } from '@waha/apps/chatwoot/client/Conversation';

/**
 * Base class for ChatWoot inbox consumers
 * Contains common logic for all inbox consumers
 */
export abstract class ChatWootInboxMessageConsumer extends AppConsumer {
  protected appRepository: AppRepository;

  constructor(
    protected readonly manager: SessionManager,
    log: PinoLogger,
    rmutex: RMutexService,
    protected readonly consumerName: string,
  ) {
    super('ChatWoot', consumerName, log, rmutex);
  }

  /**
   * Gets the DIContainer for the specified app.
   */
  protected async DIContainer(job: Job, appId: string): Promise<DIContainer> {
    const knex = this.manager.store.getWAHADatabase();
    this.appRepository = new AppRepository(knex);
    const logger = new JobLoggerWrapper(job, this.logger);
    const app = await this.appRepository.findEnabledAppById(appId);
    if (!app) {
      logger.warn(`Chatwoot app not found or disabled: ${appId}`);
      throw new ChatWootAppNotFoundError(appId);
    }
    return new DIContainer(app.pk, app.config, logger, knex);
  }

  protected abstract ErrorHeaderKey(): TKey | null;

  /**
   * Get the function that processes the message
   * This method must be implemented by subclasses
   */
  protected abstract Process(
    container: DIContainer,
    body: any,
    job: Job,
  ): Promise<any>;

  protected GetConversationID(body) {
    return body.conversation.id;
  }

  /**
   * Process the job
   * This method is called by the queue processor
   */
  async processJob(job: Job<InboxData, any, EventName>): Promise<any> {
    const body = job.data.body;
    const key = ChatWootConversationKey(
      job.data.app,
      this.GetConversationID(body),
    );
    return await this.withMutex(job, key, () =>
      this.ProcessAndReportStatus(job),
    );
  }

  private async ProcessAndReportStatus(job) {
    const body = job.data.body;
    try {
      const container = await this.DIContainer(job, job.data.app);
      const result = await this.Process(container, body, job);
      await this.ReportErrorRecovered(job, body);
      return result;
    } catch (err) {
      if (err instanceof ChatWootAppNotFoundError) {
        this.logger.warn(err.message);
        throw err;
      }
      await this.ReportErrorForMessage(job, err, body);
      throw err;
    }
  }

  protected conversationForReport(container, body): Conversation {
    return container
      .ContactConversationService()
      .ConversationById(body.conversation.id);
  }

  /**
   * Report an error for a message
   */
  protected async ReportErrorForMessage(job: Job, err: any, body: any) {
    const container = await this.DIContainer(job, job.data.app);
    const header: string = this.ErrorHeaderKey()
      ? container.Locale().key(this.ErrorHeaderKey()).render()
      : err.message || `${err}`;
    const conversation = this.conversationForReport(container, body);
    const reporter = container.ChatWootErrorReporter(job);
    await reporter.ReportError(
      conversation,
      header,
      body.message_type,
      err,
      body.id,
    );
    throw err;
  }

  protected async ReportErrorRecovered(job: Job, body: any) {
    if (!HasBeenRetried(job)) {
      return;
    }

    const container = await this.DIContainer(job, job.data.app);
    const conversation = this.conversationForReport(container, body);
    const reporter = container.ChatWootErrorReporter(job);
    await reporter.ReportSucceeded(conversation, body.message_type, body.id);
  }
}

export async function LookupAndCheckChatId(
  session: WAHASessionAPI,
  body: any,
): Promise<string> {
  const sender = body.conversation.meta.sender;
  let chatId = FindChatID(sender);
  if (!chatId && sender.phone_number) {
    const existResult = await session.contactCheckExists(sender.phone_number);
    if (!existResult.numberExists) {
      throw new PhoneNumberNotFoundInWhatsAppError(sender.phone_number);
    }
    chatId = existResult.chatId;
  }
  if (!chatId) {
    throw new ChatIDNotFoundForContactError(sender);
  }
  return chatId;
}
