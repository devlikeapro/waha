import { Param } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { SessionPipe } from '@waha/nestjs/pipes/SessionPipe';

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
  description: 'Session <code>name</code>',
});
/**
 * Session param
 */
export const SessionParam = Param('session', SessionPipe);
