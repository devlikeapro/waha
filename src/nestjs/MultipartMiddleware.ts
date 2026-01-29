import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as multer from 'multer';

@Injectable()
export class MultipartMiddleware implements NestMiddleware {
  private multer: any;

  constructor() {
    this.multer = multer().fields([
      { name: 'file', maxCount: 1 },
      { name: 'files', maxCount: 1 },
    ]);
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.multer(req, res, (err: any) => {
      if (err) {
        return next(err);
      }
      next();
    });
  }
}
