/**
 * mimetype and filename override the declared values when the actual content differs
 */
interface MediaContent {
  buffer: Buffer;
  mimetype?: string;
  filename?: string;
}

/**
 * Engine specific media processor
 * Knows how to extract necessary attributes and fetch the data from Message
 */
interface IMediaEngineProcessor<Message> {
  hasMedia(message: Message): boolean;

  getFilename(message: Message): string | null;

  getMimetype(message: Message): string;

  getMessageId(message: Message): string;

  getChatId(message: Message): string;

  getMediaContent(message: Message): Promise<MediaContent | null>;
}

export { IMediaEngineProcessor, MediaContent };
