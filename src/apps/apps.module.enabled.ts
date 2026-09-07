import { BullModule } from '@nestjs/bullmq';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RMutexModule } from '@waha/modules/rmutex';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullAuthMiddleware } from '@waha/apps/app_sdk/auth';
import { AppsController } from '@waha/apps/app_sdk/api/apps.controller';
import { AppsService } from '@waha/apps/app_sdk/services/IAppsService';
import { AppsEnabledService } from '@waha/apps/app_sdk/services/AppsEnabledService';
import { UniqueAppResolver } from '@waha/apps/app_sdk/services/UniqueAppResolver';
import { Auth } from '@waha/core/auth/config';
import { AppRuntimeConfig } from '@waha/apps/app_sdk/apps/AppRuntime';
import { GetApps } from '@waha/apps/app_sdk/apps/registry';
import { HttpPathsRegistration } from '@waha/plugins/http.paths.module';

const QUEUES_IMPORTS_REQUIRED = [
  HttpPathsRegistration(
    { prefix: '/jobs', include: { authBasic: false } },
    { prefix: '/jobs/', include: { authBasic: false, accessLog: false } },
  ),
  BullModule.forRoot({
    connection: {
      url: process.env.REDIS_URL || 'redis://:redis@localhost:6379',
      maxRetriesPerRequest: null,
    },
    prefix: `waha-${process.env.WAHA_WORKER_ID}`,
  }),
  RedisModule.forRoot({
    closeClient: true,
    config: {
      url: process.env.REDIS_URL || 'redis://:redis@localhost:6379',
      onClientCreated: async (client) => {
        try {
          await client.ping();
        } catch (err) {
          console.error('[Redis] Connection failed:', err);
          process.exit(1); // Stop the app if Redis is unavailable
        }
      },
    },
  }),
  RMutexModule,
  BullBoardModule.forRoot({
    route: '/jobs',
    adapter: ExpressAdapter,
    middleware: BullAuthMiddleware(),
    boardOptions: {
      uiConfig: {
        boardTitle: 'Jobs | WAHA',
        boardLogo: {
          path: '/dashboard/layout/images/logo-white.svg',
          width: 35,
          height: 35,
        },
        favIcon: {
          default: '/dashboard/favicon.ico',
          alternative: '/dashboard/favicon.ico',
        },
        miscLinks: [
          {
            text: '📊 Dashboard',
            url: '/dashboard',
          },
          {
            text: '📚 Swagger (OpenAPI)',
            url: '/',
          },
        ],
      },
    },
  }),
];
const QUEUES_IMPORTS = AppRuntimeConfig.HasAppsRequiringQueue()
  ? QUEUES_IMPORTS_REQUIRED
  : [];

// Apps enabled in the runtime configuration (WAHA_APPS_ON / WAHA_APPS_OFF)
const ENABLED_APPS = GetApps().filter((app) =>
  AppRuntimeConfig.HasApp(app.name),
);

export const AppsEnabled = {
  imports: [
    ...QUEUES_IMPORTS,
    ...ENABLED_APPS.flatMap((app) => app.nestjs.imports),
  ],
  controllers: [
    AppsController,
    ...ENABLED_APPS.flatMap((app) => app.nestjs.controllers),
  ],
  providers: [
    {
      provide: AppsService,
      useClass: AppsEnabledService,
    },
    UniqueAppResolver,
    ...ENABLED_APPS.flatMap((app) => app.nestjs.providers),
  ],
};

function checkApiKey() {
  const key = Auth.key.value;
  if (!key) {
    return;
  }
  const plain = Auth.keyplain.value;
  if (!plain) {
    throw Error(
      'WAHA_API_KEY set, please provide WAHA_API_KEY_PLAIN when WAHA_APPS_ENABLED',
    );
  }
}

if (AppRuntimeConfig.HasAppsRequiringPlainKey()) {
  checkApiKey();
}
