import { Injectable } from '@nestjs/common';
import { User } from '@waha/core/auth/apiKey.strategy';
import { SessionManager } from '@waha/core/abc/manager.abc';

@Injectable()
export class ApiKeyService {
  constructor(private manager: SessionManager) {}

  async get(apikey: string): Promise<User | null> {
    if (!apikey) {
      return null;
    }
    const key = await this.manager.apiKeyRepository.getActiveByKey(apikey);
    if (!key) {
      return null;
    }
    return {
      isAdmin: key.isAdmin,
      session: key.session,
    };
  }
}
