import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { IApiKeyAuth, NoAuth } from '@waha/core/auth/auth';
import * as passport from 'passport';

@Injectable()
export class ApiKeyAuthMiddleware implements NestMiddleware {
  constructor(private auth: IApiKeyAuth) {}

  use(req: any, res: any, next: () => void) {
    if (this.auth instanceof NoAuth) {
      next();
      return;
    }

    passport.authenticate('headerapikey', { session: false }, (err, user?) => {
      if (err) {
        const exception =
          err instanceof UnauthorizedException
            ? err
            : new UnauthorizedException();
        res.status(exception.getStatus()).json(exception.getResponse());
        return;
      }
      if (!user) {
        const exception = new UnauthorizedException();
        res.status(exception.getStatus()).json(exception.getResponse());
        return;
      }
      req.user = user;
      next();
    })(req, res, next);
  }
}
