import {
  CreateBucketCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  getMediaFileMessageId,
  getMetadata,
  IMediaStorage,
  MediaData,
  MediaStorageData,
} from '@waha/core/media/IMediaStorage';
import { MediaS3UrlResolver } from '@waha/core/media/s3/MediaS3UrlResolver';
import { mapWithConcurrency } from '@waha/utils/concurrency';
import * as lodash from 'lodash';
import { Logger } from 'pino';

// Up to this many messages, the media are listed by their own prefix
const S3_LIST_BY_ID_MAX = 20;
// S3 requests sent at once when listing the media of the messages
const S3_CONCURRENCY = 5;
// DeleteObjects takes up to 1000 keys
const S3_DELETE_BATCH = 1000;

// "{session}/{messageId}.{extension}" right under the session, for one of the ids
function isMessageKey(prefix: string, key: string, ids: Set<string>): boolean {
  const name = key.slice(prefix.length);
  return !name.includes('/') && ids.has(getMediaFileMessageId(name));
}

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

  /**
   * Removes "{session}/{messageId}.{extension}", listed by id for a few messages,
   * by session prefix for more. Needs s3:ListBucket and s3:DeleteObject.
   */
  async removeMessagesMedia(
    session: string,
    messageIds: string[],
  ): Promise<number> {
    if (messageIds.length === 0) {
      return 0;
    }
    let keys: string[];
    if (messageIds.length <= S3_LIST_BY_ID_MAX) {
      keys = await this.findKeysById(session, messageIds);
    } else {
      keys = await this.findKeysInSession(session, messageIds);
    }
    return await this.deleteKeys(keys);
  }

  private async findKeysById(
    session: string,
    messageIds: string[],
  ): Promise<string[]> {
    const prefix = `${session}/`;
    const found = await mapWithConcurrency(
      messageIds,
      S3_CONCURRENCY,
      async (id) => {
        const keys = await this.listKeys(`${prefix}${id}.`);
        return keys.filter((key) => isMessageKey(prefix, key, new Set([id])));
      },
    );
    return found.flat();
  }

  private async findKeysInSession(
    session: string,
    messageIds: string[],
  ): Promise<string[]> {
    const prefix = `${session}/`;
    const ids = new Set(messageIds);
    const keys = await this.listKeys(prefix);
    return keys.filter((key) => isMessageKey(prefix, key, ids));
  }

  private async listKeys(prefix: string): Promise<string[]> {
    const keys: string[] = [];
    let token: string | undefined = undefined;
    do {
      const page = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: token,
        }),
      );
      for (const object of page.Contents ?? []) {
        keys.push(object.Key);
      }
      token = page.IsTruncated ? page.NextContinuationToken : undefined;
    } while (token);
    return keys;
  }

  /**
   * Deletes the objects S3_DELETE_BATCH at a time, throws if one was not deleted
   */
  private async deleteKeys(keys: string[]): Promise<number> {
    let removed = 0;
    for (const batch of lodash.chunk(keys, S3_DELETE_BATCH)) {
      const response = await this.client.send(
        new DeleteObjectsCommand({
          Bucket: this.bucket,
          Delete: {
            Objects: batch.map((key) => ({ Key: key })),
            Quiet: true,
          },
        }),
      );
      const errors = response.Errors ?? [];
      removed += batch.length - errors.length;
      if (errors.length > 0) {
        const error = errors[0];
        throw new Error(
          `Failed to delete ${errors.length} media object(s), ${removed} deleted - '${error.Key}': ${error.Code} ${error.Message}`,
        );
      }
    }
    return removed;
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
