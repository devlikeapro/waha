import { ConsoleLogger } from '@nestjs/common';

import { WebhookConfig } from '../../structures/webhooks.dto';
import { WhatsappSession } from './session.abc';

export abstract class WebhookSender {
  protected url: string;
  constructor(
    protected log: ConsoleLogger,
    protected webhookConfig: WebhookConfig,
  ) {
    this.url = webhookConfig.url;
  }

  abstract send(json);
}

export abstract class WebhookConductor {
  abstract configure(session: WhatsappSession, webhooks: WebhookConfig[]);
}
