import { Request } from 'express';
import { Strategy as PassportStrategy } from 'passport-strategy';

type VerifyCallback = (err: Error | null, user?: object, info?: object) => void;

type VerifyFunction = (
  apiKey: string,
  verified: VerifyCallback,
  req?: Request,
) => void;

export class HeaderOrQueryApiKeyStrategy extends PassportStrategy {
  // Declared here because passport injects these at runtime; the base type omits them.
  declare fail: (info: object, status: unknown) => void;
  declare error: (err: Error) => void;
  declare success: (user: object, info?: object) => void;

  name: string;
  passReqToCallback: boolean;
  verify: VerifyFunction;

  constructor(passReqToCallback: boolean, verify: VerifyFunction) {
    super();
    this.name = 'headerapikey';
    this.passReqToCallback = passReqToCallback;
    this.verify = verify;
  }

  authenticate(req: Request): void {
    const headerKey = req.headers['x-api-key'] as string | undefined;
    const queryKey = req.query['x-api-key'] as string | undefined;
    const apiKey = headerKey ?? queryKey;

    if (!apiKey) {
      return this.fail({ message: 'Missing API Key' }, null);
    }

    const verified: VerifyCallback = (err, user?, info?) => {
      if (err) {
        return this.error(err);
      }
      if (!user) {
        return this.fail(info, null);
      }
      this.success(user, info);
    };

    if (this.passReqToCallback) {
      this.verify(apiKey, verified, req);
    } else {
      this.verify(apiKey, verified);
    }
  }
}
