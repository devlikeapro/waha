import { Stage } from '@waha/core/abc/session.hooks';
import { PluginHook } from '@waha/core/abc/session.plugin.hooks';
import { SessionPlugin } from '@waha/core/abc/session.plugin';
import { SessionInfo } from '@waha/structures/sessions.dto';
import * as lodash from 'lodash';

/**
 * Provides the base runtime session info.
 */
export class SessionRuntimeInfoPlugin extends SessionPlugin {
  @PluginHook((hooks) => hooks.session.info, { stage: Stage.FIRST })
  getSessionInfo(info: SessionInfo): SessionInfo {
    return lodash.merge(info, {
      name: this.session.name,
      status: this.session.status,
      config: this.session.sessionConfig,
      me: this.session.getSessionMeInfo(),
      presence: this.session.presence,
      timestamps: {
        activity: null,
      },
    });
  }
}
