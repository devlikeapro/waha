import { WhatsappSession } from '@waha/core/abc/session.abc';
import { WAHAEvents, WAHASessionStatus } from '@waha/structures/enums.dto';
import {
  MeInfo,
  ReachoutTimelockData,
  ReachoutTimelockEnforcementType,
} from '@waha/structures/sessions.dto';
import { WASessionStatusBody } from '@waha/structures/webhooks.dto';

const logger: any = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};
logger.child = () => logger;

const BaseSession = WhatsappSession as unknown as new (params: any) => any;

class TestSession extends BaseSession {
  public getSessionMeInfo(): MeInfo | null {
    // pushName and id must be set so the SESSION_STATUS pipeline does not delay WORKING statuses
    return { id: '123@c.us', pushName: 'Test' };
  }

  public setStatusPublic(status: WAHASessionStatus) {
    this.setStatus(status);
  }

  public updateReachoutTimelockPublic(timelock: ReachoutTimelockData | null) {
    this.reachoutTimelock.update(timelock);
  }
}

function buildSession(): TestSession {
  return new TestSession({
    name: 'test',
    printQR: false,
    loggerBuilder: { child: () => logger },
    sessionStore: null,
    mediaManager: null,
    sessionConfig: null,
    engineConfig: null,
    ignore: {},
  });
}

const ACTIVE_TIMELOCK: ReachoutTimelockData = {
  enforcementType: ReachoutTimelockEnforcementType.RESTRICT_ALL_COMPANIONS,
  isActive: true,
  timeEnforcementEnds: Math.floor(Date.now() / 1000) + 3600,
};

describe('WhatsappSession reachout timelock', () => {
  let session: TestSession;
  let statuses: WASessionStatusBody[];

  beforeEach(() => {
    session = buildSession();
    statuses = [];
    session
      .getEventObservable(WAHAEvents.SESSION_STATUS)
      .subscribe((body: WASessionStatusBody) => statuses.push(body));
  });

  it('re-issues WORKING with data when a timelock arrives', () => {
    session.setStatusPublic(WAHASessionStatus.WORKING);
    session.updateReachoutTimelockPublic(ACTIVE_TIMELOCK);

    expect(statuses).toHaveLength(2);
    expect(statuses[1].status).toEqual(WAHASessionStatus.WORKING);
    expect(statuses[1].data).toEqual({ reachoutTimelock: ACTIVE_TIMELOCK });
  });

  it('keeps attaching the timelock on plain WORKING assignments', () => {
    session.setStatusPublic(WAHASessionStatus.WORKING);
    session.updateReachoutTimelockPublic(ACTIVE_TIMELOCK);
    // Reconnect flows assign 'status = WORKING' with no data
    session.setStatusPublic(WAHASessionStatus.STARTING);
    session.setStatusPublic(WAHASessionStatus.WORKING);

    const last = statuses.at(-1);
    expect(last.status).toEqual(WAHASessionStatus.WORKING);
    expect(last.data).toEqual({ reachoutTimelock: ACTIVE_TIMELOCK });
  });

  it('collapses consecutive WORKING statuses with the same data', () => {
    session.setStatusPublic(WAHASessionStatus.WORKING);
    session.updateReachoutTimelockPublic(ACTIVE_TIMELOCK);
    session.setStatusPublic(WAHASessionStatus.WORKING);
    session.setStatusPublic(WAHASessionStatus.WORKING);

    expect(statuses).toHaveLength(2);
  });

  it('ignores duplicate timelock updates', () => {
    session.setStatusPublic(WAHASessionStatus.WORKING);
    session.updateReachoutTimelockPublic(ACTIVE_TIMELOCK);
    session.updateReachoutTimelockPublic({ ...ACTIVE_TIMELOCK });

    expect(statuses).toHaveLength(2);
  });

  it('ignores an inactive timelock when none has been seen', () => {
    session.setStatusPublic(WAHASessionStatus.WORKING);
    session.updateReachoutTimelockPublic({
      enforcementType: ReachoutTimelockEnforcementType.DEFAULT,
      isActive: false,
      timeEnforcementEnds: null,
    });

    expect(statuses).toHaveLength(1);
    expect(statuses[0].data).toBeNull();
  });

  it('re-issues WORKING when the timelock is lifted by an event', () => {
    session.setStatusPublic(WAHASessionStatus.WORKING);
    session.updateReachoutTimelockPublic(ACTIVE_TIMELOCK);
    const lifted = { ...ACTIVE_TIMELOCK, isActive: false };
    session.updateReachoutTimelockPublic(lifted);

    expect(statuses).toHaveLength(3);
    expect(statuses[2].data).toEqual({ reachoutTimelock: lifted });
  });

  it('marks the timelock inactive when the enforcement expires', () => {
    jest.useFakeTimers();
    try {
      const endsAt = Math.floor(Date.now() / 1000) + 600;
      session.setStatusPublic(WAHASessionStatus.WORKING);
      session.updateReachoutTimelockPublic({
        ...ACTIVE_TIMELOCK,
        timeEnforcementEnds: endsAt,
      });

      jest.advanceTimersByTime(601 * 1000);

      const last = statuses.at(-1);
      expect(last.data.reachoutTimelock.isActive).toBe(false);
    } finally {
      jest.useRealTimers();
    }
  });

  it('does not fire the expiry timer after the session stops', () => {
    jest.useFakeTimers();
    try {
      session.setStatusPublic(WAHASessionStatus.WORKING);
      session.updateReachoutTimelockPublic({
        ...ACTIVE_TIMELOCK,
        timeEnforcementEnds: Math.floor(Date.now() / 1000) + 600,
      });
      session.setStatusPublic(WAHASessionStatus.STOPPED);
      const count = statuses.length;

      jest.advanceTimersByTime(601 * 1000);

      expect(statuses).toHaveLength(count);
    } finally {
      jest.useRealTimers();
    }
  });
});
