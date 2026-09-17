import { Controller, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { AppName } from '@waha/apps/app_sdk/apps/apps';
import { UniqueAppResolver } from '@waha/apps/app_sdk/services/UniqueAppResolver';
import { PhoneNumbersCacheController } from '@waha/apps/phone-numbers/api/PhoneNumbersCacheController';
import { PhoneNumbersAppService } from '@waha/apps/phone-numbers/services/PhoneNumbersAppService';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';

@ApiSecurity('api_key')
@Controller('api/apps/phone-numbers/:session')
@UseGuards(PoliciesGuard)
export class PhoneNumbersController extends PhoneNumbersCacheController {
  constructor(
    manager: SessionManager,
    resolver: UniqueAppResolver,
    appService: PhoneNumbersAppService,
  ) {
    super(manager, resolver, appService, AppName.phoneNumbers);
  }
}
