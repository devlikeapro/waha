import {
  IMediaEngineProcessor,
  MediaContent,
} from '@waha/core/media/IMediaEngineProcessor';
import {
  IMediaManager,
  MediaDownloadOptions,
} from '@waha/core/media/IMediaManager';
import {
  IMediaStorage,
  MediaData,
  MediaStorageData,
} from '@waha/core/media/IMediaStorage';
import { WAMedia } from '@waha/structures/media.dto';
import { Logger } from 'pino';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mime = require('mime-types');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const promiseRetry = require('promise-retry');

function ext(mimetype: string): string {
  const extension = mime.extension(mimetype);
  if (mimetype == 'application/was' && !extension) {
    return 'zip';
  }
  return extension;
}

export class MediaManager implements IMediaManager {
  // https://github.com/IndigoUnited/node-promise-retry
  RETRY_OPTIONS = {
    retries: 5,
    minTimeout: 1000,
    maxTimeout: 3000,
  };

  constructor(
    private sessionName: string,
    private storage: IMediaStorage,
    protected log: Logger,
  ) {}

  /**
   *  Check that we need to download files with the mimetype
   */
  private shouldProcessMimetype(mimetypes: string[], mimetype: string) {
    // No specific mimetypes provided - always download
    if (!mimetypes || mimetypes.length === 0) {
      return true;
    }
    // Found "right" mimetype in the list of allowed mimetypes - download it
    return mimetypes.some((type) => mimetype.startsWith(type));
  }

  private async processMediaInternal<Message>(
    processor: IMediaEngineProcessor<Message>,
    message: Message,
  ): Promise<WAMedia | null> {
    const messageId = processor.getMessageId(message);
    const chatId = processor.getChatId(message);
    let mimetype = processor.getMimetype(message);
    let filename = processor.getFilename(message);

    const mediaData: MediaData = {
      session: this.sessionName,
      message: {
        id: messageId,
        chatId: chatId,
      },
      file: {
        extension: ext(mimetype),
        filename: filename,
        mimetype: mimetype,
      },
    };

    const exists = await this.withRetry('Checking media', () =>
      this.exists(mediaData),
    );

    if (!exists) {
      this.log.info(`The message ${messageId} has media, downloading it...`);
      // Fetching media
      const content = await this.withRetry('Fetching media', () =>
        this.fetchMedia(message, processor),
      );
      if (content.mimetype) {
        mimetype = content.mimetype;
      }
      if (content.filename) {
        filename = content.filename;
      }
      mediaData.file = {
        extension: ext(mimetype),
        filename: filename,
        mimetype: mimetype,
      };
      // Saving media
      await this.withRetry('Saving media', () =>
        this.saveMedia(content.buffer, mediaData),
      );
      this.log.info(`The media from '${messageId}' has been saved.`);
    }

    const data = await this.withRetry('Getting media URL', () =>
      this.getStorageData(mediaData),
    );
    return { ...data, mimetype: mimetype, filename: filename };
  }

  async processMedia<Message>(
    processor: IMediaEngineProcessor<Message>,
    message: Message,
    options: MediaDownloadOptions,
  ): Promise<WAMedia | null> {
    let messageId: string;
    try {
      messageId = processor.getMessageId(message);
      if (!processor.hasMedia(message)) {
        return null;
      }
    } catch (error) {
      this.log.error(
        error,
        `Error checking if message has media for message '${messageId}'`,
      );
      return null;
    }

    let media: WAMedia = {
      url: null,
      filename: null,
      mimetype: null,
    };
    try {
      media.filename = processor.getFilename(message);
      media.mimetype = processor.getMimetype(message);
      if (!options.download) {
        return media;
      }
      if (!this.shouldProcessMimetype(options.mimetypes, media.mimetype)) {
        this.log.info(
          `The message '${messageId}' has '${media.mimetype}' mimetype media, skip it.`,
        );
        return media;
      }
      const data = await this.processMediaInternal(processor, message);
      media = { ...media, ...data };
    } catch (err) {
      this.log.error(err, `Error processing media for message '${messageId}'`);
      media.error = err;
      // @ts-ignore
      media.error.details = `${err.stack}`;
    }
    return media;
  }

  private async fetchMedia(
    message: any,
    processor: IMediaEngineProcessor<any>,
  ): Promise<MediaContent> {
    const messageId = processor.getMessageId(message);
    this.log.debug(`Fetching media from WhatsApp message '${messageId}'...`);
    const content = await processor.getMediaContent(message);
    if (!content?.buffer) {
      throw new Error(
        `Message '${messageId}' has no media, but it has media flag in the engine`,
      );
    }
    return content;
  }

  private async saveMedia(
    buffer: Buffer,
    mediaData: MediaData,
  ): Promise<boolean> {
    this.log.debug(
      `Saving media from WhatsApp the message '${mediaData.message.id}'...`,
    );
    const result = await this.storage.save(buffer, mediaData);
    this.log.debug(`The media from '${mediaData.message.id}' has been saved.`);
    return result;
  }

  private async getStorageData(
    mediaData: MediaData,
  ): Promise<MediaStorageData> {
    return await this.storage.getStorageData(mediaData);
  }

  private async exists(mediaData: MediaData): Promise<boolean> {
    this.log.trace(
      `Checking if media exists for message '${mediaData.message.id}'...`,
    );
    const result = await this.storage.exists(mediaData);
    this.log.trace(
      `Media for message '${mediaData.message.id}' exists: ${result}`,
    );
    return result;
  }

  private async withRetry(name: string, fn: CallableFunction) {
    const retryOptions = this.RETRY_OPTIONS;
    try {
      return await promiseRetry((retry: CallableFunction, number: number) => {
        return fn().catch((err: any) => {
          // Some failures are definitive (e.g. media not downloadable): retrying
          // won't help and may block, so abort the retry loop immediately.
          if (err?.nonRetriable) {
            throw err;
          }
          return retry(err);
        });
      }, retryOptions);
    } catch (error) {
      this.log.error(
        error,
        `Failed to execute '${name}', tried '${retryOptions.retries}' times`,
      );
      throw error;
    }
  }

  close() {
    this.storage.close().catch((err) => {
      this.log.error(`Failed to close media storage: ${err}`);
    });
  }
}
