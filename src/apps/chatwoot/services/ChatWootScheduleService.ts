import { Injectable } from '@nestjs/common';

import { QueueName } from '../consumers/QueueName';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ContactsPullRemove } from '@waha/apps/chatwoot/cli/cmd.contacts';
import { MessagesPullRemove } from '@waha/apps/chatwoot/cli/cmd.messages';
import { QueueRegistry } from './QueueRegistry';

/**
 * Service for scheduling ChatWoot tasks
 * This service is used to schedule periodic tasks for ChatWoot
 */
@Injectable()
export class ChatWootScheduleService {
  constructor(
    @InjectPinoLogger('DashboardConfigService')
    protected logger: PinoLogger,
    private readonly queueRegistry: QueueRegistry,
  ) {}

  /**
   * Schedule periodic tasks for a ChatWoot app
   * @param appId The ID of the app
   * @param sessionName The name of the session
   */
  async schedule(appId: string, sessionName: string): Promise<void> {
    // Message Cleanup
    const messageCleanupQueue = this.queueRegistry.queue(
      QueueName.SCHEDULED_MESSAGE_CLEANUP,
    );
    await messageCleanupQueue.upsertJobScheduler(
      this.JobId(QueueName.SCHEDULED_MESSAGE_CLEANUP, appId),
      // Every day at 17:00
      { pattern: '0 0 17 * * *' },
      {
        data: {
          app: appId,
          session: sessionName,
        },
      },
    );
    // Check the version
    const checkVersionQueue = this.queueRegistry.queue(
      QueueName.SCHEDULED_CHECK_VERSION,
    );
    await checkVersionQueue.upsertJobScheduler(
      this.JobId(QueueName.SCHEDULED_CHECK_VERSION, appId),
      // Every Wednesday (3) at 18:00
      { pattern: '0 0 18 * * 3' },
      {
        data: {
          app: appId,
          session: sessionName,
        },
      },
    );
    // Check the tier
    const checkTierQueue = this.queueRegistry.queue(
      QueueName.SCHEDULED_CHECK_TIER,
    );
    await checkTierQueue.upsertJobScheduler(
      this.JobId(QueueName.SCHEDULED_CHECK_TIER, appId),
      // Every Monday (1) at 14:00
      { pattern: '0 0 14 * * 1' },
      {
        data: {
          app: appId,
          session: sessionName,
        },
      },
    );
  }

  async unschedule(appId: string, sessionName: string): Promise<void> {
    // Message Cleanup
    const messageCleanupQueue = this.queueRegistry.queue(
      QueueName.SCHEDULED_MESSAGE_CLEANUP,
    );
    await messageCleanupQueue.removeJobScheduler(
      this.JobId(QueueName.SCHEDULED_MESSAGE_CLEANUP, appId),
    );
    // Check the version
    const checkVersionQueue = this.queueRegistry.queue(
      QueueName.SCHEDULED_CHECK_VERSION,
    );
    await checkVersionQueue.removeJobScheduler(
      this.JobId(QueueName.SCHEDULED_CHECK_VERSION, appId),
    );
    // Check the tier
    const checkTierQueue = this.queueRegistry.queue(
      QueueName.SCHEDULED_CHECK_TIER,
    );
    await checkTierQueue.removeJobScheduler(
      this.JobId(QueueName.SCHEDULED_CHECK_TIER, appId),
    );

    // contacts
    const contactsPullQueue = this.queueRegistry.queue(
      QueueName.TASK_CONTACTS_PULL,
    );
    ContactsPullRemove(contactsPullQueue, appId, this.logger).catch(
      (reason) => {
        // Ignore errors
        this.logger.warn(
          `Failed to remove "contacts" job for app ${appId}, session ${sessionName}: ${reason}`,
        );
      },
    );

    const messagesPullQueue = this.queueRegistry.queue(
      QueueName.TASK_MESSAGES_PULL,
    );
    MessagesPullRemove(messagesPullQueue, appId, this.logger).catch(
      (reason) => {
        this.logger.warn(
          `Failed to remove "messages" job for app ${appId}, session ${sessionName}: ${reason}`,
        );
      },
    );
  }

  /**
   * DEPRECATED - for backward compatability
   * Use SingleJobId if you want to have single job in the queue by app
   */
  private JobId(queue: QueueName, appId: string) {
    return `${queue} | ${appId}`;
  }

  static SingleJobId(appId: string) {
    return `${appId}`;
  }
}
