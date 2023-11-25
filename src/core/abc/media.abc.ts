abstract class MediaStorage {
  abstract save(
    messageId: string,
    mimetype: string,
    buffer: Buffer,
  ): Promise<string>;
}

interface IEngineMediaProcessor<Message> {
  hasMedia(message: Message): boolean;

  getFilename(message: Message): string | null;

  getMimetype(message: Message): string;

  getMessageId(message: Message): string;

  getMediaBuffer(message: Message): Promise<Buffer | null>;
}

interface MediaManager {
  processMedia<Message>(
    processor: IEngineMediaProcessor<Message>,
    message: Message,
  ): Promise<Message>;
}

export { IEngineMediaProcessor, MediaManager, MediaStorage };
