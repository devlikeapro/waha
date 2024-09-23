import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { WhatsappConfigService } from '@waha/config.service';
import { MediaLocalStorageConfig } from '@waha/core/media/local/MediaLocalStorageConfig';
import { MediaLocalStorageFactory } from '@waha/core/media/local/MediaLocalStorageFactory';
import { MediaStorageFactory } from '@waha/core/media/MediaStorageFactory';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      imports: [],
      extraProviders: [MediaLocalStorageConfig, WhatsappConfigService],
      inject: [MediaLocalStorageConfig],
      useFactory: (config: MediaLocalStorageConfig) => {
        return [
          {
            rootPath: config.filesFolder,
            serveRoot: config.filesUri,
          },
        ];
      },
    }),
  ],
  providers: [
    {
      provide: MediaStorageFactory,
      useClass: MediaLocalStorageFactory,
    },
    WhatsappConfigService,
    MediaLocalStorageConfig,
  ],
  exports: [MediaStorageFactory],
})
export class MediaLocalStorageModule {}
