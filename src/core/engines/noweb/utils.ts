import { extractMessageContent, proto } from '@adiwajshing/baileys';

export function extractMediaContent(
  content: proto.IMessage | null | undefined,
) {
  content = extractMessageContent(content);
  const mediaContent =
    content?.documentMessage ||
    content?.imageMessage ||
    content?.videoMessage ||
    content?.audioMessage ||
    content?.stickerMessage;
  return mediaContent;
}
