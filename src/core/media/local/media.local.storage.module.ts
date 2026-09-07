import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { WhatsappConfigService } from '@waha/config.service';
import { MediaLocalStorageConfig } from '@waha/core/media/local/MediaLocalStorageConfig';
import { MediaLocalStorageFactory } from '@waha/core/media/local/MediaLocalStorageFactory';
import { MediaStorageFactory } from '@waha/core/media/MediaStorageFactory';
import { HttpPathsModule } from '@waha/plugins/http.paths.module';
import { HttpPathsService } from '@waha/plugins/HttpPathsService';

@Module({
  imports: [
    HttpPathsModule,
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
export class MediaLocalStorageModule {
  constructor(config: MediaLocalStorageConfig, httpPaths: HttpPathsService) {
    httpPaths.register({
      prefix: config.filesUri + '/',
      include: { accessLog: false, metrics: false },
    });
  }
}
