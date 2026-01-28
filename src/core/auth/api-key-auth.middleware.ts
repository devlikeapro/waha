import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import * as passport from 'passport';

@Injectable()
export class ApiKeyAuthMiddleware implements NestMiddleware {
  constructor() {}

  use(req: any, res: any, next: () => void) {
    passport.authenticate('headerapikey', { session: false }, (err, user?) => {
      if (err) {
        const exception =
          err instanceof UnauthorizedException
            ? err
            : new InternalServerErrorException();
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
