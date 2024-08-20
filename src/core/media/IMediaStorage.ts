/**
 * Handles saving data to the physical storage
 */
interface Message {
  // false_111111111@c.us_AAAAAAAAAAAAAA
  id: string;
}

interface File {
  extension: string;
}

export interface MediaData {
  message: Message;
  file: File;
}

abstract class IMediaStorage {
  abstract save(buffer: Buffer, data: MediaData): Promise<boolean>;

  abstract exists(data: MediaData): Promise<boolean>;

  abstract getUrl(data: MediaData): Promise<string>;

  abstract purge(): Promise<void>;
}

export { IMediaStorage };
