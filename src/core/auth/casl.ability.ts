import { Injectable } from '@nestjs/common';
import { User } from './apiKey.strategy';
import { createMongoAbility } from '@casl/ability';
import { AdminRules, SessionRules } from './casl.rules';
import { Action, AppAbility, session } from './casl.types';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): AppAbility {
    // when we disable auth using WHATSAPP_API_KEY_EXCLUDE_PATH
    // req.use will be null, so we allow any request
    if (!user) {
      return createMongoAbility(AdminRules());
    }
    // Admin user
    if (user.isAdmin) {
      return createMongoAbility(AdminRules());
    }
    if (user.session) {
      return createMongoAbility(SessionRules(user.session));
    }
    return createMongoAbility([]);
  }
}

export function FilterSessions<T extends { name: string }>(
  ability: AppAbility,
  action: Action,
  sessions: T[],
) {
  return sessions.filter((s) => ability.can(action, new session(s.name)));
}
