import { App } from '@waha/apps/app_sdk/dto/app.dto';
import { BrazilianPhoneNumbersAppConfig } from '@waha/apps/brazilian-phone-numbers/dto/config.dto';
import { Type } from 'class-transformer';

export class BrazilianPhoneNumbersAppDto extends App<BrazilianPhoneNumbersAppConfig> {
  @Type(() => BrazilianPhoneNumbersAppConfig)
  config: BrazilianPhoneNumbersAppConfig;
}
