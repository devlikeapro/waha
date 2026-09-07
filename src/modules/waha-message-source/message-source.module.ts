import { Module } from '@nestjs/common';
import { MessageSourcePluginsProvider } from '@waha/modules/waha-message-source/message-source.plugins';
import { SessionPluginsModule } from '@waha/plugins/session.plugins.module';
import { SessionPluginsService } from '@waha/plugins/SessionPluginsService';

@Module({
  imports: [SessionPluginsModule],
  providers: [MessageSourcePluginsProvider],
})
/**
 * Remembers which messages were sent via the API, so message events can tell them apart from messages sent from the
 * phone or other linked clients - consumers use the source to skip echoes of their own API calls.
 */
export class MessageSourceModule {
  constructor(
    sessionPlugins: SessionPluginsService,
    provider: MessageSourcePluginsProvider,
  ) {
    sessionPlugins.register(provider);
  }
}
