import { DOCS_URL } from '@waha/core/exceptions';
import { IMediaStorage } from '@waha/core/media/IMediaStorage';

export class MediaNoopStorage implements IMediaStorage {
  async save(
    messageId: string,
    mimetype: string,
    buffer: Buffer,
  ): Promise<string> {
    return Promise.resolve(
      `Media attachment's available only in WAHA Plus version. ${DOCS_URL}`,
    );
  }
}
