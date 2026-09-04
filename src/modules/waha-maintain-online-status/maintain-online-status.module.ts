import { Module } from '@nestjs/common';
import { SessionPluginsModule } from '@waha/plugins/session.plugins.module';
import { SessionPluginsService } from '@waha/plugins/SessionPluginsService';
import { MaintainOnlineStatusConfigService } from '@waha/modules/waha-maintain-online-status/maintain-online-status.config';
import { MaintainOnlineStatusPluginsProvider } from '@waha/modules/waha-maintain-online-status/maintain-online-status.plugins';

@Module({
  imports: [SessionPluginsModule],
  providers: [
    MaintainOnlineStatusConfigService,
    MaintainOnlineStatusPluginsProvider,
  ],
})
/**
 * Sets the session presence to ONLINE on any API activity and back to OFFLINE after an idle period - mimicking how
 * WhatsApp Web behaves when a real user is active, so the account does not look permanently offline while being
 * driven through the API. Disable with WAHA_PRESENCE_AUTO_ONLINE=false.
 */
export class MaintainOnlineStatusModule {
  constructor(
    sessionPlugins: SessionPluginsService,
    provider: MaintainOnlineStatusPluginsProvider,
  ) {
    sessionPlugins.register(provider);
  }
}
