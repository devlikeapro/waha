import {
  applyDecorators,
  Injectable,
  Param,
  PipeTransform,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import { Base64File } from '../structures/files.dto';

/**
 * Get session name and return Whatsapp session back (if exists)
 * use it as
 @Param('session', SessionPipe) session: WhatsappSession,
 */
@Injectable()
export class SessionPipe implements PipeTransform<WhatsappSession> {
  constructor(private manager: SessionManager) {}

  async transform(value: any) {
    return this.manager.getSession(value);
  }
}

/**
 * Decorator for a method that uses SessionPipe above
 */
export const SessionApiParam = ApiParam({
  name: 'session',
  required: true,
  type: 'string',
  schema: {
    default: 'default',
  },
  description: 'WhatsApp session name',
});

/**
 * Session param
 @SessionParam session: WhatsappSession,
 */
export const SessionParam = Param('session', SessionPipe);

function getRefSchemaPaths(models) {
  return models.map((model) => {
    return { $ref: getSchemaPath(model) };
  });
}

export function ApiFileAcceptHeader(...models) {
  models = models.length ? models : [Base64File];
  return applyDecorators(
    // Add extra models, otherwise it'll give a error
    // $ref not found
    ApiExtraModels(...models),
    ApiResponse({
      status: 200,
      content: {
        'image/png': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
        'application/json': {
          schema: {
            oneOf: getRefSchemaPaths(models),
          },
        },
      },
    }),
  );
}
