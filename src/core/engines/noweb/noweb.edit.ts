import type { proto } from '@adiwajshing/baileys';

const CAPTION_MEDIA_KEYS = [
  'imageMessage',
  'videoMessage',
  'documentMessage',
] as const;

/**
 * Finds the media part of a message that can carry a caption.
 */
export function findCaptionMedia(
  content: proto.IMessage | null | undefined,
): { directPath?: string | null } | null {
  for (const key of CAPTION_MEDIA_KEYS) {
    if (content?.[key]) {
      return content[key];
    }
  }
  return content?.documentWithCaptionMessage?.message?.documentMessage ?? null;
}

/**
 * Builds the "editedMessage" for a caption edit of a media message.
 *
 * In chats WhatsApp merges the new caption into the original message, so the
 * caption alone is enough. In channels (newsletters) the edit replaces the
 * whole post: it must carry the original media fields (directPath, mimetype,
 * sha256, ...) or followers get the new caption without the media.
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

function withCaption<T extends { caption?: string | null; contextInfo?: any }>(
  media: T,
  text: string,
  keepMedia: boolean,
): T {
  if (!keepMedia) {
    return { caption: text } as T;
  }
  const copy = { ...media, caption: text };
  // Mentions and replies of the edit are set by sendMessage itself
  delete copy.contextInfo;
  return copy;
}
