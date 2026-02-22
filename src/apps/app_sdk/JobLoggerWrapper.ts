import { Job } from 'bullmq';
import { Logger } from 'pino';

import { ILogger } from './ILogger';

/**
 * JobLoggerWrapper is a wrapper around the BullMQ Job class that provides
 * a logger with the job ID as a child context.
 * It allows logging messages to the job's log
 * and also to the logger itself.
 */
export class JobLoggerWrapper implements ILogger {
  private readonly logger: Logger;

  constructor(
    private job: Job,
    logger: Logger,
  ) {
    this.logger = logger.child({ jobId: job.id });
  }

  fatal(log: string): void {
    this.log(log, 'fatal');
  }

  error(log: string): void {
    this.log(log, 'error');
  }

  warn(log: string): void {
    this.log(log, 'warn');
  }

  info(log: string): void {
    this.log(log, 'info');
  }

  debug(log: string): void {
    this.log(log, 'debug');
  }

  trace(log: string): void {
    this.log(log, 'trace');
  }

  private log(msg: string, level: string) {
    if (!this.logger.isLevelEnabled(level)) {
      return;
    }
    this.logger[level](msg);
    const timestamp = new Date().toISOString();
    this.job
      .log(`[${timestamp}] ${level.toUpperCase()}: ${msg}`)
      .catch((err) => {
        this.logger.error({ err }, 'Error logging message to job');
      });
  }
}
