import { AppConsumer } from '@waha/apps/app_sdk/AppConsumer';
import { JobLoggerWrapper } from '@waha/apps/app_sdk/JobLoggerWrapper';
import { HasBeenRetried } from '@waha/apps/app_sdk/JobUtils';
import { MessageType } from '@waha/apps/chatwoot/client/types';
import { ScheduledData } from '@waha/apps/chatwoot/consumers/types';
import { DIContainer } from '@waha/apps/chatwoot/di/DIContainer';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { RMutexService } from '@waha/modules/rmutex/rmutex.service';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';

import { AppRepository } from '../../storage';
import { TKey } from '@waha/apps/chatwoot/i18n/templates';
import { ChatWootAppNotFoundError } from '@waha/apps/chatwoot/errors';

/**
 * Base class for ChatWoot scheduled consumers
 * Contains common logic for all scheduled consumers
 */
export abstract class ChatWootScheduledConsumer extends AppConsumer {
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
   * Get the function that processes the scheduled job
   * This method must be implemented by subclasses
   */
  protected abstract Process(container: DIContainer, job: Job): Promise<any>;

  /**
   * Process the job
   * This method is called by the queue processor
   */
  async processJob(job: Job<ScheduledData, any, string>): Promise<any> {
    return this.ProcessAndReportStatus(job);
  }

  private async ProcessAndReportStatus(job: Job) {
    try {
      const container = await this.DIContainer(job, job.data.app);
      const result = await this.Process(container, job);
      await this.ReportErrorRecovered(job);
      return result;
    } catch (err) {
      if (err instanceof ChatWootAppNotFoundError) {
        this.logger.warn(err.message);
        throw err;
      }
      await this.ReportErrorForJob(job, err);
      throw err;
    }
  }

  /**
   * Report an error for a scheduled job
   */
  protected async ReportErrorForJob(job: Job, err: any) {
    const container = await this.DIContainer(job, job.data.app);
    let header = this.ErrorHeaderKey()
      ? container.Locale().key(this.ErrorHeaderKey()).render()
      : err.message || `${err}`;
    header = `${job.queueName}: ${header}`;

    const conversation = await container
      .ContactConversationService()
      .InboxNotifications();

    const reporter = container.ChatWootErrorReporter(job);
    await reporter.ReportError(conversation, header, MessageType.INCOMING, err);
    throw err;
  }

  protected async ReportErrorRecovered(job: Job) {
    if (!HasBeenRetried(job)) {
      return;
    }

    const container = await this.DIContainer(job, job.data.app);
    const conversation = await container
      .ContactConversationService()
      .InboxNotifications();

    const reporter = container.ChatWootErrorReporter(job);
    await reporter.ReportSucceeded(conversation, MessageType.INCOMING);
  }
}
