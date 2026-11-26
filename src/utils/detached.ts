import { context, ROOT_CONTEXT } from '@opentelemetry/api';
import { storage } from 'nestjs-pino/storage';

/**
 * Runs fn outside the current request - no request logger, no active trace span.
 * Everything fn schedules (timers, promises) inherits the empty context too.
 */
export function runDetached<T>(fn: () => T): T {
  return context.with(ROOT_CONTEXT, () => storage.exit(fn));
}
