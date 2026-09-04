import { populateSessionInfo } from '@waha/core/abc/manager.abc';
import { SessionPlugin } from '@waha/core/abc/session.plugin';
import { WebhookSender } from '@waha/modules/waha-webhook/WebhookPlugin.sender';
import { WAHAEvents, WAHAEventsWild } from '@waha/structures/enums.dto';
import { WebhookConfig } from '@waha/structures/webhooks.config.dto';
import { EventWildUnmask } from '@waha/utils/events';

export class WebhookPluginConfig {
  webhooks: WebhookConfig | null;
}

/**
 * Sends session events to the configured webhooks (per session and predefined ones)
 */
export class WebhookPlugin extends SessionPlugin<WebhookPluginConfig> {
  private eventUnmask = new EventWildUnmask(WAHAEvents, WAHAEventsWild);

  attach(): void {
    for (const webhookConfig of this.webhooks()) {
      this.configure(webhookConfig);
    }
  }

  /**
   * Session webhooks + the predefined one (WHATSAPP_HOOK_URL)
   */
  private webhooks(): WebhookConfig[] {
    const webhooks: WebhookConfig[] = [];
    webhooks.push(...(this.session.sessionConfig?.webhooks ?? []));
    if (this.config.webhooks) {
      webhooks.push(this.config.webhooks);
    }
    return webhooks;
  }

  private getSuitableEvents(events: WAHAEvents[] | string[]): WAHAEvents[] {
    const result = this.eventUnmask.unmask(events);
    if (result.unknown.length > 0) {
      this.logger.warn(
        `Ignoring unknown webhook events: ${result.unknown.join(', ')}`,
      );
    }
    return result.events as WAHAEvents[];
  }

  private configure(webhook: WebhookConfig) {
    if (!webhook || !webhook.url || webhook.events.length === 0) {
      return;
    }

    const url = webhook.url;
    this.logger.info(`Configuring webhooks for ${url}...`);
    const events = this.getSuitableEvents(webhook.events);
    const sender = new WebhookSender(this.logger, webhook);
    for (const event of events) {
      const obs$ = this.session.getEventObservable(event);
      obs$.subscribe((payload) => {
        setImmediate(() => {
          const data = populateSessionInfo(event, this.session)(payload);
          sender.send(data);
        });
      });
      this.logger.debug(`Event '${event}' is enabled for url: ${url}`);
    }
    this.logger.info(`Webhooks were configured for ${url}.`);
  }
}
