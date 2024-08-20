import { IMediaEngineProcessor } from '@waha/core/media/IMediaEngineProcessor';
import { IMediaStorage } from '@waha/core/media/IMediaStorage';

import { WAMedia } from '../../structures/responses.dto';
import { IMediaManager } from './IMediaManager';

export class MediaManagerCore implements IMediaManager {
  constructor(
    private storage: IMediaStorage,
    private mimetypes: string[],
  ) {}

  async processMedia<Message>(
    processor: IMediaEngineProcessor<Message>,
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
