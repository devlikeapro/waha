import { RawRuleOf } from '@casl/ability';
import { Action, AppAbility, SessionActions } from './casl.types';

export function AdminRules(): RawRuleOf<AppAbility>[] {
  return [
    {
      action: Action.Manage,
      subject: 'all',
    },
  ];
}

const DefaultSessionActions: SessionActions = {
  delete: false,
  setting: true,
  control: true,
  app: true,
  read: true,
  send: true,
};

export function SessionRules(
  name: string,
  rules: SessionActions | null = null,
): RawRuleOf<AppAbility>[] {
  const actions = rules ?? DefaultSessionActions;
  const result: RawRuleOf<AppAbility>[] = [
    {
      action: 'retrieve',
      subject: 'server',
    },
    {
      action: Action.List,
      subject: 'session',
      // "conditions" is not required here, we filter session list dynamically later
    },
    { action: Action.Retrieve, subject: 'session', conditions: { name: name } },
  ];

  if (actions.read) {
    result.push({
      action: Action.Read,
      subject: 'session',
      conditions: { name: name },
    });
  }
  if (actions.send) {
    result.push({
      action: Action.Send,
      subject: 'session',
      conditions: { name: name },
    });
  }
  if (actions.control) {
    result.push({
      action: Action.Control,
      subject: 'session',
      conditions: { name: name },
    });
  }
  if (actions.setting) {
    result.push({
      action: Action.Setting,
      subject: 'session',
      conditions: { name: name },
    });
  }
  if (actions.app) {
    result.push({
      action: Action.App,
      subject: 'session',
      conditions: { name: name },
    });
  }
  if (actions.delete) {
    result.push({
      action: Action.Delete,
      subject: 'session',
      conditions: { name: name },
    });
  }

  return result;
}
