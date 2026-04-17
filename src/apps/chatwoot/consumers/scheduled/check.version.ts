import { Processor } from '@nestjs/bullmq';
import { JOB_CONCURRENCY } from '@waha/apps/app_sdk/constants';
import { ILogger } from '@waha/apps/app_sdk/ILogger';
import { QueueName } from '@waha/apps/chatwoot/consumers/QueueName';
import { DIContainer } from '@waha/apps/chatwoot/di/DIContainer';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { CHANGELOG_URL } from '@waha/core/constants';
import { RMutexService } from '@waha/modules/rmutex/rmutex.service';
import { VERSION } from '@waha/version';
import axios from 'axios';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';

import { TKey } from '@waha/apps/chatwoot/i18n/templates';
import { ChatWootScheduledConsumer } from './base';

@Processor(QueueName.SCHEDULED_CHECK_VERSION, { concurrency: JOB_CONCURRENCY })
export class CheckVersionConsumer extends ChatWootScheduledConsumer {
  constructor(manager: SessionManager, log: PinoLogger, rmutex: RMutexService) {
    super(manager, log, rmutex, CheckVersionConsumer.name);
  }

  protected ErrorHeaderKey(): TKey {
    return TKey.JOB_SCHEDULED_ERROR_HEADER;
  }

  protected async Process(container: DIContainer, job: Job): Promise<any> {
    const logger = container.Logger();
    logger.info('Processing version check job');
    const currentVersion = VERSION.version;
    logger.info(`Current WAHA version: ${currentVersion}`);
    const latestVersion = await this.fetchLatestVersion(logger);
    const isNewVersionAvailable = currentVersion !== latestVersion;
    if (!isNewVersionAvailable) {
      logger.info('WAHA is up to date');
      return;
    }

    logger.info(
      `New version available: ${latestVersion} (current: ${currentVersion})`,
    );

    const locale = container.Locale();
    const message = locale.key(TKey.WAHA_NEW_VERSION_AVAILABLE).render({
      currentVersion: currentVersion,
      newVersion: latestVersion,
      changelogUrl: CHANGELOG_URL,
    });
    const conversation = await container
      .ContactConversationService()
      .InboxNotifications();
    await conversation.incoming(message);
  }

  private async fetchLatestVersion(logger: ILogger): Promise<string> {
    const response = await axios.get(
      'https://api.github.com/repos/devlikeapro/waha/releases/latest',
    );
    const latestVersion = response.data.name;
    logger.info(`Latest WAHA version: ${latestVersion}`);
    return latestVersion;
  }
}
