export function clearContent(attachments) {
  /**
   * Remove actual base64 "content" from attachment
   */
  if (!attachments) {
    return attachments;
  }
  return attachments.map((attachment) => {
    attachment = { ...attachment };
    attachment.content = '';
    return attachment;
  });
}
