import { S3MediaData } from '@waha/structures/media.s3.dto';

/**
 * Handles saving data to the physical storage
 */
interface Message {
  // false_111111111@c.us_AAAAAAAAAAAAAA
  id: string;

  // 1111111@c.us
  chatId: string;
}

interface File {
  extension: string;
  filename?: string;
  mimetype?: string;
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

  /**
   * Removes the stored media of the session's messages, whatever its extension.
   * Returns how many files were removed.
   */
  abstract removeMessagesMedia(
    session: string,
    messageIds: string[],
  ): Promise<number>;

  abstract purge(): Promise<void>;

  abstract close(): Promise<void>;
}

export function getMetadata(data: MediaData): any {
  const now = new Date();
  return {
    'waha-session': data.session,
    'waha-chat-id': data.message.chatId,
    'waha-message-id': data.message.id,
    'waha-media-filename': data.file.filename,
    'waha-created-at': now.getTime(),
  };
}

/**
 * Returns the message id of a stored media file name,
 * "{messageId}.{extension}", or null when the name has no extension.
 */
export function getMediaFileMessageId(filename: string): string | null {
  const dot = filename.lastIndexOf('.');
  if (dot <= 0 || dot === filename.length - 1) {
    return null;
  }
  return filename.slice(0, dot);
}

export { IMediaStorage };
