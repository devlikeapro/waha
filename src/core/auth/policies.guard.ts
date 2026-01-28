import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { CaslAbilityFactory } from '@waha/core/auth/casl.ability';
import {
  CHECK_POLICIES_KEY,
  PolicyHandler,
} from '@waha/core/auth/policies.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const handlers =
      this.reflector.getAllAndOverride<PolicyHandler[]>(CHECK_POLICIES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const ability = this.caslAbilityFactory.createForUser(user);
    req.ability = ability;
    const ok = handlers.every((handler) => handler(ability, context));
    if (!ok) {
      throw new ForbiddenException();
    }
    return true;
  }
}
