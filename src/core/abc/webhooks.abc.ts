import { LoggerBuilder } from '@waha/utils/logging';
import { Logger } from 'pino';

import { WebhookConfig } from '../../structures/webhooks.config.dto';
import { WhatsappSession } from './session.abc';

export abstract class WebhookSender {
  protected url: string;
  protected logger: Logger;

  constructor(
    loggerBuilder: LoggerBuilder,
    protected webhookConfig: WebhookConfig,
  ) {
    this.url = webhookConfig.url;
    this.logger = loggerBuilder.child({ name: WebhookSender.name });
  }

  abstract send(json);
}

export abstract class WebhookConductor {
  abstract configure(session: WhatsappSession, webhooks: WebhookConfig[]);
}
