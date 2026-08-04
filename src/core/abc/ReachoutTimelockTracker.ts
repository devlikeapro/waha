import { ReachoutTimelockData } from '@waha/structures/sessions.dto';
import { LongTimeout, setLongTimeout } from '@waha/utils/promiseTimeout';
import { EnsureMilliseconds } from '@waha/utils/timehelper';
import * as lodash from 'lodash';
import { Logger } from 'pino';
import { Observable, Subject } from 'rxjs';

/**
 * WhatsApp "reachout timelock"
 * The account is restricted from messaging new contacts for a period of time (the cause of 463 errors on send).
 * Keeps the latest known state, expires it when the enforcement ends and emits changes.
 */
export class ReachoutTimelockTracker {
  private timelock: ReachoutTimelockData | null = null;
  private timeout?: LongTimeout;
  private changes: Subject<ReachoutTimelockData | null> = new Subject();

  constructor(private logger: Logger) {}

  get value(): ReachoutTimelockData | null {
    return this.timelock;
  }

  get changes$(): Observable<ReachoutTimelockData | null> {
    return this.changes;
  }

  update(timelock: ReachoutTimelockData | null) {
    if (timelock && !timelock.isActive && !this.timelock) {
      // No enforcement has been seen for the account - keep it null instead of storing an inactive record
      // (startup fetch on a clean account lands here)
      return;
    }
    if (lodash.isEqual(this.timelock, timelock)) {
      return;
    }
    this.timeout?.clear();
    if (timelock?.isActive && timelock.timeEnforcementEnds) {
      const endsAtMs = EnsureMilliseconds(timelock.timeEnforcementEnds);
      const delay = Math.max(endsAtMs - Date.now(), 0);
      this.timeout = setLongTimeout(() => this.expire(), delay).unref();
    }
    this.apply(timelock);
  }

  /**
   * Stop the expiry timer, keeping the last known state.
   */
  stop() {
    this.timeout?.clear();
  }

  private expire() {
    if (!this.timelock?.isActive) {
      return;
    }
    this.apply({ ...this.timelock, isActive: false });
  }

  private apply(timelock: ReachoutTimelockData | null) {
    this.timelock = timelock;
    this.logger.info(
      { reachoutTimelock: timelock },
      'Reachout timelock updated',
    );
    this.changes.next(timelock);
  }
}
