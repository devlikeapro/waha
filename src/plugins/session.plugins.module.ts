import { Module } from '@nestjs/common';
import { SessionPluginsService } from '@waha/plugins/SessionPluginsService';

@Module({
  providers: [SessionPluginsService],
  exports: [SessionPluginsService],
})
export class SessionPluginsModule {}
