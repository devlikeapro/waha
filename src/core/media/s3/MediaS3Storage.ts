import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  getMetadata,
  IMediaStorage,
  MediaData,
  MediaStorageData,
} from '@waha/core/media/IMediaStorage';
import { MediaS3UrlResolver } from '@waha/core/media/s3/MediaS3UrlResolver';
import * as lodash from 'lodash';
import { Logger } from 'pino';

export class MediaS3Storage implements IMediaStorage {
  ASCII_KEYS = new Set([
    'waha-session',
    'waha-chat-id',
    'waha-message-id',
    // 'waha-media-filename', // encode it using percent-encoding (URL encoding)
    'waha-created-at',
  ]);

  constructor(
    private client: S3Client,
    private mediaS3UrlResolver: MediaS3UrlResolver,
    private bucket: string,
    protected log: Logger,
  ) {}

  async init() {
    await this.createBucketIfNotExist(this.bucket);
  }

  private getKey(data: MediaData) {
    return `${data.session}/${data.message.id}.${data.file.extension}`;
  }

  async save(buffer: Buffer, data: MediaData): Promise<boolean> {
    const key = this.getKey(data);
    let metadata = getMetadata(data);
    metadata = encode(metadata, this.ASCII_KEYS);
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: data.file.mimetype,
      Metadata: metadata,
    });
    await this.client.send(command);
    return true;
  }

  async exists(data: MediaData): Promise<boolean> {
    const key = this.getKey(data);
    try {
      await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return true;
    } catch (e) {
      if (e.name === 'NotFound') {
        return false;
      }
      throw e;
    }
  }

  async getStorageData(data: MediaData): Promise<MediaStorageData> {
    const key = this.getKey(data);
    const url = await this.mediaS3UrlResolver.resolve({
      bucket: this.bucket,
      key: key,
    });
    return {
      url: url,
      s3: {
        Bucket: this.bucket,
        Key: key,
      },
    };
  }

  async purge(): Promise<void> {
    this.log.debug('Purging S3 bucket is not supported');
  }

  private async createBucketIfNotExist(bucket: string) {
    if (!(await this.bucketExists(bucket))) {
      await this.createBucket(bucket);
    }
  }

  private createBucket(bucket: string) {
    const command = new CreateBucketCommand({ Bucket: bucket });
    return this.client.send(command);
  }

  private async bucketExists(bucket: string): Promise<boolean> {
    const command = new HeadBucketCommand({ Bucket: bucket });
    try {
      await this.client.send(command);
      return true;
    } catch (e) {
      if (e.name === 'NotFound') {
        return false;
      }
      throw e;
    }
  }

  async close() {
    return;
  }
}

/**
 * Encode metadata values using percent-encoding (URL encoding) OR ascii
 * We keep some values as ASCII for backward compatability
 */
function encode(
  metadata: Record<string, any>,
  ascii: Set<string>,
): Record<string, string> {
  metadata = lodash.cloneDeep(metadata);
  // Convert all metadata values to string because
  // underlying S3 SDK will call .trim() on them
  for (const key in metadata) {
    const value = String(metadata[key]);
    if (ascii.has(key)) {
      // only ascii allowed in value for those values
      metadata[key] = value.replace(/[^\x20-\x7E]/g, '');
      continue;
    }
    metadata[key] = encodeURIComponent(value);
  }
  return metadata;
}
