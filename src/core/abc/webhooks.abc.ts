import { LoggerBuilder } from '@waha/utils/logging';
import { Logger } from 'pino';

import { WebhookConfig } from '../../structures/webhooks.config.dto';
import { WhatsappSession } from './session.abc';

export abstract class WebhookSender {
  protected url: string;
  protected logger: Logger;
  protected readonly config: WebhookConfig;

  constructor(
    loggerBuilder: LoggerBuilder,
    protected webhookConfig: WebhookConfig,
  ) {
    this.url = webhookConfig.url;
    this.logger = loggerBuilder.child({ name: WebhookSender.name });
    this.config = webhookConfig;
  }

  abstract send(json: any): void;
}

export abstract class WebhookConductor {
  abstract configure(session: WhatsappSession, webhooks: WebhookConfig[]);
}
