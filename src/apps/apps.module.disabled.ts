import { AppsService } from '@waha/apps/app_sdk/services/IAppsService';
import { AppsDisabledService } from '@waha/apps/app_sdk/services/AppsDisabledService';
import { UniqueAppResolver } from '@waha/apps/app_sdk/services/UniqueAppResolver';
import { AppsController } from '@waha/apps/app_sdk/api/apps.controller';
import { ChatwootLocalesController } from '@waha/apps/chatwoot/api/chatwoot.locales.controller';

export const AppsDisabled = {
  providers: [
    {
      provide: AppsService,
      useClass: AppsDisabledService,
    },
    UniqueAppResolver,
  ],
  imports: [],
  controllers: [AppsController, ChatwootLocalesController],
};
