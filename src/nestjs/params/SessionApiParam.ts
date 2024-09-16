import { Param } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import {
  QRCodeSessionPipe,
  SessionPipe,
  WorkingSessionPipe,
} from '@waha/nestjs/pipes/SessionPipe';

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
  description: 'Session name',
});
/**
 * Session param
 */
export const SessionParam = Param('session', SessionPipe);

export const WorkingSessionParam = Param('session', WorkingSessionPipe);

export const QRCodeSessionParam = Param('session', QRCodeSessionPipe);
