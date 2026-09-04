import { IMediaEngineProcessor } from '@waha/core/media/IMediaEngineProcessor';
import { WAMedia } from '@waha/structures/media.dto';

export interface MediaDownloadOptions {
  download: boolean;
  mimetypes: string[];
}

/**
 * General interface for MediaManager - one that handles the logic
 * and manipulates MediaStorage and MediaEngineProcessor
 */
export interface IMediaManager {
  processMedia<Message>(
    processor: IMediaEngineProcessor<Message>,
    message: Message,
    options: MediaDownloadOptions,
  ): Promise<WAMedia | null>;
  close(): void;
}
