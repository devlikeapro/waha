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
    metadata = await this.stringifyMetadata(metadata);
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

  async stringifyMetadata(metadata) {
    metadata = lodash.cloneDeep(metadata);
    // Convert all metadata values to string because
    // underlying S3 SDK will call .trim() on them
    for (const key in metadata) {
      const value = String(metadata[key]);
      // only ascii allowed in value for S3
      metadata[key] = value.replace(/[^\x20-\x7E]/g, '');
    }
    return metadata;
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
