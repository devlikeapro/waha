import { Injectable, Param, PipeTransform } from '@nestjs/common';
import { ApiParam, ApiResponse } from '@nestjs/swagger';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';

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

export function ApiFileAcceptHeader() {
  return ApiResponse({
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
          type: 'object',
          properties: {
            data: {
              type: 'string',
              format: 'base64',
            },
            mimetype: {
              type: 'string',
              example: 'image/png',
            },
          },
        },
      },
    },
  });
}
