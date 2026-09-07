import { AppEnv } from '@waha/apps/app_sdk/env';
import { AppModule } from '@waha/apps/app_sdk/apps/definition';
import { GetApps } from '@waha/apps/app_sdk/apps/registry';

class AppRuntimeConfigC {
  private constructor(private apps: AppModule[] | null) {}

  static FromEnv(env: typeof AppEnv) {
    if (!env.enabled) {
      return new AppRuntimeConfigC(null);
    }
    let apps: AppModule[] = GetApps();
    // Include
    if (env.on && env.on.length > 0) {
      apps = apps.filter((app) => env.on!.includes(app.name));
    }
    // Exclude
    if (env.off && env.off.length > 0) {
      apps = apps.filter((app) => !env.off!.includes(app.name));
    }
    return new AppRuntimeConfigC(apps);
  }

  Enabled() {
    return this.apps !== null;
  }

  GetApps() {
    return this.apps || [];
  }

  GetAppsWithMigration() {
    return this.GetApps().filter((app) => app.definition.migrations);
  }

  GetAppsRequiringPlainKey() {
    return this.GetApps().filter((app) => app.definition.plainkey);
  }

  GetAppsRequiringQueue() {
    return this.GetApps().filter((app) => app.definition.queue);
  }

  HasApp(name: string) {
    return this.GetApps().some((app) => app.name === name);
  }

  HasAppsRequiringPlainKey() {
    return this.GetAppsRequiringPlainKey().length > 0;
  }

  HasAppsRequiringQueue() {
    return this.GetAppsRequiringQueue().length > 0;
  }
}

export const AppRuntimeConfig = AppRuntimeConfigC.FromEnv(AppEnv);
