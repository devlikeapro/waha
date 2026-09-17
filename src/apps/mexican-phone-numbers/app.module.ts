import { AppModule } from '@waha/apps/app_sdk/apps/definition';
import { AppName } from '@waha/apps/app_sdk/apps/apps';
import { MexicanPhoneNumbersController } from '@waha/apps/mexican-phone-numbers/controller';
import { MexicanPhoneNumbersAppService } from '@waha/apps/mexican-phone-numbers/services/MexicanPhoneNumbersAppService';

const MexicanPhoneNumbersAppModule: AppModule = {
  name: AppName.mexicanPhoneNumbers,
  openapi: {
    title: 'Phone Numbers: Mexico',
    description:
      'Resolve Mexican phone numbers (with and without the 1 after the country code)',
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
    controllers: [MexicanPhoneNumbersController],
    providers: [MexicanPhoneNumbersAppService],
  },
  Service: MexicanPhoneNumbersAppService,
};

export default MexicanPhoneNumbersAppModule;
