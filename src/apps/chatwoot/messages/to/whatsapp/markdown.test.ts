import { MarkdownToWhatsApp } from './markdown';

describe('MarkdownToWhatsApp', () => {
  it('converts triple-backtick blocks', () => {
    const input = '```code block```';
    expect(MarkdownToWhatsApp(input)).toBe('```code block```');
  });
  it('converts italic and bold syntax', () => {
    const input = '*italic* **bold**';
    expect(MarkdownToWhatsApp(input)).toBe('_italic_ *bold*');
  });
  it('handles multiple transformations at once', () => {
    const input = `Here is a code block:\n\`\`\`some code\`\`\`\n**bold** *italic* ~~strike~~ [example](http://example.com)\n- item`;
    const expected = `Here is a code block:\n\`\`\`some code\`\`\`\n*bold* _italic_ ~strike~ example (http://example.com)\n* item`;
    expect(MarkdownToWhatsApp(input)).toBe(expected);
  });

  // Tests for URL protection
  it('preserves URLs with multiple underscores', () => {
    const input = 'https://example.com/page__name__test';
    expect(MarkdownToWhatsApp(input)).toBe(
      'https://example.com/page__name__test',
    );
  });

  it('preserves URLs with double underscores', () => {
    const input = 'https://en.wikipedia.org/wiki/Sarah_Jessica_Parker';
    expect(MarkdownToWhatsApp(input)).toBe(
      'https://en.wikipedia.org/wiki/Sarah_Jessica_Parker',
    );
  });

  it('preserves URLs inside markdown links', () => {
    const input =
      'Veja [perfil](https://en.wikipedia.org/wiki/Sarah_Jessica_Parker)';
    const expected =
      'Veja perfil (https://en.wikipedia.org/wiki/Sarah_Jessica_Parker)';
    expect(MarkdownToWhatsApp(input)).toBe(expected);
  });

  it('handles mixed text with URLs and formatting', () => {
    const input = 'Veja **isso** em https://example.com/test_link e _aquilo_';
    const expected = 'Veja *isso* em https://example.com/test_link e _aquilo_';
    expect(MarkdownToWhatsApp(input)).toBe(expected);
  });

  it('handles multiple URLs in the same text', () => {
    const input =
      'Links: https://example.com/page_1 e https://example.com/page_2';
    expect(MarkdownToWhatsApp(input)).toBe(
      'Links: https://example.com/page_1 e https://example.com/page_2',
    );
  });

  it('normalizes escaped newlines from ChatWoot', () => {
    // Test case: ChatWoot sends \\\n (literal: backslash, backslash, backslash, n) instead of \n
    // Using String.raw to represent literal characters: \ + \ + \ + n
    const input = String.raw`djaskldlaksj \\\n \\\n \\\ndkasldjlaskj \\\n \\\ndaksldkajlsk`;
    const expected = 'djaskldlaksj \n \n \ndkasldjlaskj \n \ndaksldkajlsk';
    expect(MarkdownToWhatsApp(input)).toBe(expected);
  });

  it('normalizes multiple escaped newlines', () => {
    // Test case with multiple escaped newlines
    // \\\n = \ + \ + \ + n (3 backslashes), \\\\\n = \ + \ + \ + \ + n (4 backslashes)
    const input = String.raw`text1 \\\n text2 \\\\\n text3`;
    const expected = 'text1 \n text2 \n text3';
    expect(MarkdownToWhatsApp(input)).toBe(expected);
  });

  it('normalizes even number of escaped backslashes', () => {
    // Test case: 4 backslashes (even number) followed by n
    // In String.raw: \\\\n = 4 backslashes + n
    const input = String.raw`text \\\\n more text`;
    const expected = 'text \n more text';
    expect(MarkdownToWhatsApp(input)).toBe(expected);
  });

  it('normalizes odd number of escaped backslashes', () => {
    // Test case: 5 backslashes (odd number) followed by n
    // In String.raw: \\\\\n = 5 backslashes + n
    const input = String.raw`text \\\\\n more text`;
    const expected = 'text \n more text';
    expect(MarkdownToWhatsApp(input)).toBe(expected);
  });

  it('does not normalize single backslash followed by n', () => {
    // Test case: single backslash + n should NOT be normalized (legitimate newline)
    // In String.raw: \n represents a single backslash + n
    const input = String.raw`text \n more text`;
    const expected = String.raw`text \n more text`; // Should remain unchanged
    expect(MarkdownToWhatsApp(input)).toBe(expected);
  });
});
