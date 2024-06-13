import { BufferJSON } from '@adiwajshing/baileys/lib/Utils';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BufferJsonReplacerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (typeof data !== 'object' || data === null) {
          return data;
        }
        // Buffer
        if (Buffer.isBuffer(data) || data?.data || data?.url) {
          return data;
        }

        // StreamableFile
        if (data instanceof StreamableFile) {
          return data;
        }

        return JSON.parse(JSON.stringify(data, BufferJSON.replacer));
      }),
    );
  }
}
