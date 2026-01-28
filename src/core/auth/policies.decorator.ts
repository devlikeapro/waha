import { SetMetadata } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';

import { AppAbility } from './casl.types';

export const CHECK_POLICIES_KEY = 'check_policies';

export type PolicyHandlerCallback = (
  ability: AppAbility,
  context: ExecutionContext,
) => boolean;
export type PolicyHandler = PolicyHandlerCallback;

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
