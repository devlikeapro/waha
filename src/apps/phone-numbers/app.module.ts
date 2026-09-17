import { AppModule } from '@waha/apps/app_sdk/apps/definition';
import { AppName } from '@waha/apps/app_sdk/apps/apps';
import { PhoneNumbersController } from '@waha/apps/phone-numbers/api/phone-numbers.controller';
import { PhoneNumbersAppService } from '@waha/apps/phone-numbers/services/PhoneNumbersAppService';

const PhoneNumbersAppModule: AppModule = {
  name: AppName.phoneNumbers,
  openapi: {
    title: 'Phone Numbers',
    description:
      'Resolve phone numbers matching the configured rules to the chat id WhatsApp knows before sending',
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
    controllers: [PhoneNumbersController],
    providers: [PhoneNumbersAppService],
  },
  Service: PhoneNumbersAppService,
};

export default PhoneNumbersAppModule;
