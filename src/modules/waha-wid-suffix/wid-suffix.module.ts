import { Module } from '@nestjs/common';
import { WidSuffixPluginsProvider } from '@waha/modules/waha-wid-suffix/wid-suffix.plugins';
import { SessionPluginsModule } from '@waha/plugins/session.plugins.module';
import { SessionPluginsService } from '@waha/plugins/SessionPluginsService';

@Module({
  imports: [SessionPluginsModule],
  providers: [WidSuffixPluginsProvider],
})
/**
 * Accepts bare phone numbers in API requests by adding the chat suffix - 11111111111 => 11111111111@c.us.
 * Users often pass just the number, while engines always expect a full chat id - so we normalize it once for all
 * engines instead of failing the request.
 */
export class WidSuffixModule {
  constructor(
    sessionPlugins: SessionPluginsService,
    provider: WidSuffixPluginsProvider,
  ) {
    sessionPlugins.register(provider);
  }
}
