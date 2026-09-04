import { Injectable } from '@nestjs/common';
import type { WhatsappSession } from '@waha/core/abc/session.abc';
import { PluginOptions } from '@waha/core/abc/session.plugin';
import { MessageSourceCachePlugin } from '@waha/modules/waha-message-source/MessageSourceCachePlugin';
import { SessionPluginsProvider } from '@waha/plugins/SessionPluginsService';

@Injectable()
export class MessageSourcePluginsProvider implements SessionPluginsProvider {
  plugins(session: WhatsappSession): PluginOptions[] {
    return [MessageSourceCachePlugin.with(null, null)];
  }
}
