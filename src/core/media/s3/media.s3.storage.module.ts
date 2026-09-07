import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { WhatsappConfigService } from '@waha/config.service';
import { MediaStorageFactory } from '@waha/core/media/MediaStorageFactory';
import { S3ProxyController } from '@waha/core/media/s3/api/s3.proxy.controller';
import { MediaS3StorageConfig } from '@waha/core/media/s3/MediaS3StorageConfig';
import { MediaS3StorageFactory } from '@waha/core/media/s3/MediaS3StorageFactory';
import {
  MediaS3UrlResolver,
  S3ProxyUrl,
  S3Url,
} from '@waha/core/media/s3/MediaS3UrlResolver';
import { HttpPathsModule } from '@waha/plugins/http.paths.module';
import { HttpPathsService } from '@waha/plugins/HttpPathsService';

@Module({
  imports: [HttpPathsModule],
  providers: [
    {
      provide: S3Client,
      inject: [MediaS3StorageConfig],
      useFactory: (s3config: MediaS3StorageConfig) => {
        return new S3Client(s3config.s3ClientConfig);
      },
    },
    {
      provide: MediaStorageFactory,
      useClass: MediaS3StorageFactory,
    },
    WhatsappConfigService,
    MediaS3StorageConfig,
    {
      provide: MediaS3UrlResolver,
      inject: [MediaS3StorageConfig, WhatsappConfigService, S3Client],
      useFactory: (
        s3config: MediaS3StorageConfig,
        config: WhatsappConfigService,
        s3client: S3Client,
      ) => {
        if (s3config.s3ProxyFiles) {
          return new S3ProxyUrl(config);
        }
        return new S3Url(s3client);
      },
    },
  ],
  exports: [MediaStorageFactory],
  controllers: [S3ProxyController],
})
export class MediaS3StorageModule {
  constructor(httpPaths: HttpPathsService) {
    httpPaths.register({
      prefix: '/api/s3/',
      include: { accessLog: false, metrics: false },
    });
  }
}
