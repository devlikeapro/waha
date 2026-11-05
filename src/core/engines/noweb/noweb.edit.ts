import type { proto } from '@adiwajshing/baileys';

const CAPTION_MEDIA_KEYS = [
  'imageMessage',
  'videoMessage',
  'documentMessage',
] as const;

interface CaptionMedia {
  caption?: string | null;
  directPath?: string | null;
  contextInfo?: proto.IContextInfo | null;
}

/**
 * Finds the media part of a message that can carry a caption.
 */
export function findCaptionMedia(
  content: proto.IMessage | null | undefined,
): CaptionMedia | null {
  for (const key of CAPTION_MEDIA_KEYS) {
    if (content?.[key]) {
      return content[key];
    }
  }
  return content?.documentWithCaptionMessage?.message?.documentMessage ?? null;
}

/**
 * Picks the message a caption edit is based on, reading the channel post
 * only when no usable copy is stored, and whether its media can be kept.
 */
export async function resolveEditContent(
  stored: proto.IMessage | null | undefined,
  isChannel: boolean,
  readChannelPost: () => Promise<proto.IMessage | null>,
): Promise<{ content: proto.IMessage | null | undefined; keepMedia: boolean }> {
  let content = stored;
  const media = findCaptionMedia(content);
  if (isChannel && (!content || (media && !media.directPath))) {
    const original = await readChannelPost();
    if (original) {
      content = original;
    }
  }
  const keepMedia = isChannel && Boolean(findCaptionMedia(content)?.directPath);
  return { content: content, keepMedia: keepMedia };
}

/**
 * Finds a post by message id among fetched channel updates.
 */
export function findChannelPost(
  updates: { message?: proto.IWebMessageInfo | null }[],
  id: string,
): proto.IMessage | null {
  const update = updates.find((item) => item.message?.key?.id === id);
  return update?.message?.message ?? null;
}

/**
 * Builds the "editedMessage" for a caption edit. Channel edits replace the
 * whole post, so with keepMedia they carry the original media fields.
 */
export function buildCaptionEdit(
  content: proto.IMessage | null | undefined,
  text: string,
  keepMedia: boolean,
): proto.IMessage | undefined {
  for (const key of CAPTION_MEDIA_KEYS) {
    if (content?.[key]) {
      return { [key]: withCaption(content[key], text, keepMedia) };
    }
  }
  const document =
    content?.documentWithCaptionMessage?.message?.documentMessage;
  if (document) {
    return {
      documentWithCaptionMessage: {
        message: {
          documentMessage: withCaption(document, text, keepMedia),
        },
      },
    };
  }
  return undefined;
}

function withCaption(
  media: CaptionMedia,
  text: string,
  keepMedia: boolean,
): CaptionMedia {
  if (!keepMedia) {
    return { caption: text };
  }
  const copy = { ...media, caption: text };
  // sendMessage sets the edit's own mentions and replies
  delete copy.contextInfo;
  return copy;
}
