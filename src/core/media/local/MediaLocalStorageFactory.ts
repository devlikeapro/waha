import { Injectable } from '@nestjs/common';
import { IMediaStorage } from '@waha/core/media/IMediaStorage';
import { MediaLocalStorage } from '@waha/core/media/local/MediaLocalStorage';
import { MediaLocalStorageConfig } from '@waha/core/media/local/MediaLocalStorageConfig';
import { MediaStorageFactory } from '@waha/core/media/MediaStorageFactory';
import { Logger } from 'pino';

@Injectable()
export class MediaLocalStorageFactory extends MediaStorageFactory {
  constructor(private config: MediaLocalStorageConfig) {
    super();
  }

  build(logger: Logger): IMediaStorage {
    return new MediaLocalStorage(
      logger,
      this.config.filesFolder,
      this.config.filesURL,
      this.config.filesLifetime,
    );
  }
}
