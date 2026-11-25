import {
  normalizeStatusStanzaId,
  parseMessageIdSerialized,
  SerializeMessageKey,
} from './ids';

describe('parseMessageIdSerialized', () => {
  it.each([
    // {fromMe}_{chatId}_{id}
    [
      'false_11111111111@c.us_AAAA',
      { fromMe: false, remoteJid: '11111111111@s.whatsapp.net', id: 'AAAA' },
    ],
    [
      'true_11111111111@s.whatsapp.net_AAAA',
      { fromMe: true, remoteJid: '11111111111@s.whatsapp.net', id: 'AAAA' },
    ],
    [
      'false_11111111111_AAAA',
      { fromMe: false, remoteJid: '11111111111@s.whatsapp.net', id: 'AAAA' },
    ],
    [
      'false_111111111111111@lid_AAAA',
      { fromMe: false, remoteJid: '111111111111111@lid', id: 'AAAA' },
    ],
    [
      'false_123456789@g.us_AAAA',
      { fromMe: false, remoteJid: '123456789@g.us', id: 'AAAA' },
    ],
    [
      'false_123456789@newsletter_99',
      { fromMe: false, remoteJid: '123456789@newsletter', id: '99' },
    ],
    [
      'false_status@broadcast_AAAA',
      { fromMe: false, remoteJid: 'status@broadcast', id: 'AAAA' },
    ],
    // {fromMe}_{chatId}_{id}_{participant}
    [
      'false_123456789@g.us_AAAA_22222222222@c.us',
      {
        fromMe: false,
        remoteJid: '123456789@g.us',
        id: 'AAAA',
        participant: '22222222222@s.whatsapp.net',
      },
    ],
    [
      'true_123456789@g.us_AAAA_222222222222222@lid',
      {
        fromMe: true,
        remoteJid: '123456789@g.us',
        id: 'AAAA',
        participant: '222222222222222@lid',
      },
    ],
    [
      'false_status@broadcast_AAAA_22222222222@s.whatsapp.net',
      {
        fromMe: false,
        remoteJid: 'status@broadcast',
        id: 'AAAA',
        participant: '22222222222@s.whatsapp.net',
      },
    ],
    // {id} with "_" inside
    [
      'false_status@broadcast_AAAA__part__abcdefgh_22222222222@c.us',
      {
        fromMe: false,
        remoteJid: 'status@broadcast',
        id: 'AAAA__part__abcdefgh',
        participant: '22222222222@s.whatsapp.net',
      },
    ],
    [
      'false_status@broadcast_AAAA__part__abcdefgh_222222222222222@lid',
      {
        fromMe: false,
        remoteJid: 'status@broadcast',
        id: 'AAAA__part__abcdefgh',
        participant: '222222222222222@lid',
      },
    ],
    [
      'false_status@broadcast_AAAA__part__abcdefgh',
      {
        fromMe: false,
        remoteJid: 'status@broadcast',
        id: 'AAAA__part__abcdefgh',
      },
    ],
    [
      'false_123456789@g.us_AAAA_BBBB',
      { fromMe: false, remoteJid: '123456789@g.us', id: 'AAAA_BBBB' },
    ],
    [
      'false_11111111111@c.us_AAAA_',
      { fromMe: false, remoteJid: '11111111111@s.whatsapp.net', id: 'AAAA_' },
    ],
  ])('%s', (messageId, expected) => {
    expect(parseMessageIdSerialized(messageId)).toEqual(expected);
  });

  it.each([
    ['AAAA', { id: 'AAAA' }],
    ['AAAA__part__abcdefgh', { id: 'AAAA__part__abcdefgh' }],
    ['foo_bar_baz', { id: 'foo_bar_baz' }],
    ['true_11111111111@c.us', { id: 'true_11111111111@c.us' }],
    [
      'true_123456789@g.us_AAAA_111@lid',
      {
        fromMe: true,
        remoteJid: '123456789@g.us',
        id: 'AAAA',
        participant: '111@lid',
      },
    ],
  ])('soft: %s', (messageId, expected) => {
    expect(parseMessageIdSerialized(messageId, true)).toEqual(expected);
  });

  it.each([
    'AAAA',
    '',
    'false_11111111111@c.us',
    'false_11111111111@c.us_',
    'maybe_11111111111@c.us_AAAA',
    'TRUE_11111111111@c.us_AAAA',
    '_11111111111@c.us_AAAA',
    'false__AAAA',
  ])('throws: %j', (messageId) => {
    expect(() => parseMessageIdSerialized(messageId)).toThrow(
      'Message id be in format',
    );
  });

  it('round-trips with SerializeMessageKey', () => {
    const messageId =
      'false_status@broadcast_AAAA__part__abcdefgh_222222222222222@lid';
    expect(SerializeMessageKey(parseMessageIdSerialized(messageId))).toBe(
      messageId,
    );
  });
});

describe('normalizeStatusStanzaId', () => {
  it.each([
    ['AAAA__part__abcdefgh', 'AAAA'],
    ['AAAA', 'AAAA'],
    ['AAAA_BBBB', 'AAAA_BBBB'],
    ['__part__abcdefgh', '__part__abcdefgh'],
    ['', ''],
  ])('%j => %j', (id, expected) => {
    expect(normalizeStatusStanzaId(id)).toBe(expected);
  });
});
