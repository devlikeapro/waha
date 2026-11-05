import {
  buildCaptionEdit,
  findCaptionMedia,
} from '@waha/core/engines/noweb/noweb.edit';

const image = {
  caption: 'old caption',
  mimetype: 'image/jpeg',
  directPath: '/v/t62.7118-24/abc',
  fileSha256: new Uint8Array([1, 2, 3]),
  fileLength: 1234,
  height: 800,
  width: 800,
  contextInfo: { forwardingScore: 1 },
};

describe('buildCaptionEdit', () => {
  it('sends only the caption in chats', () => {
    expect(buildCaptionEdit({ imageMessage: image }, 'new', false)).toEqual({
      imageMessage: { caption: 'new' },
    });
  });

  it('keeps the media fields in channels', () => {
    expect(buildCaptionEdit({ imageMessage: image }, 'new', true)).toEqual({
      imageMessage: {
        caption: 'new',
        mimetype: 'image/jpeg',
        directPath: '/v/t62.7118-24/abc',
        fileSha256: new Uint8Array([1, 2, 3]),
        fileLength: 1234,
        height: 800,
        width: 800,
      },
    });
  });

  it('does not change the original message', () => {
    buildCaptionEdit({ imageMessage: image }, 'new', true);
    expect(image.caption).toBe('old caption');
    expect(image.contextInfo).toEqual({ forwardingScore: 1 });
  });

  it.each(['videoMessage', 'documentMessage'])('handles %s', (key) => {
    const content = { [key]: { caption: 'old', directPath: '/v/x' } };
    expect(buildCaptionEdit(content, 'new', true)).toEqual({
      [key]: { caption: 'new', directPath: '/v/x' },
    });
  });

  it('handles documentWithCaptionMessage', () => {
    const content = {
      documentWithCaptionMessage: {
        message: { documentMessage: { caption: 'old', directPath: '/v/x' } },
      },
    };
    expect(buildCaptionEdit(content, 'new', true)).toEqual({
      documentWithCaptionMessage: {
        message: { documentMessage: { caption: 'new', directPath: '/v/x' } },
      },
    });
  });

  it.each([undefined, null, { conversation: 'text' }])(
    'returns undefined for %p',
    (content) => {
      expect(buildCaptionEdit(content, 'new', true)).toBeUndefined();
    },
  );
});

describe('findCaptionMedia', () => {
  it('finds the image', () => {
    expect(findCaptionMedia({ imageMessage: image })).toBe(image);
  });

  it('returns null for text', () => {
    expect(findCaptionMedia({ conversation: 'text' })).toBeNull();
  });
});
