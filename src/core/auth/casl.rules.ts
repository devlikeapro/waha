import { RawRuleOf } from '@casl/ability';
import { Action, AppAbility } from './casl.types';

export function AdminRules(): RawRuleOf<AppAbility>[] {
  return [
    {
      action: Action.Manage,
      subject: 'all',
    },
  ];
}

export function SessionRules(name: string): RawRuleOf<AppAbility>[] {
  return [
    //
    // Server
    //
    {
      action: 'read',
      subject: 'server',
    },
    //
    // Session
    //
    {
      action: Action.List,
      subject: 'session',
    },
    {
      action: Action.Read,
      subject: 'session',
      conditions: { name: name },
    },
    // {
    //   action: Action.Delete,
    //   subject: 'session',
    //   conditions: { name: name },
    // },
    {
      action: Action.Use,
      subject: 'session',
      conditions: { name: name },
    },
  ];
}
