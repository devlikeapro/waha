import { Injectable } from '@nestjs/common';
import { UniqueAppResolver } from '@waha/apps/app_sdk/services/UniqueAppResolver';
import { BrazilianPhoneNumbersAppConfig } from '@waha/apps/brazilian-phone-numbers/dto';
import { BrazilianPhoneNumberRule } from '@waha/apps/brazilian-phone-numbers/rules/BrazilianPhoneNumberRule';
import { BrazilianPhoneNumbersCacheRepository } from '@waha/apps/brazilian-phone-numbers/storage/BrazilianPhoneNumbersCacheRepository';
import { PhoneNumberRule } from '@waha/apps/phone-numbers/rules/PhoneNumberRule';
import { PhoneNumbersAppServiceBase } from '@waha/apps/phone-numbers/services/PhoneNumbersAppServiceBase';

@Injectable()
export class BrazilianPhoneNumbersAppService extends PhoneNumbersAppServiceBase<BrazilianPhoneNumbersAppConfig> {
  protected readonly Repository = BrazilianPhoneNumbersCacheRepository;

  constructor(resolver: UniqueAppResolver) {
    super(resolver);
  }

  protected rules(config: BrazilianPhoneNumbersAppConfig): PhoneNumberRule[] {
    void config;
    return [new BrazilianPhoneNumberRule()];
  }
}
