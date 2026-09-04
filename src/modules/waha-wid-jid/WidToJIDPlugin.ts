import { Stage } from '@waha/core/abc/session.hooks';
import { PluginHook } from '@waha/core/abc/session.plugin.hooks';
import { SessionPlugin } from '@waha/core/abc/session.plugin';
import { normalizeJid, toJID } from '@waha/core/utils/jids';

/**
 * Converts the wid to the engine-native JID format -
 * 11111111111@c.us => 11111111111@s.whatsapp.net
 */
export class WidToJIDPlugin extends SessionPlugin {
  @PluginHook((hooks) => hooks.wid.chat, { stage: Stage.LAST })
  @PluginHook((hooks) => hooks.wid.mention, { stage: Stage.LAST })
  toJID(wid: string): string {
    return normalizeJid(toJID(wid));
  }
}
