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

/**
 * Rules for tenant-scoped access.
 * Tenant users can access resources within their tenant.
 */
export function TenantRules(tenantId: string): RawRuleOf<AppAbility>[] {
  return [
    //
    // Server - read only
    //
    {
      action: 'read',
      subject: 'server',
    },
    //
    // Sessions - filtered by tenantId
    //
    {
      action: Action.List,
      subject: 'session',
    },
    {
      action: Action.Read,
      subject: 'session',
      conditions: { tenantId: tenantId },
    },
    {
      action: Action.Use,
      subject: 'session',
      conditions: { tenantId: tenantId },
    },
  ];
}

/**
 * Rules for session-scoped access (legacy).
 * Session-bound API keys can only access their specific session.
 */
export function SessionRules(
  name: string,
  tenantId?: string,
): RawRuleOf<AppAbility>[] {
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
      conditions: { name: name, ...(tenantId && { tenantId }) },
    },
    // {
    //   action: Action.Delete,
    //   subject: 'session',
    //   conditions: { name: name },
    // },
    {
      action: Action.Use,
      subject: 'session',
      conditions: { name: name, ...(tenantId && { tenantId }) },
    },
  ];
}
