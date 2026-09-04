import { PluginEvent } from '@waha/core/abc/session.plugin.events';
import { PluginHook } from '@waha/core/abc/session.plugin.hooks';
import { SessionPlugin } from '@waha/core/abc/session.plugin';
import {
  WAHAEvents,
  WAHAPresenceStatus,
  WAHASessionStatus,
} from '@waha/structures/enums.dto';
import { SessionInfo } from '@waha/structures/sessions.dto';
import { WASessionStatusBody } from '@waha/structures/webhooks.dto';
import * as lodash from 'lodash';
import { Observable } from 'rxjs';

export class MaintainOnlineStatusPluginConfig {
  duration: number; // in milliseconds
}

/**
 * Sets the session presence to ONLINE before any activity goes to the server
 * then auto-sets OFFLINE after `duration` ms without activity.
 */
export class MaintainOnlineStatusPlugin extends SessionPlugin<MaintainOnlineStatusPluginConfig> {
  private lastOnlineTimestamp?: number;
  private offlineTimeout?: ReturnType<typeof setTimeout>;

  @PluginHook((hooks) => hooks.session.info)
  attachActivityTimestamp(info: SessionInfo): SessionInfo {
    return lodash.merge(info, {
      timestamps: {
        activity: this.getLastOnlineTimestamp() ?? null,
      },
    });
  }

  @PluginEvent(WAHAEvents.SESSION_STATUS)
  onSessionStatus(events$: Observable<WASessionStatusBody>) {
    events$.subscribe({
      next: (body: WASessionStatusBody) => {
        if (body.status !== WAHASessionStatus.WORKING) {
          this.cleanupPresenceTimeout();
        }
      },
      complete: () => {
        this.cleanupPresenceTimeout();
      },
    });
  }

  /**
   * Returns the timestamp of the last "activity" in the session
   * @returns Timestamp in milliseconds or undefined if there was never any activity
   */
  public getLastOnlineTimestamp(): number | undefined {
    return this.lastOnlineTimestamp;
  }

  @PluginHook((hooks) => hooks.activity)
  async maintainPresenceOnline(): Promise<void> {
    if (this.session.status !== WAHASessionStatus.WORKING) {
      return;
    }
    this.lastOnlineTimestamp = Date.now();
    // If not ONLINE yet, send ONLINE
    if (this.session.presence !== WAHAPresenceStatus.ONLINE) {
      try {
        // Force set ONLINE in case of many requests comes at the same time
        // So we'll set ONLINE exactly once
        this.session.presence = WAHAPresenceStatus.ONLINE;
        await this.session.setPresence(WAHAPresenceStatus.ONLINE);
        this.logger.debug('Set presence to ONLINE due to activity');
      } catch (error) {
        this.logger.debug('Failed to set presence ONLINE', error);
        return;
      }
    }
    // Cancel the previous timeout (if exists)
    this.cleanupPresenceTimeout();

    // Schedule to go back OFFLINE after timeout without activity
    this.offlineTimeout = setTimeout(async () => {
      try {
        const working = this.session.status === WAHASessionStatus.WORKING;
        const online = this.session.presence === WAHAPresenceStatus.ONLINE;
        if (!working || !online) {
          // Nothing to do
          return;
        }
        await this.session.setPresence(WAHAPresenceStatus.OFFLINE);
        this.logger.debug(
          'Auto-set presence to OFFLINE after time without activity',
        );
      } catch (error) {
        this.session.presence = WAHAPresenceStatus.OFFLINE;
        this.logger.debug('Failed to set presence OFFLINE', error);
      }
      this.cleanupPresenceTimeout();
    }, this.config.duration);
  }

  protected cleanupPresenceTimeout() {
    clearTimeout(this.offlineTimeout);
    this.offlineTimeout = null;
  }
}
