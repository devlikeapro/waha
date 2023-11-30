import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Base64File } from '../structures/files.dto';

@Injectable()
/**
 * Interceptor to convert Buffer response to Base64File or StreamableFile
 * based on Accept header.
 * It should go together with @ApiFileAcceptHeader in controller method
 * So we have proper Swagger documentation
 */
export class BufferResponseInterceptor<T>
  implements NestInterceptor<Buffer, Base64File | StreamableFile>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Base64File | StreamableFile> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    return next.handle().pipe(map(processBuffer));

    function processBuffer(buffer: Buffer) {
      // Check buffer is Buffer
      if (!Buffer.isBuffer(buffer)) {
        return buffer;
      }

      const accept = request.headers['accept'];
      if (accept == 'application/json') {
        return {
          mimetype: 'image/png',
          data: buffer.toString('base64'),
        };
      }
      const file = new StreamableFile(buffer);
      response.set({
        'Content-Type': 'image/png',
        'Content-Length': buffer.length,
      });
      return file;
    }
  }
}
