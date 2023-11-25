import { WAMedia } from '../structures/responses.dto';
import {
  IEngineMediaProcessor,
  MediaManager,
  MediaStorage,
} from './abc/media.abc';
import { DOCS_URL } from './exceptions';

export class MediaStorageCore implements MediaStorage {
  async save(
    messageId: string,
    mimetype: string,
    buffer: Buffer,
  ): Promise<string> {
    return Promise.resolve(
      `Media attachment's available only in WAHA Plus version. ${DOCS_URL}`,
    );
  }
}

export class CoreMediaManager implements MediaManager {
  constructor(
    private storage: MediaStorage,
    private mimetypes: string[],
  ) {}

  async processMedia<Message>(
    processor: IEngineMediaProcessor<Message>,
    message: Message,
  ): Promise<Message> {
    if (!processor.hasMedia(message)) {
      return message;
    }
    const mimetype = '';
    const filename = processor.getFilename(message);
    const url = await this.storage.save('', mimetype, Buffer.from(''));
    const media: WAMedia = {
      mimetype: mimetype,
      filename: filename,
      url: url,
    };

    // @ts-ignore
    message.media = media;
    return message;
  }
}
