import {
  buildCaptionEdit,
  findCaptionMedia,
  findChannelPost,
  resolveEditContent,
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
const partialImage = { caption: 'old caption', mimetype: 'image/jpeg' };

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

describe('resolveEditContent', () => {
  function channelPost(content: any) {
    return jest.fn(async () => content);
  }

  it('never reads the channel for chats', async () => {
    const read = channelPost({ imageMessage: image });
    const result = await resolveEditContent(undefined, false, read);
    expect(read).not.toHaveBeenCalled();
    expect(result).toEqual({ content: undefined, keepMedia: false });
  });

  it('uses a stored copy that has the media', async () => {
    const read = channelPost(null);
    const stored = { imageMessage: image };
    const result = await resolveEditContent(stored, true, read);
    expect(read).not.toHaveBeenCalled();
    expect(result).toEqual({ content: stored, keepMedia: true });
  });

  it('does not read the channel for a stored text post', async () => {
    const read = channelPost(null);
    const stored = { conversation: 'text' };
    const result = await resolveEditContent(stored, true, read);
    expect(read).not.toHaveBeenCalled();
    expect(result).toEqual({ content: stored, keepMedia: false });
  });

  it('reads the channel without a stored copy', async () => {
    const original = { imageMessage: image };
    const result = await resolveEditContent(
      undefined,
      true,
      channelPost(original),
    );
    expect(result).toEqual({ content: original, keepMedia: true });
  });

  it('reads the channel when the stored media has no directPath', async () => {
    const original = { imageMessage: image };
    const read = channelPost(original);
    const result = await resolveEditContent(
      { imageMessage: partialImage },
      true,
      read,
    );
    expect(read).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ content: original, keepMedia: true });
  });

  it('falls back to a caption-only edit when the post is not found', async () => {
    const stored = { imageMessage: partialImage };
    const result = await resolveEditContent(stored, true, channelPost(null));
    expect(result).toEqual({ content: stored, keepMedia: false });
    expect(buildCaptionEdit(result.content, 'new', result.keepMedia)).toEqual({
      imageMessage: { caption: 'new' },
    });
  });
});

describe('findChannelPost', () => {
  it('finds the post by message id', () => {
    const updates = [
      { message: { key: { id: 'A' }, message: { conversation: 'a' } } },
      { message: null },
      { message: { key: { id: 'B' }, message: { imageMessage: image } } },
    ];
    expect(findChannelPost(updates, 'B')).toEqual({ imageMessage: image });
    expect(findChannelPost(updates, 'C')).toBeNull();
  });
});
