import { ArgentinePhoneNumbersAppConfig } from '@waha/apps/argentine-phone-numbers/dto';
import { Type } from '@nestjs/common';
import { BrazilianPhoneNumbersAppConfig } from '@waha/apps/brazilian-phone-numbers/dto';
import { CallsAppConfig } from '@waha/apps/calls/dto/config.dto';
import { ChatWootAppConfig } from '@waha/apps/chatwoot/dto/config.dto';
import { McpAppConfig } from '@waha/apps/mcp/dto/config.dto';
import { PhoneNumbersAppConfig } from '@waha/apps/phone-numbers/dto/config.dto';

export enum AppName {
  argentinePhoneNumbers = 'argentine-phone-numbers',
  brazilianPhoneNumbers = 'brazilian-phone-numbers',
  chatwoot = 'chatwoot',
  calls = 'calls',
  mcp = 'mcp',
  phoneNumbers = 'phone-numbers',
}

/**
 * DTO classes used to transform and validate App.config, by app name.
 * Kept separate from the registry so DTOs (imported by core structures) can resolve config classes
 * without pulling in every app module (controllers, services, queues) - that creates require cycles.
 */
export const AppConfigClasses: Record<AppName, Type<any>> = {
  [AppName.argentinePhoneNumbers]: ArgentinePhoneNumbersAppConfig,
  [AppName.brazilianPhoneNumbers]: BrazilianPhoneNumbersAppConfig,
  [AppName.phoneNumbers]: PhoneNumbersAppConfig,
  [AppName.calls]: CallsAppConfig,
  [AppName.chatwoot]: ChatWootAppConfig,
  [AppName.mcp]: McpAppConfig,
};

export function GetAppConfigClass(name: AppName): Type<any> {
  return AppConfigClasses[name] ?? Object;
}
