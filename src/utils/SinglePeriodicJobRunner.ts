import { Logger } from 'pino';

type FunctionNoArgs = () => Promise<any>;

/**
 * Run a job (function) in some interval,
 * but make sure we run exactly ONE job at the same time
 */
export class SinglePeriodicJobRunner {
  private interval: NodeJS.Timeout;
  private isWorking: boolean = false;
  private logger: Logger;

  constructor(
    private name: string,
    private intervalMs: number,
    logger: Logger,
    private warningOverlap: boolean = true,
    private warningOverride: boolean = false,
  ) {
    this.logger = logger.child({
      job: name,
      class: SinglePeriodicJobRunner.name,
    });
  }

  start(fn: FunctionNoArgs): boolean {
    if (this.interval) {
      const msg = `Job has been started before, do not schedule it again`;
      this.log(this.warningOverride, msg);
      return false;
    }

    this.interval = setInterval(() => {
      if (this.isWorking) {
        const msg = `Job is already running, skipping this run`;
        this.log(this.warningOverlap, msg);
        return;
      }

      this.isWorking = true;
      this.logger.debug('Running job...');
      fn()
        .catch((error) => {
          this.logger.error(`Job failed: ${error}`);
          this.logger.error(error.stack);
        })
        .finally(() => {
          this.isWorking = false;
          this.logger.debug(`Job finished`);
        });
    }, this.intervalMs);
    this.logger.info(`Job started with interval ${this.intervalMs} ms`);
    return true;
  }

  stop() {
    if (!this.interval) {
      return;
    }
    clearInterval(this.interval);
    this.interval = null;
    this.logger.info(`Job stopped`);
  }

  private log(warning: boolean, msg) {
    if (warning) {
      this.logger.warn(msg);
    } else {
      this.logger.info(msg);
    }
  }
}
