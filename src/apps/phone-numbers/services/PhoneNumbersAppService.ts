import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { App } from '@waha/apps/app_sdk/dto/app.dto';
import { UniqueAppResolver } from '@waha/apps/app_sdk/services/UniqueAppResolver';
import {
  PhoneNumbersAppConfig,
  PhoneNumbersRuleConfig,
} from '@waha/apps/phone-numbers/dto/config.dto';
import { PhoneNumberRule } from '@waha/apps/phone-numbers/rules/PhoneNumberRule';
import { RegexpPhoneNumberRule } from '@waha/apps/phone-numbers/rules/RegexpPhoneNumberRule';
import { PhoneNumbersAppServiceBase } from '@waha/apps/phone-numbers/services/PhoneNumbersAppServiceBase';

export function RulesFromConfig(
  rules?: PhoneNumbersRuleConfig[],
): PhoneNumberRule[] {
  if (!rules || rules.length === 0) {
    return [new RegexpPhoneNumberRule('.*')];
  }
  return rules.map(
    (rule) => new RegexpPhoneNumberRule(rule.regexp, rule.replace ?? null),
  );
}

@Injectable()
export class PhoneNumbersAppService extends PhoneNumbersAppServiceBase<PhoneNumbersAppConfig> {
  constructor(resolver: UniqueAppResolver) {
    super(resolver);
  }

  validate(app: App<PhoneNumbersAppConfig>): void {
    for (const rule of app.config?.rules ?? []) {
      try {
        new RegExp(rule.regexp);
      } catch (error) {
        throw new UnprocessableEntityException(
          `Invalid rule regexp '${rule.regexp}': ${error}`,
        );
      }
    }
  }

  protected rules(config: PhoneNumbersAppConfig): PhoneNumberRule[] {
    return RulesFromConfig(config.rules);
  }
}
