import { Type } from '@nestjs/common';
import { AppName } from '@waha/apps/app_sdk/apps/apps';
import { AppOpenAPI } from '@waha/apps/app_sdk/apps/openapi';
import { GetApp } from '@waha/apps/app_sdk/apps/registry';
import { IAppService } from '@waha/apps/app_sdk/services/IAppService';

export interface AppDefinition {
  // If app requires WAHA_API_KEY_PLAIN to work
  plainkey: boolean;
  // If app requires queue to work
  queue: boolean;
  // If app has any migrations
  migrations: boolean;
  // If adding, updating, or removing this app requires a session restart
  restartOnChange: boolean;
  // If only one instance of this app is allowed per session
  unique: boolean;
}

// NestJS module parts, included when the app is enabled in runtime configuration
export interface AppNestJS {
  imports: any[];
  controllers: any[];
  providers: any[];
}

/**
 * Contract for the default export of 'src/apps/<name>/app.module.ts'.
 * Each app self-describes with this and gets listed in the registry ('apps/registry.ts').
 */
export interface AppModule {
  // App name
  name: AppName;
  // OpenAPI metadata (tag title, description) from 'src/apps/<name>/openapi.ts'
  openapi: AppOpenAPI;
  // Static app metadata (requirements, behavior flags)
  definition: AppDefinition;
  // NestJS module parts
  nestjs: AppNestJS;
  // Service implementing app lifecycle hooks; must also be listed in 'nestjs.providers'
  Service: Type<IAppService>;
}

export function isUniqueApp(name: AppName): boolean {
  return GetApp(name)?.definition.unique === true;
}

// Returns the first unique AppName that appears more than once in the list, or null
export function findDuplicateUniqueApp(
  apps: Array<{ app: AppName }>,
): AppName | null {
  const seen = new Set<AppName>();
  for (const app of apps) {
    if (!isUniqueApp(app.app)) {
      continue;
    }
    if (seen.has(app.app)) {
      return app.app;
    }
    seen.add(app.app);
  }
  return null;
}
