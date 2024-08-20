/**
 * Engine specific media processor
 * Knows how to extract necessary attributes and fetch the data from Message
 */
interface IMediaEngineProcessor<Message> {
  hasMedia(message: Message): boolean;

  getFilename(message: Message): string | null;

  getMimetype(message: Message): string;

  getMessageId(message: Message): string;

  getMediaBuffer(message: Message): Promise<Buffer | null>;
}

export { IMediaEngineProcessor };
