import { AppModule } from '@waha/apps/app_sdk/apps/definition';
import { AppName } from '@waha/apps/app_sdk/apps/apps';
import { ArgentinePhoneNumbersAppService } from './services/ArgentinePhoneNumbersAppService';

const ArgentinePhoneNumbersAppModule: AppModule = {
  name: AppName.argentinePhoneNumbers,
  openapi: {
    title: 'Argentine Phone Numbers',
    description:
      'Resolve Argentine phone numbers with or without the mobile prefix 9.',
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
    providers: [ArgentinePhoneNumbersAppService],
  },
  Service: ArgentinePhoneNumbersAppService,
};
export default ArgentinePhoneNumbersAppModule;
