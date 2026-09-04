import { Module } from '@nestjs/common';
import { SessionRuntimeInfoPluginsProvider } from '@waha/modules/waha-session-runtime-info/session-runtime-info.plugins';
import { SessionPluginsModule } from '@waha/plugins/session.plugins.module';
import { SessionPluginsService } from '@waha/plugins/SessionPluginsService';

@Module({
  imports: [SessionPluginsModule],
  providers: [SessionRuntimeInfoPluginsProvider],
})
/**
 * Provides the base session info - name, status, config, me, presence - that the API returns for a running session.
 * Only running sessions have this runtime state; stopped ones are served from storage.
 */
export class SessionRuntimeInfoModule {
  constructor(
    sessionPlugins: SessionPluginsService,
    provider: SessionRuntimeInfoPluginsProvider,
  ) {
    sessionPlugins.register(provider);
  }
}
