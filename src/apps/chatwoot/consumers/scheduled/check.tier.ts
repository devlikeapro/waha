import { Processor } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { JOB_CONCURRENCY } from '@waha/apps/app_sdk/constants';
import { QueueName } from '@waha/apps/chatwoot/consumers/QueueName';
import { DIContainer } from '@waha/apps/chatwoot/di/DIContainer';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { SUPPORT_US_URL } from '@waha/core/constants';
import { RMutexService } from '@waha/modules/rmutex/rmutex.service';
import { VERSION, WAHAVersion } from '@waha/version';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';

import { TKey } from '@waha/apps/chatwoot/i18n/templates';
import { ChatWootScheduledConsumer } from './base';

@Processor(QueueName.SCHEDULED_CHECK_TIER, { concurrency: JOB_CONCURRENCY })
export class CheckTierConsumer extends ChatWootScheduledConsumer {
  constructor(manager: SessionManager, log: PinoLogger, rmutex: RMutexService) {
    super(manager, log, rmutex, CheckTierConsumer.name);
  }

  protected ErrorHeaderKey(): TKey {
    return TKey.JOB_SCHEDULED_ERROR_HEADER;
  }

  protected async Process(container: DIContainer, job: Job): Promise<any> {
    const logger = container.Logger();
    const locale = container.Locale();
    const conversation = await container
      .ContactConversationService()
      .InboxNotifications();
    if (VERSION.tier !== WAHAVersion.CORE) {
      logger.info('WAHA is not using the CORE version');
      return;
    }
    logger.info('WAHA is using the CORE version');
    const supportMessage = locale.key(TKey.WAHA_CORE_VERSION_USED).render({
      supportUrl: SUPPORT_US_URL,
    });
    await conversation.incoming(supportMessage);
  }
}
