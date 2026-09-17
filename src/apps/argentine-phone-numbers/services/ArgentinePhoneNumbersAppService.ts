import { Injectable } from '@nestjs/common';
import { UniqueAppResolver } from '@waha/apps/app_sdk/services/UniqueAppResolver';
import { ArgentinePhoneNumbersAppConfig } from '@waha/apps/argentine-phone-numbers/dto';
import { ArgentinePhoneNumberRules } from '@waha/apps/argentine-phone-numbers/rules/ArgentinePhoneNumberRules';
import { ArgentinePhoneNumbersCacheRepository } from '@waha/apps/argentine-phone-numbers/storage/ArgentinePhoneNumbersCacheRepository';
import { PhoneNumberRule } from '@waha/apps/phone-numbers/rules/PhoneNumberRule';
import { PhoneNumbersAppServiceBase } from '@waha/apps/phone-numbers/services/PhoneNumbersAppServiceBase';

@Injectable()
export class ArgentinePhoneNumbersAppService extends PhoneNumbersAppServiceBase<ArgentinePhoneNumbersAppConfig> {
  protected readonly Repository = ArgentinePhoneNumbersCacheRepository;

  constructor(resolver: UniqueAppResolver) {
    super(resolver);
  }

  protected rules(config: ArgentinePhoneNumbersAppConfig): PhoneNumberRule[] {
    void config;
    return ArgentinePhoneNumberRules();
  }
}
