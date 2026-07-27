export function getWebjsMessageOptions(
  request: any,
  ensureSuffix: (value: string) => string,
): any {
  const mentions = request.mentions
    ? request.mentions.map(ensureSuffix)
    : undefined;
  const quotedMessageId = request.reply_to || request.replyTo;

  return {
    mentions: mentions,
    quotedMessageId: quotedMessageId,
    linkPreview: request.linkPreview,
    // Do not return before WhatsApp has accepted the message for sending.
    waitUntilMsgSent: true,
  };
}
