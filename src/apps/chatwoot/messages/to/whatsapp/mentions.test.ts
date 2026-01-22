import { parseMentionsFromText } from './mentions';

describe('parseMentionsFromText', () => {
  it('returns null mentions when none exist', () => {
    const input = 'Hello there';
    expect(parseMentionsFromText(input)).toEqual({
      text: 'Hello there',
      mentions: null,
    });
  });

  it('handles empty content safely', () => {
    expect(parseMentionsFromText(null)).toEqual({
      text: null,
      mentions: null,
    });
  });

  it('parses @all and removes it from the text', () => {
    const input = 'Hello @all';
    expect(parseMentionsFromText(input)).toEqual({
      text: 'Hello',
      mentions: ['all'],
    });
  });

  it('parses @ALL case-insensitively', () => {
    const input = 'Hello @ALL';
    expect(parseMentionsFromText(input)).toEqual({
      text: 'Hello',
      mentions: ['all'],
    });
  });

  it('uses a fallback text when only @all is present', () => {
    const input = '@all';
    expect(parseMentionsFromText(input)).toEqual({
      text: ' ',
      mentions: ['all'],
    });
  });

  it('parses phone number mentions with a suffix', () => {
    const input = 'Ping @558591203123';
    expect(parseMentionsFromText(input)).toEqual({
      text: 'Ping @558591203123',
      mentions: ['558591203123@c.us'],
    });
  });

  it('deduplicates phone number mentions', () => {
    const input = 'Hi @1111111 and @1111111';
    expect(parseMentionsFromText(input)).toEqual({
      text: 'Hi @1111111 and @1111111',
      mentions: ['1111111@c.us'],
    });
  });

  it('handles @all alongside phone mentions', () => {
    const input = '@all Hi @558591203123';
    expect(parseMentionsFromText(input)).toEqual({
      text: 'Hi @558591203123',
      mentions: ['all', '558591203123@c.us'],
    });
  });

  it('ignores quoted @all text', () => {
    const input = "You can send '@all' to chat";
    expect(parseMentionsFromText(input)).toEqual({
      text: "You can send '@all' to chat",
      mentions: null,
    });
  });

  it('ignores email-like mentions', () => {
    const input = 'Reach us at email@12341domain.com';
    expect(parseMentionsFromText(input)).toEqual({
      text: 'Reach us at email@12341domain.com',
      mentions: null,
    });
  });

  it('ignores @all when followed by letters', () => {
    const input = 'Please ping @allx';
    expect(parseMentionsFromText(input)).toEqual({
      text: 'Please ping @allx',
      mentions: null,
    });
  });

  it('ignores phone mentions followed by letters', () => {
    const input = 'Call @1234567abc';
    expect(parseMentionsFromText(input)).toEqual({
      text: 'Call @1234567abc',
      mentions: null,
    });
  });

  it('ignores @all inside email-like text', () => {
    const input = 'Contact email@alldomain.com for details';
    expect(parseMentionsFromText(input)).toEqual({
      text: 'Contact email@alldomain.com for details',
      mentions: null,
    });
  });

  it('accepts phone mentions with trailing punctuation', () => {
    const input = 'Ping @1231234, then @5555555.';
    expect(parseMentionsFromText(input)).toEqual({
      text: 'Ping @1231234, then @5555555.',
      mentions: ['1231234@c.us', '5555555@c.us'],
    });
  });

  it('parses @lid mentions without c.us suffix', () => {
    const input = 'Notify @123123@lid now';
    expect(parseMentionsFromText(input)).toEqual({
      text: 'Notify @123123 now',
      mentions: ['123123@lid'],
    });
  });

  it('replaces @lid suffix with plain ids', () => {
    const input = '@123456@lid please ping @654321@lid.';
    expect(parseMentionsFromText(input)).toEqual({
      text: '@123456 please ping @654321.',
      mentions: ['123456@lid', '654321@lid'],
    });
  });
});
