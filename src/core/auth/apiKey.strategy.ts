import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IApiKeyAuth } from '@waha/core/auth/auth';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { ApiKeyService } from '@waha/core/auth/ApiKeyService';

export interface User {
  isAdmin: boolean;
  session?: string;
}

function AdminUser(): User {
  return {
    isAdmin: true,
    session: null,
  };
}

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor(
    private auth: IApiKeyAuth,
    private apiKeyService: ApiKeyService,
  ) {
    // @ts-ignore
    super({ header: 'X-Api-Key', prefix: '' }, true, (apikey, done) => {
      return this.validate(apikey, done);
    });
  }

  validate(apikey: string, done: (err?, user?: User) => void): void {
    this.user(apikey)
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  }

  async user(apikey: string): Promise<User> {
    if (this.auth.isValid(apikey)) {
      return AdminUser();
    }
    return this.apiKeyService.get(apikey);
  }
}
