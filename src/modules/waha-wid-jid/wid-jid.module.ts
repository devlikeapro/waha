import { Module } from '@nestjs/common';
import { WidJIDPluginsProvider } from '@waha/modules/waha-wid-jid/wid-jid.plugins';
import { SessionPluginsModule } from '@waha/plugins/session.plugins.module';
import { SessionPluginsService } from '@waha/plugins/SessionPluginsService';

@Module({
  imports: [SessionPluginsModule],
  providers: [WidJIDPluginsProvider],
})
/**
 * Converts chat ids to the JID format - 11111111111@c.us => 11111111111@s.whatsapp.net.
 * NOWEB and GOWS talk to WhatsApp servers directly and require the native JID format, while the API keeps accepting
 * (and other engines keep using) the WhatsApp Web format.
 */
export class WidJIDModule {
  constructor(
    sessionPlugins: SessionPluginsService,
    provider: WidJIDPluginsProvider,
  ) {
    sessionPlugins.register(provider);
  }
}
