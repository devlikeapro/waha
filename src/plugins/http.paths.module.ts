import { Inject, Module, Type } from '@nestjs/common';
import {
  HttpPathContribution,
  HttpPathsService,
} from '@waha/plugins/HttpPathsService';

@Module({
  providers: [HttpPathsService],
  exports: [HttpPathsService],
})
export class HttpPathsModule {}

/**
 * Import-time registration for modules that have no class of their own (e.g. object-style apps) -
 * returns a module that registers the contributions in HttpPathsService at bootstrap.
 */
export function HttpPathsRegistration(
  ...contributions: HttpPathContribution[]
): Type<any> {
  @Module({
    imports: [HttpPathsModule],
  })
  class HttpPathsRegistrationModule {
    constructor(@Inject(HttpPathsService) httpPaths: HttpPathsService) {
      httpPaths.register(...contributions);
    }
  }
  return HttpPathsRegistrationModule;
}
