import { Injectable } from '@nestjs/common';
import { WhatsappConfigService } from '@waha/config.service';
import { IMediaStorage } from '@waha/core/media/IMediaStorage';
import { MediaStorageFactory } from '@waha/core/media/MediaStorageFactory';
import { MediaS3Storage } from '@waha/core/media/s3/MediaS3Storage';
import { MediaS3StorageConfig } from '@waha/core/media/s3/MediaS3StorageConfig';
import { Logger } from 'pino';

@Injectable()
export class MediaS3StorageFactory extends MediaStorageFactory {
    constructor(
        private config: MediaS3StorageConfig,
        private whatsappConfig: WhatsappConfigService,
    ) {
        super();
    }

    async build(name: string, logger: Logger): Promise<IMediaStorage> {
        return new MediaS3Storage(logger, this.config, this.whatsappConfig.baseUrl);
    }
}
