import { getPresenceSubscriptionMethod } from './WebjsClientCore';

describe('getPresenceSubscriptionMethod', () => {
  it('uses the user presence bridge for direct chats and LIDs', () => {
    expect(getPresenceSubscriptionMethod('123@c.us')).toBe(
      'subscribeUserPresence',
    );
    expect(getPresenceSubscriptionMethod('123@lid')).toBe(
      'subscribeUserPresence',
    );
  });

  it('uses the group presence bridge for group chats', () => {
    expect(getPresenceSubscriptionMethod('123@g.us')).toBe(
      'subscribeGroupPresence',
    );
  });
});
