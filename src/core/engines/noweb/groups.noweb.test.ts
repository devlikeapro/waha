import { ToGroupV2LeaveEvent } from '@waha/core/engines/noweb/groups.noweb';

describe('ToGroupV2LeaveEvent', () => {
  const update = {
    id: '120363422336768669@g.us',
    author: '45848826278102@lid',
    participants: [
      {
        id: '203732478357668@lid',
        phoneNumber: '51966666666@s.whatsapp.net',
        admin: null,
      },
    ],
    action: 'remove',
  };

  it('emits leave when the removed participant matches me by lid', () => {
    const event = ToGroupV2LeaveEvent(
      {
        id: '51966666666@s.whatsapp.net',
        lid: '203732478357668@lid',
      } as any,
      update as any,
    );

    expect(event).toEqual({
      timestamp: expect.any(Number),
      group: {
        id: '120363422336768669@g.us',
      },
      _data: update,
    });
  });

  it('emits leave when the removed participant matches me by phone number', () => {
    const event = ToGroupV2LeaveEvent(
      {
        id: '51966666666@s.whatsapp.net',
      } as any,
      update as any,
    );

    expect(event).toEqual({
      timestamp: expect.any(Number),
      group: {
        id: '120363422336768669@g.us',
      },
      _data: update,
    });
  });

  it('does not emit leave when another participant is removed', () => {
    const event = ToGroupV2LeaveEvent(
      {
        id: '51900000000@s.whatsapp.net',
        lid: '45848826278102@lid',
      } as any,
      update as any,
    );

    expect(event).toBeNull();
  });
});
