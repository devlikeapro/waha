import { S3MediaData } from '@waha/structures/media.s3.dto';

/**
 * Handles saving data to the physical storage
 */
interface Message {
  // false_111111111@c.us_AAAAAAAAAAAAAA
  id: string;
}

interface File {
  extension: string;
  filename?: string;
}

export interface MediaData {
  session: string;
  message: Message;
  file: File;
}

/**
 * For stored media data
 */
export interface MediaStorageData {
  url: string;
  s3?: S3MediaData;
}

abstract class IMediaStorage {
  abstract init(): Promise<void>;

  abstract save(buffer: Buffer, data: MediaData): Promise<boolean>;

  abstract exists(data: MediaData): Promise<boolean>;

  abstract getStorageData(data: MediaData): Promise<MediaStorageData>;

  abstract purge(): Promise<void>;
}

export { IMediaStorage };
