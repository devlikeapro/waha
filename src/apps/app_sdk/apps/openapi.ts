/**
 * OpenAPI metadata for an app, defined inline in the app's AppModule ('openapi' field).
 * The registry applies the "🧩 Apps: {Title}" tag to every controller in 'nestjs.controllers',
 * so app controllers do not declare @ApiTags themselves - a new app only touches its own folder.
 */
export interface AppOpenAPI {
  title: string;
  description: string;
}

// OpenAPI tag for app-specific endpoints - "🧩 Apps: {Title}"
export function AppApiTag(openapi: AppOpenAPI): string {
  return `🧩 Apps: ${openapi.title}`;
}
