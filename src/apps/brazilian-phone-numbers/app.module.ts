import { AppModule } from '@waha/apps/app_sdk/apps/definition';
import { AppName } from '@waha/apps/app_sdk/apps/apps';
import { BrazilianPhoneNumbersController } from '@waha/apps/brazilian-phone-numbers/api/brazilian-phone-numbers.controller';
import { BrazilianPhoneNumbersAppService } from '@waha/apps/brazilian-phone-numbers/services/BrazilianPhoneNumbersAppService';

const BrazilianPhoneNumbersAppModule: AppModule = {
  name: AppName.brazilianPhoneNumbers,
  openapi: {
    title: 'Brazilian Phone Numbers',
    description: 'Resolve Brazilian phone numbers (with and without 9 digit)',
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
    controllers: [BrazilianPhoneNumbersController],
    providers: [BrazilianPhoneNumbersAppService],
  },
  Service: BrazilianPhoneNumbersAppService,
};

export default BrazilianPhoneNumbersAppModule;
