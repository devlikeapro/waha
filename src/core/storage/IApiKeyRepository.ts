import { RawRuleOf } from '@casl/ability';
import { UnprocessableEntityException } from '@nestjs/common';
import { AppAbility } from '../auth/casl.types';

export interface ApiKey {
  id: string;
  key: string;
  isActive: boolean;
  isAdmin: boolean;
  /** Tenant ID - null means global admin key */
  tenantId: string | null;
  /** Session name - null means tenant-wide key (admin keys only) */
  session: string | null;
  rules: RawRuleOf<AppAbility>[] | null;
}

export interface IApiKeyRepository {
  init(): Promise<void>;

  list(): Promise<ApiKey[]>;

  upsert(key: ApiKey): Promise<ApiKey>;

  getActiveByKey(key: string): Promise<ApiKey | null>;

  getById(id: string): Promise<ApiKey | null>;

  getByKey(key: string): Promise<ApiKey | null>;

  deleteById(id: string): Promise<void>;

  deleteBySession(session: string): Promise<void>;
}

export function CheckInvariant(
  apiKey: Pick<ApiKey, 'isAdmin' | 'tenantId' | 'session'>,
): void {
  // Admin keys cannot have a session (but can have tenantId for tenant admin)
  if (apiKey.isAdmin && apiKey.session) {
    throw new UnprocessableEntityException(
      'Session is not allowed for admin keys',
    );
  }
  // Non-admin keys must have both tenantId and session
  if (!apiKey.isAdmin && (!apiKey.tenantId || !apiKey.session)) {
    throw new UnprocessableEntityException(
      'Session-bound keys must have both tenantId and session',
    );
  }
  // Admin keys with tenantId cannot have session (handled above)
  if (apiKey.isAdmin && apiKey.tenantId && apiKey.session) {
    throw new UnprocessableEntityException(
      'Session is not allowed for admin keys',
    );
  }
}
