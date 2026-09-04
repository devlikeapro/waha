import { ensureSuffix } from '@waha/core/abc/session.abc';
import { Stage } from '@waha/core/abc/session.hooks';
import { PluginHook } from '@waha/core/abc/session.plugin.hooks';
import { SessionPlugin } from '@waha/core/abc/session.plugin';

/**
 * Ensures the wid has a suffix - 11111111111 => 11111111111@c.us
 */
export class WidEnsureSuffixPlugin extends SessionPlugin {
  @PluginHook((hooks) => hooks.wid.chat, { stage: Stage.FIRST })
  @PluginHook((hooks) => hooks.wid.mention, { stage: Stage.FIRST })
  ensureWidSuffix(wid: string): string {
    return ensureSuffix(wid);
  }
}
