import { Controller, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { AppName } from '@waha/apps/app_sdk/apps/apps';
import { UniqueAppResolver } from '@waha/apps/app_sdk/services/UniqueAppResolver';
import { BrazilianPhoneNumbersAppService } from '@waha/apps/brazilian-phone-numbers/services/BrazilianPhoneNumbersAppService';
import { PhoneNumbersCacheController } from '@waha/apps/phone-numbers/api/PhoneNumbersCacheController';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';

@ApiSecurity('api_key')
@Controller('api/apps/brazilian-phone-numbers/:session')
@UseGuards(PoliciesGuard)
export class BrazilianPhoneNumbersController extends PhoneNumbersCacheController {
  constructor(
    manager: SessionManager,
    resolver: UniqueAppResolver,
    appService: BrazilianPhoneNumbersAppService,
  ) {
    super(manager, resolver, appService, AppName.brazilianPhoneNumbers);
  }
}
