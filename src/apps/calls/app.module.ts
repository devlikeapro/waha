import { AppModule } from '@waha/apps/app_sdk/apps/definition';
import { AppName } from '@waha/apps/app_sdk/apps/apps';
import { CallsAppService } from '@waha/apps/calls/services/CallsAppService';

const CallsAppModule: AppModule = {
  name: AppName.calls,
  openapi: {
    title: 'Calls',
    description: 'Handle incoming calls - reject, message back',
  },
  definition: {
    plainkey: false,
    queue: false,
    migrations: false,
    restartOnChange: true,
    unique: true,
  },
  nestjs: {
    imports: [],
    controllers: [],
    providers: [CallsAppService],
  },
  Service: CallsAppService,
};

export default CallsAppModule;
