import { Module } from '@nestjs/common';
import { AppBootstrapService } from '@waha/plugins/AppBootstrapService';

@Module({
  providers: [AppBootstrapService],
  exports: [AppBootstrapService],
})
export class AppBootstrapModule {}
