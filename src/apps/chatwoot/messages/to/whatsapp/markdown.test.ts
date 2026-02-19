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

  // ChatWoot v4.10.1+ escapes newlines with trailing backslash
  it('strips trailing backslash before newlines', () => {
    const input = 'Hi \\\ntext message \\\nwith line \\\nbreak';
    expect(MarkdownToWhatsApp(input)).toBe(
      'Hi \ntext message \nwith line \nbreak',
    );
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
});
