import { ApiTags } from '@nestjs/swagger';
import { AppModule } from '@waha/apps/app_sdk/apps/definition';
import { AppApiTag } from '@waha/apps/app_sdk/apps/openapi';
import BrazilianPhoneNumbersAppModule from '@waha/apps/brazilian-phone-numbers/app.module';
import CallsAppModule from '@waha/apps/calls/app.module';
import ChatWootAppModule from '@waha/apps/chatwoot/app.module';
import McpAppModule from '@waha/apps/mcp/app.module';

/**
 * Registry of available apps.
 * Add new apps here - the rest of app_sdk works off this list.
 */
const APPS: AppModule[] = [
  BrazilianPhoneNumbersAppModule,
  CallsAppModule,
  ChatWootAppModule,
  McpAppModule,
];

// Tag every app controller with the app's OpenAPI tag ("🧩 Apps: {Title}") from AppModule.openapi,
// so controllers do not declare @ApiTags themselves (they cannot import their own app.module - require cycle).
for (const app of APPS) {
  for (const controller of app.nestjs.controllers) {
    ApiTags(AppApiTag(app.openapi))(controller);
  }
}

export function GetApps(): AppModule[] {
  return APPS;
}

export function GetApp(name: string): AppModule | undefined {
  return APPS.find((app) => app.name === name);
}
