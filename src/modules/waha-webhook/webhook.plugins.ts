import { Injectable } from '@nestjs/common';
import type { WhatsappSession } from '@waha/core/abc/session.abc';
import { PluginOptions } from '@waha/core/abc/session.plugin';
import { GlobalWebhookConfig } from '@waha/modules/waha-webhook/webhook.config';
import { WebhookPlugin } from '@waha/modules/waha-webhook/WebhookPlugin';
import { SessionPluginsProvider } from '@waha/plugins/SessionPluginsService';

@Injectable()
export class WebhookPluginsProvider implements SessionPluginsProvider {
  constructor(private globalWebhook: GlobalWebhookConfig) {}

  plugins(session: WhatsappSession): PluginOptions[] {
    return [WebhookPlugin.with({ webhooks: this.globalWebhook.config }, null)];
  }
}
