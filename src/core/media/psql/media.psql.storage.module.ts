import { Module } from '@nestjs/common';
import { WhatsappConfigService } from '@waha/config.service';
import { EngineConfigService } from '@waha/core/config/EngineConfigService';
import { MediaStorageFactory } from '@waha/core/media/MediaStorageFactory';
import { PsqlFilesController } from '@waha/core/media/psql/api/psql.files.controller';
import { HttpPathsModule } from '@waha/plugins/http.paths.module';
import { HttpPathsService } from '@waha/plugins/HttpPathsService';

import { MediaPsqlStorageConfig } from './MediaPsqlStorageConfig';
import { MediaPsqlStorageFactory } from './MediaPsqlStorageFactory';

@Module({
  imports: [HttpPathsModule],
  providers: [
    {
      provide: MediaStorageFactory,
      useExisting: MediaPsqlStorageFactory,
    },
    MediaPsqlStorageFactory,
    WhatsappConfigService,
    EngineConfigService,
    MediaPsqlStorageConfig,
  ],
  exports: [MediaStorageFactory],
  controllers: [PsqlFilesController],
})
export class MediaPsqlStorageModule {
  constructor(config: MediaPsqlStorageConfig, httpPaths: HttpPathsService) {
    httpPaths.register({
      prefix: config.filesUri + '/',
      include: { accessLog: false, metrics: false },
    });
  }
}
