import { Processor } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { JOB_CONCURRENCY } from '@waha/apps/app_sdk/constants';
import { QueueName } from '@waha/apps/chatwoot/consumers/QueueName';
import { DIContainer } from '@waha/apps/chatwoot/di/DIContainer';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { RMutexService } from '@waha/modules/rmutex/rmutex.service';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';

import { ChatWootScheduledConsumer } from './base';
import { TKey } from '@waha/apps/chatwoot/i18n/templates';

/**
 * Scheduled consumer for message cleanup tasks
 * Handles periodic cleanup of old messages and related data
 */
@Processor(QueueName.SCHEDULED_MESSAGE_CLEANUP, {
  concurrency: JOB_CONCURRENCY,
})
export class MessageCleanupConsumer extends ChatWootScheduledConsumer {
  REMOVE_AFTER_DAYS = 365;

  constructor(manager: SessionManager, log: PinoLogger, rmutex: RMutexService) {
    super(manager, log, rmutex, MessageCleanupConsumer.name);
  }

  protected ErrorHeaderKey(): TKey {
    return TKey.JOB_SCHEDULED_ERROR_HEADER;
  }

  /**
   * Process the message cleanup job
   * Performs cleanup of old messages and related data
   */
  protected async Process(container: DIContainer, job: Job): Promise<any> {
    const logger = container.Logger();
    logger.info('Processing message cleanup job');
    const removeAfter = new Date(
      Date.now() - this.REMOVE_AFTER_DAYS * 24 * 60 * 60 * 1000,
    );
    logger.info(`Removing mapping for messages older than ${removeAfter}`);
    const removed = await container
      .MessageMappingService()
      .cleanup(removeAfter);
    logger.info(`Removed ${removed} mappings for messages`);
    await container.MessageAckRepository().cleanup(removeAfter);
  }
}
