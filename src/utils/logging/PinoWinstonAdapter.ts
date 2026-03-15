import { isPlainObject } from 'lodash';
import type { Logger as PinoLogger } from 'pino';

type WinstonLogLevel =
  | 'error'
  | 'warn'
  | 'info'
  | 'http'
  | 'verbose'
  | 'debug'
  | 'silly';

type WinstonLogEntry = Record<string, unknown> & {
  level?: WinstonLogLevel | string;
  message?: unknown;
};

type PinoLogMethod = 'error' | 'warn' | 'info' | 'debug' | 'trace';

// Wraps a Pino logger with a Winston-compatible interface.
// WPPConnect expects a winston.Logger (which extends EventEmitter), but never
// calls any EventEmitter methods — only log-level methods and .log(entry).
// The cast in the call site (as unknown as Logger) is therefore safe.
export class PinoWinstonAdapter {
  constructor(private readonly logger: PinoLogger) {}

  log(
    levelOrEntry: string | WinstonLogEntry,
    message?: unknown,
    meta?: unknown,
  ) {
    if (isPlainObject(levelOrEntry)) {
      const {
        level,
        message: entryMessage,
        ...entryMeta
      } = levelOrEntry as WinstonLogEntry;
      this.write(level, entryMessage, entryMeta);
      return this;
    }
    this.write(levelOrEntry as string, message, meta);
    return this;
  }

  error(message: unknown, ...meta: unknown[]) {
    this.write('error', message, meta[0]);
    return this;
  }

  warn(message: unknown, ...meta: unknown[]) {
    this.write('warn', message, meta[0]);
    return this;
  }

  info(message: unknown, ...meta: unknown[]) {
    this.write('info', message, meta[0]);
    return this;
  }

  http(message: unknown, ...meta: unknown[]) {
    this.write('http', message, meta[0]);
    return this;
  }

  verbose(message: unknown, ...meta: unknown[]) {
    this.write('verbose', message, meta[0]);
    return this;
  }

  debug(message: unknown, ...meta: unknown[]) {
    this.write('debug', message, meta[0]);
    return this;
  }

  silly(message: unknown, ...meta: unknown[]) {
    this.write('silly', message, meta[0]);
    return this;
  }

  private write(level: string | undefined, message: unknown, meta?: unknown) {
    const payload = this.normalizeMeta(meta);
    const method = this.getPinoMethod(level);

    if (message instanceof Error) {
      this.logWithMethod(method, payload, message.message, message);
      return;
    }

    if (typeof message === 'string') {
      this.logWithMethod(method, payload, message);
      return;
    }

    if (message !== undefined) {
      payload.message = message;
    }
    this.logWithMethod(method, payload, '');
  }

  private getPinoMethod(level?: string): PinoLogMethod {
    switch (level) {
      case 'error':
        return 'error';
      case 'warn':
        return 'warn';
      case 'debug':
      case 'verbose':
        return 'debug';
      case 'silly':
        return 'trace';
      case 'http':
      case 'info':
      default:
        return 'info';
    }
  }

  private normalizeMeta(meta: unknown): Record<string, unknown> {
    if (isPlainObject(meta)) {
      return { ...(meta as Record<string, unknown>) };
    }
    if (meta instanceof Error) {
      return { err: meta };
    }
    if (meta !== undefined && meta !== null) {
      return { meta };
    }
    return {};
  }

  private logWithMethod(
    method: PinoLogMethod,
    payload: Record<string, unknown>,
    message: string,
    error?: Error,
  ) {
    switch (method) {
      case 'error':
        if (error) {
          this.logger.error({ ...payload, err: error }, message);
        } else {
          this.logger.error(payload, message);
        }
        return;
      case 'warn':
        this.logger.warn(payload, message);
        return;
      case 'debug':
        this.logger.debug(payload, message);
        return;
      case 'trace':
        this.logger.trace(payload, message);
        return;
      case 'info':
      default:
        this.logger.info(payload, message);
        return;
    }
  }
}
