import {
  CallHandler,
  ExecutionContext,
  Injectable,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Observable } from 'rxjs';

/**
 * Interceptor that handles file uploads and puts them into the body.file
 * supports "file" and "files" fields.
 */
export function WAHAFileInterceptor(
  options?: MulterOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileFieldsInterceptor: NestInterceptor;

    constructor() {
      this.fileFieldsInterceptor = new (FileFieldsInterceptor(
        [
          { name: 'file', maxCount: 1 },
          { name: 'files', maxCount: 1 },
        ],
        options,
      ))();
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest();
      const contentType = request.headers['content-type'] || '';

      if (!contentType.includes('multipart/form-data')) {
        return next.handle();
      }

      return (await this.fileFieldsInterceptor.intercept(context, {
        handle: () => {
          const files = request.files;
          let file;
          if (files) {
            if (files.file && files.file[0]) {
              file = files.file[0];
            } else if (files.files && files.files[0]) {
              file = files.files[0];
            }
          }

          if (file) {
            request.body.file = {
              mimetype: file.mimetype,
              filename: file.originalname,
              data: file.buffer.toString('base64'),
            };
          }
          return next.handle();
        },
      })) as Observable<any>;
    }
  }

  return mixin(Interceptor);
}
