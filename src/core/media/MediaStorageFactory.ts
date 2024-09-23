import { IMediaStorage } from '@waha/core/media/IMediaStorage';
import { Logger } from 'pino';

export abstract class MediaStorageFactory {
  abstract build(logger: Logger): IMediaStorage;
}
