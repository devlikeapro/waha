import { Module } from '@nestjs/common';
import { WhatsappConfigService } from '@waha/config.service';
import { MediaStorageFactory } from '@waha/core/media/MediaStorageFactory';
import { MediaS3StorageConfig } from './MediaS3StorageConfig';
import { MediaS3StorageFactory } from './MediaS3StorageFactory';
import { MediaS3Controller } from './media.s3.controller';

@Module({
    controllers: [MediaS3Controller],
    providers: [
        {
            provide: MediaStorageFactory,
            useClass: MediaS3StorageFactory,
        },
        WhatsappConfigService,
        MediaS3StorageConfig,
    ],
    exports: [MediaStorageFactory],
})
export class MediaS3StorageModule { }
