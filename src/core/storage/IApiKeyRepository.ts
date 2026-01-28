import { RawRuleOf } from '@casl/ability';
import { UnprocessableEntityException } from '@nestjs/common';
import { AppAbility } from '../auth/casl.types';

export interface ApiKey {
  id: string;
  key: string;
  isActive: boolean;
  isAdmin: boolean;
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
  apiKey: Pick<ApiKey, 'isAdmin' | 'session'>,
): void {
  if (apiKey.isAdmin && apiKey.session) {
    throw new UnprocessableEntityException(
      'Session is not allowed for admin keys',
    );
  }
  if (!apiKey.isAdmin && !apiKey.session) {
    throw new UnprocessableEntityException(
      'Either isAdmin must be true or session must be provided',
    );
  }
}
