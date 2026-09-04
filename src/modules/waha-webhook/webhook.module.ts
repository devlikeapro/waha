import { Module } from '@nestjs/common';
import { GlobalWebhookConfig } from '@waha/modules/waha-webhook/webhook.config';
import { WebhookPluginsProvider } from '@waha/modules/waha-webhook/webhook.plugins';
import { SessionPluginsModule } from '@waha/plugins/session.plugins.module';
import { SessionPluginsService } from '@waha/plugins/SessionPluginsService';

@Module({
  imports: [SessionPluginsModule],
  providers: [GlobalWebhookConfig, WebhookPluginsProvider],
})
/**
 * Sends session events to the configured webhooks - the main way to consume WAHA events.
 * Both per-session webhooks (session config) and the predefined one (WHATSAPP_HOOK_URL) are delivered;
 * it also fails the startup fast if the predefined webhook env configuration is invalid.
 */
export class WebhookModule {
  constructor(
    sessionPlugins: SessionPluginsService,
    provider: WebhookPluginsProvider,
  ) {
    sessionPlugins.register(provider);
  }
}
