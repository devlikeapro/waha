import { runDetached } from '@waha/utils/detached';
import { Logger } from 'pino';

type FunctionNoArgs = () => Promise<any>;

/**
 * Run a job (function) after a delay,
 * but make sure we run exactly ONE job at the same time
 */
export class SingleDelayedJobRunner {
  private timeout: NodeJS.Timeout;
  private logger: Logger;

  constructor(
    private name: string,
    private timeoutMs: number,
    logger: Logger,
    private warningOverride: boolean = false,
  ) {
    this.logger = logger.child({
      job: name,
      class: SingleDelayedJobRunner.name,
    });
  }

  get scheduled(): boolean {
    return !!this.timeout;
  }

  schedule(fn: FunctionNoArgs): boolean {
    if (this.scheduled) {
      const msg = `Job has been started before, do not schedule it again`;
      this.log(this.warningOverride, msg);
      return false;
    }

    // The job outlives the request that scheduled it - run it without the request log and trace context
    this.timeout = runDetached(() =>
      setTimeout(() => this.run(fn), this.timeoutMs),
    );
    this.logger.info(`Job scheduled with timeout ${this.timeoutMs} ms`);
    return true;
  }

  cancel() {
    if (!this.timeout) {
      return;
    }
    clearTimeout(this.timeout);
    this.timeout = null;
    this.logger.info(`Job cancelled`);
  }

  private run(fn: FunctionNoArgs) {
    this.logger.debug(`Running job...`);
    fn()
      .catch((error) => {
        this.logger.error(`Job failed: ${error}`);
        this.logger.error(error.stack);
      })
      .finally(() => {
        this.timeout = null;
        this.logger.debug(`Job finished`);
      });
  }

  private log(warning: boolean, msg: string) {
    if (warning) {
      this.logger.warn(msg);
    } else {
      this.logger.info(msg);
    }
  }
}
