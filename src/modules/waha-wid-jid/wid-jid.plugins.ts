import { Injectable } from '@nestjs/common';
import { getEngineName } from '@waha/config';
import type { WhatsappSession } from '@waha/core/abc/session.abc';
import { PluginOptions } from '@waha/core/abc/session.plugin';
import { WidToJIDPlugin } from '@waha/modules/waha-wid-jid/WidToJIDPlugin';
import { SessionPluginsProvider } from '@waha/plugins/SessionPluginsService';
import { WAHAEngine } from '@waha/structures/enums.dto';

// Engines working with the native JID format - 11111111111@s.whatsapp.net
const JID_ENGINES: string[] = [WAHAEngine.NOWEB, WAHAEngine.GOWS];

/**
 * Engine requires full jid format (@s.whatsapp.net)
 */
export function isJidEngine(env: NodeJS.ProcessEnv): boolean {
  return JID_ENGINES.includes(getEngineName());
}

@Injectable()
export class WidJIDPluginsProvider implements SessionPluginsProvider {
  plugins(session: WhatsappSession): PluginOptions[] {
    return [WidToJIDPlugin.with(null, null)];
  }
}
