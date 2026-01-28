import { populateSessionInfo } from '@waha/core/abc/manager.abc';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { WebhookSender } from '@waha/core/integrations/webhooks/WebhookSender';
import { WAHAEvents, WAHAEventsWild } from '@waha/structures/enums.dto';
import { WebhookConfig } from '@waha/structures/webhooks.config.dto';
import { EventWildUnmask } from '@waha/utils/events';
import { LoggerBuilder } from '@waha/utils/logging';
import { Logger } from 'pino';

export class WebhookConductor {
  private logger: Logger;
  private eventUnmask = new EventWildUnmask(WAHAEvents, WAHAEventsWild);

  constructor(protected loggerBuilder: LoggerBuilder) {
    this.logger = loggerBuilder.child({ name: WebhookConductor.name });
  }

  protected buildSender(webhookConfig: WebhookConfig): WebhookSender {
    return new WebhookSender(this.loggerBuilder, webhookConfig);
  }

  private getSuitableEvents(events: WAHAEvents[] | string[]): WAHAEvents[] {
    return this.eventUnmask.unmask(events);
  }

  public configure(session: WhatsappSession, webhooks: WebhookConfig[]) {
    for (const webhookConfig of webhooks) {
      this.configureSingleWebhook(session, webhookConfig);
    }
  }

  private configureSingleWebhook(
    session: WhatsappSession,
    webhook: WebhookConfig,
  ) {
    if (!webhook || !webhook.url || webhook.events.length === 0) {
      return;
    }

    const url = webhook.url;
    this.logger.info(`Configuring webhooks for ${url}...`);
    const events = this.getSuitableEvents(webhook.events);
    const sender = this.buildSender(webhook);
    for (const event of events) {
      const obs$ = session.getEventObservable(event);
      obs$.subscribe((payload) => {
        setImmediate(() => {
          const data = populateSessionInfo(event, session)(payload);
          sender.send(data);
        });
      });
      this.logger.debug(`Event '${event}' is enabled for url: ${url}`);
    }
    this.logger.info(`Webhooks were configured for ${url}.`);
  }
}
