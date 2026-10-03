import { UnprocessableEntityException } from '@nestjs/common';
import {
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
