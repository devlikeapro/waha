import { Controller, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { AppName } from '@waha/apps/app_sdk/apps/apps';
import { UniqueAppResolver } from '@waha/apps/app_sdk/services/UniqueAppResolver';
import { ArgentinePhoneNumbersAppService } from '@waha/apps/argentine-phone-numbers/services/ArgentinePhoneNumbersAppService';
import { PhoneNumbersCacheController } from '@waha/apps/phone-numbers/api/PhoneNumbersCacheController';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';

@ApiSecurity('api_key')
@Controller('api/apps/argentine-phone-numbers/:session')
@UseGuards(PoliciesGuard)
export class ArgentinePhoneNumbersController extends PhoneNumbersCacheController {
  constructor(
    manager: SessionManager,
    resolver: UniqueAppResolver,
    appService: ArgentinePhoneNumbersAppService,
  ) {
    super(manager, resolver, appService, AppName.argentinePhoneNumbers);
  }
}
