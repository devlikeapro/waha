import { IMediaEngineProcessor } from '@waha/core/media/IMediaEngineProcessor';
import { IMediaStorage, MediaData } from '@waha/core/media/IMediaStorage';
import { WAMedia } from '@waha/structures/media.dto';

import { IMediaManager } from './IMediaManager';

export class MediaManagerCore implements IMediaManager {
  constructor(
    private storage: IMediaStorage,
    private mimetypes: string[],
  ) {}

  async processMedia<Message>(
    processor: IMediaEngineProcessor<Message>,
    message: Message,
    session: string,
  ): Promise<Message> {
    if (!processor.hasMedia(message)) {
      return message;
    }
    const mimetype = '';
    const mediaData: MediaData = {
      session: session,
      message: {
        id: '',
      },
      file: {
        extension: '',
      },
    };
    const { url } = await this.storage.getStorageData(mediaData);

    const filename = processor.getFilename(message);
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
