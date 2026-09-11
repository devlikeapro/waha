import { Processor } from '@nestjs/bullmq';
import { JOB_CONCURRENCY } from '@waha/apps/app_sdk/constants';
import { ChatWootInboxMessageConsumer } from '@waha/apps/chatwoot/consumers/inbox/base';
import { MessageHandler } from '@waha/apps/chatwoot/consumers/inbox/message_created';
import { QueueName } from '@waha/apps/chatwoot/consumers/QueueName';
import { DIContainer } from '@waha/apps/chatwoot/di/DIContainer';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { RMutexService } from '@waha/modules/rmutex/rmutex.service';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';

import { WAHASessionAPI } from '../../../app_sdk/waha/WAHASelf';
import { TKey } from '@waha/apps/chatwoot/i18n/templates';

@Processor(QueueName.INBOX_MESSAGE_UPDATED, { concurrency: JOB_CONCURRENCY })
export class ChatWootInboxMessageUpdatedConsumer extends ChatWootInboxMessageConsumer {
  constructor(
    protected readonly manager: SessionManager,
    log: PinoLogger,
    rmutex: RMutexService,
  ) {
    super(manager, log, rmutex, 'ChatWootInboxMessageUpdatedConsumer');
  }

  ErrorHeaderKey(): TKey | null {
    return TKey.WHATSAPP_MESSAGE_SENDING_ERROR;
  }

  protected async Process(container: DIContainer, body, job: Job) {
    const waha = container.WAHASelf();
    const session = new WAHASessionAPI(job.data.session, waha);
    const handler = new MessageHandler(
      container.MessageMappingService(),
      container.Logger(),
      session,
      container.ChatWootConfig(),
      container.Locale(),
      container.MessageStatusService(),
    );
    return await handler.handle(body);
  }
}
