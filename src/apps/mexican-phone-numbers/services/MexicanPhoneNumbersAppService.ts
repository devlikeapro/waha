import { Injectable } from '@nestjs/common';
import { UniqueAppResolver } from '@waha/apps/app_sdk/services/UniqueAppResolver';
import { MexicanPhoneNumbersAppConfig } from '@waha/apps/mexican-phone-numbers/dto';
import { MexicanPhoneNumberRules } from '@waha/apps/mexican-phone-numbers/rules/MexicanPhoneNumberRules';
import { MexicanPhoneNumbersCacheRepository } from '@waha/apps/mexican-phone-numbers/storage/MexicanPhoneNumbersCacheRepository';
import { PhoneNumberRule } from '@waha/apps/phone-numbers/rules/PhoneNumberRule';
import { PhoneNumbersAppServiceBase } from '@waha/apps/phone-numbers/services/PhoneNumbersAppServiceBase';

@Injectable()
export class MexicanPhoneNumbersAppService extends PhoneNumbersAppServiceBase<MexicanPhoneNumbersAppConfig> {
  protected readonly Repository = MexicanPhoneNumbersCacheRepository;

  constructor(resolver: UniqueAppResolver) {
    super(resolver);
  }

  protected rules(config: MexicanPhoneNumbersAppConfig): PhoneNumberRule[] {
    void config;
    return MexicanPhoneNumberRules();
  }
}
