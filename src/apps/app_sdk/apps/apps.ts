import { Type } from '@nestjs/common';
import { BrazilianPhoneNumbersAppConfig } from '@waha/apps/brazilian-phone-numbers/dto/config.dto';
import { CallsAppConfig } from '@waha/apps/calls/dto/config.dto';
import { ChatWootAppConfig } from '@waha/apps/chatwoot/dto/config.dto';
import { McpAppConfig } from '@waha/apps/mcp/dto/config.dto';

export enum AppName {
  chatwoot = 'chatwoot',
  calls = 'calls',
  mcp = 'mcp',
  brazilianPhoneNumbers = 'brazilian-phone-numbers',
}

/**
 * DTO classes used to transform and validate App.config, by app name.
 * Kept separate from the registry so DTOs (imported by core structures) can resolve config classes
 * without pulling in every app module (controllers, services, queues) - that creates require cycles.
 */
export const AppConfigClasses: Record<AppName, Type<any>> = {
  [AppName.brazilianPhoneNumbers]: BrazilianPhoneNumbersAppConfig,
  [AppName.calls]: CallsAppConfig,
  [AppName.chatwoot]: ChatWootAppConfig,
  [AppName.mcp]: McpAppConfig,
};

export function GetAppConfigClass(name: AppName): Type<any> {
  return AppConfigClasses[name] ?? Object;
}
