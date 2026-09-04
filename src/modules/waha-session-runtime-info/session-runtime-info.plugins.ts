import { Injectable } from '@nestjs/common';
import type { WhatsappSession } from '@waha/core/abc/session.abc';
import { PluginOptions } from '@waha/core/abc/session.plugin';
import { SessionRuntimeInfoPlugin } from '@waha/modules/waha-session-runtime-info/SessionRuntimeInfoPlugin';
import { SessionPluginsProvider } from '@waha/plugins/SessionPluginsService';

@Injectable()
export class SessionRuntimeInfoPluginsProvider
  implements SessionPluginsProvider
{
  plugins(session: WhatsappSession): PluginOptions[] {
    return [SessionRuntimeInfoPlugin.with(null, null)];
  }
}
