import { BadRequestException, ExecutionContext } from '@nestjs/common';

import {
  Action,
  AppAbility,
  server,
  session,
} from '@waha/core/auth/casl.types';

type GetSession = (req: any) => unknown;

function requireSessionName(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new BadRequestException('Session name is required');
  }
  return value;
}

export function CanSession(action: Action, name?: GetSession) {
  return (ability: AppAbility, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    if (name) {
      const sessionName = requireSessionName(name(req));
      return ability.can(action, new session(sessionName));
    }
    return ability.can(action, 'session');
  };
}

export function FromParam(key = 'session'): GetSession {
  return (req) => req.params?.[key];
}

export function FromBody(key = 'session'): GetSession {
  return (req) => req.body?.[key];
}

export function FromQuery(key = 'session'): GetSession {
  return (req) => req.query?.[key];
}

export function CanServer(action: Action) {
  return (ability: AppAbility, context: ExecutionContext) => {
    return ability.can(action, 'server');
  };
}
