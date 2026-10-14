import { UnprocessableEntityException } from '@nestjs/common';
import {
  getBroadcastListRecipients,
  isBroadcastListJid,
  rejectUnsupportedBroadcastListParticipants,
  validateBroadcastListParticipants,
} from '@waha/core/utils/broadcastLists';

describe('isBroadcastListJid', () => {
  it.each([
    ['11111111111@broadcast', true],
    ['status@broadcast', false],
    ['11111111111@c.us', false],
    ['11111111111@g.us', false],
    [undefined, false],
  ])('%s => %s', (jid, expected) => {
    expect(isBroadcastListJid(jid)).toBe(expected);
  });
});

describe('validateBroadcastListParticipants', () => {
  it('accepts a broadcast list with participants', () => {
    expect(() =>
      validateBroadcastListParticipants({
        chatId: '11111111111@broadcast',
        participants: ['22222222222@c.us'],
      }),
    ).not.toThrow();
  });

  it('accepts a regular chat without participants', () => {
    expect(() =>
      validateBroadcastListParticipants({
        chatId: '11111111111@c.us',
      }),
    ).not.toThrow();
  });

  it('rejects participants sent to a regular chat', () => {
    expect(() =>
      validateBroadcastListParticipants({
        chatId: '11111111111@c.us',
        participants: ['22222222222@c.us'],
      }),
    ).toThrow(UnprocessableEntityException);
  });

  it('rejects participants sent to the status broadcast', () => {
    expect(() =>
      validateBroadcastListParticipants({
        chatId: 'status@broadcast',
        participants: ['22222222222@c.us'],
      }),
    ).toThrow(UnprocessableEntityException);
  });

  it('rejects a broadcast list without participants', () => {
    expect(() =>
      validateBroadcastListParticipants({
        chatId: '11111111111@broadcast',
      }),
    ).toThrow(UnprocessableEntityException);
  });

  it('rejects a broadcast list with an empty participants list', () => {
    expect(() =>
      validateBroadcastListParticipants({
        chatId: '11111111111@broadcast',
        participants: [],
      }),
    ).toThrow(UnprocessableEntityException);
  });

  it.each([['22222222222@c.us'], [[22222222222]], [['22222222222@c.us', '']]])(
    'rejects participants that are not a list of IDs: %p',
    (participants) => {
      expect(() =>
        validateBroadcastListParticipants({
          chatId: '11111111111@broadcast',
          participants: participants as any,
        }),
      ).toThrow(UnprocessableEntityException);
    },
  );
});

describe('rejectUnsupportedBroadcastListParticipants', () => {
  it('does nothing when there are no participants', () => {
    expect(() => rejectUnsupportedBroadcastListParticipants({})).not.toThrow();
  });

  it('throws when participants are provided', () => {
    expect(() =>
      rejectUnsupportedBroadcastListParticipants({
        participants: ['22222222222@c.us'],
      }),
    ).toThrow();
  });
});

describe('getBroadcastListRecipients', () => {
  const own = ['33333333333@lid', '11111111111@c.us'];
  const lids = {
    '11111111111@c.us': '33333333333@lid',
    '22222222222@c.us': '44444444444@lid',
  };

  // Like the GOWS lookup: LIDs are kept, phone numbers are looked up.
  function findLid(participant: string): Promise<string> {
    if (participant.endsWith('@lid')) {
      return Promise.resolve(participant);
    }
    return Promise.resolve(lids[participant]);
  }

  it('maps phone numbers to their LID and keeps LIDs', async () => {
    const recipients = await getBroadcastListRecipients(
      ['22222222222@c.us', '55555555555@lid'],
      own,
      findLid,
    );
    expect(recipients).toStrictEqual(['44444444444@lid', '55555555555@lid']);
  });

  it('leaves out the account itself, by phone number or by LID', async () => {
    const recipients = await getBroadcastListRecipients(
      [
        '11111111111@c.us',
        '11111111111@s.whatsapp.net',
        '33333333333@lid',
        '22222222222@c.us',
      ],
      own,
      findLid,
    );
    expect(recipients).toStrictEqual(['44444444444@lid']);
  });

  it('leaves out the account when only its LID is known', async () => {
    const recipients = await getBroadcastListRecipients(
      ['11111111111@c.us', '22222222222@c.us'],
      ['33333333333@lid', undefined],
      findLid,
    );
    expect(recipients).toStrictEqual(['44444444444@lid']);
  });

  it('sends once to a participant given twice', async () => {
    const recipients = await getBroadcastListRecipients(
      ['22222222222@c.us', '44444444444@lid'],
      own,
      findLid,
    );
    expect(recipients).toStrictEqual(['44444444444@lid']);
  });

  it('returns no recipients without participants', async () => {
    expect(
      await getBroadcastListRecipients(undefined, own, findLid),
    ).toStrictEqual([]);
    expect(await getBroadcastListRecipients([], own, findLid)).toStrictEqual(
      [],
    );
  });

  it('fails when a LID cannot be found', async () => {
    function notFound(): Promise<string> {
      return Promise.reject(new UnprocessableEntityException('No LID'));
    }
    await expect(
      getBroadcastListRecipients(['66666666666@c.us'], own, notFound),
    ).rejects.toThrow(UnprocessableEntityException);
  });
});
