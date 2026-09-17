import { AppModule } from '@waha/apps/app_sdk/apps/definition';
import { AppName } from '@waha/apps/app_sdk/apps/apps';
import { ArgentinePhoneNumbersController } from '@waha/apps/argentine-phone-numbers/controller';
import { ArgentinePhoneNumbersAppService } from '@waha/apps/argentine-phone-numbers/services/ArgentinePhoneNumbersAppService';

const argentinephonenumbersAppModule: AppModule = {
  name: AppName.argentinePhoneNumbers,
  openapi: {
    title: 'Argentine Phone Numbers',
    description:
      'Resolve Argentine phone numbers (with and without the mobile 9)',
  },
  definition: {
    plainkey: false,
    queue: false,
    migrations: true,
    restartOnChange: true,
    unique: true,
  },
  nestjs: {
    imports: [],
    controllers: [ArgentinePhoneNumbersController],
    providers: [ArgentinePhoneNumbersAppService],
  },
  Service: ArgentinePhoneNumbersAppService,
};

export default argentinephonenumbersAppModule;
