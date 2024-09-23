import { IMediaEngineProcessor } from '@waha/core/media/IMediaEngineProcessor';
import { IMediaManager } from '@waha/core/media/IMediaManager';
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

export class MediaManager implements IMediaManager {
  // https://github.com/IndigoUnited/node-promise-retry
  RETRY_OPTIONS = {
    retries: 5,
    minTimeout: 100,
    maxTimeout: 500,
  };

  constructor(
    private storage: IMediaStorage,
    private mimetypes: string[],
    protected log: Logger,
  ) {
    // Log mimetypes
    if (this.mimetypes && this.mimetypes.length > 0) {
      const mimetypes = this.mimetypes.join(',');
      const msg = `Only '${mimetypes}' mimetypes will be downloaded for the session`;
      this.log.info(msg);
    }
  }

  /**
   *  Check that we need to download files with the mimetype
   */
  private shouldProcessMimetype(mimetype: string) {
    // No specific mimetypes provided - always download
    if (!this.mimetypes || this.mimetypes.length === 0) {
      return true;
    }
    // Found "right" mimetype in the list of allowed mimetypes - download it
    return this.mimetypes.some((type) => mimetype.startsWith(type));
  }

  private async processMediaInternal<Message>(
    processor: IMediaEngineProcessor<Message>,
    message: Message,
    session: string,
  ): Promise<WAMedia | null> {
    const messageId = processor.getMessageId(message);
    const mimetype = processor.getMimetype(message);
    const filename = processor.getFilename(message);
    if (!this.shouldProcessMimetype(mimetype)) {
      this.log.info(
        `The message '${messageId}' has '${mimetype}' mimetype media, skip it.`,
      );
      return null;
    }

    const extension = mime.extension(mimetype);
    const mediaData: MediaData = {
      session: session,
      message: {
        id: messageId,
      },
      file: {
        extension: extension,
        filename: filename,
      },
    };

    const exists = await this.withRetry('Checking media', () =>
      this.exists(mediaData),
    );

    if (!exists) {
      this.log.info(`The message ${messageId} has media, downloading it...`);
      // Fetching media
      const buffer = await this.withRetry('Fetching media', () =>
        this.fetchMedia(message, processor),
      );
      // Saving media
      await this.withRetry('Saving media', () =>
        this.saveMedia(buffer, mediaData),
      );
      this.log.info(`The media from '${messageId}' has been saved.`);
    }

    const data = await this.withRetry('Getting media URL', () =>
      this.getStorageData(mediaData),
    );
    return data;
  }

  async processMedia<Message>(
    processor: IMediaEngineProcessor<Message>,
    message: Message,
    session: string,
  ): Promise<Message> {
    let messageId: string;
    try {
      messageId = processor.getMessageId(message);
      if (!processor.hasMedia(message)) {
        return message;
      }
    } catch (error) {
      this.log.error(
        error,
        `Error checking if message has media for message '${messageId}'`,
      );
      return message;
    }

    let media: WAMedia = {
      url: null,
      filename: null,
      mimetype: null,
    };
    try {
      media.filename = processor.getFilename(message);
      media.mimetype = processor.getMimetype(message);
      media.filename = processor.getFilename(message);
      const data = await this.processMediaInternal(processor, message, session);
      media = { ...media, ...data };
    } catch (err) {
      this.log.error(err, `Error processing media for message '${messageId}'`);
      media.error = err;
      // @ts-ignore
      media.error.details = `${err.stack}`;
    }
    // @ts-ignore
    message.media = media;
    return message;
  }

  private async fetchMedia(
    message: any,
    processor: IMediaEngineProcessor<any>,
  ): Promise<Buffer> {
    const messageId = processor.getMessageId(message);
    this.log.debug(`Fetching media from WhatsApp message '${messageId}'...`);
    const buffer = await processor.getMediaBuffer(message);
    if (!buffer) {
      throw new Error(
        `Message '${messageId}' has no media, but it has media flag in the engine`,
      );
    }
    return buffer;
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
        return fn().catch(retry);
      }, retryOptions);
    } catch (error) {
      this.log.error(
        error,
        `Failed to execute '${name}', tried '${retryOptions.retries}' times`,
      );
      throw error;
    }
  }
}
