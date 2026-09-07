import { AppApiTag } from '@waha/apps/app_sdk/apps/openapi';
import { AppRuntimeConfig } from '@waha/apps/app_sdk/apps/AppRuntime';
import { GetApps } from '@waha/apps/app_sdk/apps/registry';

export interface ApiTag {
  name: string;
  description: string;
}

/**
 * OpenAPI tags for all registered apps - one "🧩 Apps: {Title}" tag per app,
 * so app-specific endpoints get their own section in Swagger.
 * Includes disabled apps too (only their openapi metadata is used) - some app
 * controllers are served even when apps are disabled ('disabledControllers');
 * their description is prefixed with "DISABLED" to make the state visible.
 */
export function GetAppsApiTags(): ApiTag[] {
  return GetApps().map((app) => {
    const enabled = AppRuntimeConfig.HasApp(app.name);
    const description = enabled
      ? app.openapi.description
      : `DISABLED - ${app.openapi.description}`;
    return {
      name: AppApiTag(app.openapi),
      description: description,
    };
  });
}
