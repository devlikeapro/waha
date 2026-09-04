import { Injectable } from '@nestjs/common';
import type { WhatsappSession } from '@waha/core/abc/session.abc';
import { PluginOptions } from '@waha/core/abc/session.plugin';
import { WidEnsureSuffixPlugin } from '@waha/modules/waha-wid-suffix/WidEnsureSuffixPlugin';
import { SessionPluginsProvider } from '@waha/plugins/SessionPluginsService';

@Injectable()
export class WidSuffixPluginsProvider implements SessionPluginsProvider {
  plugins(session: WhatsappSession): PluginOptions[] {
    return [WidEnsureSuffixPlugin.with(null, null)];
  }
}
