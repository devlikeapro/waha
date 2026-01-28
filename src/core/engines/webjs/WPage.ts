import { sleep } from '@waha/utils/promiseTimeout';
import { EventEmitter } from 'events';
import { Key } from 'node-cache';
import { Page } from 'puppeteer';

export interface CallErrorEvent {
  method: string | symbol;
  error: unknown;
}

export const PAGE_CALL_ERROR_EVENT = 'page.call.error';

/**
 * WPage is a puppeter.Page wrapper that use ALL original methods from Page,
 * but in case if there were any errors in the call (original) -
 * it calls the errorCallback with method name, error and arguments
 *
 * Find in webjs used functions like "pupPage.{function}"
 * >>> cd src
 * >>> grep -rho 'page\.[a-zA-Z0-9_]\+(' . --include="*.js" | sed 's/($//' | sort -u
 *
 * Find in webjs used functions like "page.{function}"
 * >>> cd src
 * >>> grep -rho 'page\.[a-zA-Z0-9_]\+(' . --include="*.js" | sed 's/($//' | sort -u
 *
 */
export class WPage extends EventEmitter {
  constructor(private page: Page) {
    super();
  }

  async evaluate(fn, ...args: any[]) {
    try {
      return await this.page.evaluate(fn, ...args);
    } catch (err) {
      this.emit(PAGE_CALL_ERROR_EVENT, { method: 'evaluate', error: err });
      throw err;
    }
  }

  async screenshot(options) {
    try {
      return await this.page.screenshot(options);
    } catch (err) {
      this.emit(PAGE_CALL_ERROR_EVENT, { method: 'screenshot', error: err });
      throw err;
    }
  }

  // waitForNavigation
  async waitForNavigation(options: any) {
    try {
      return await this.page.waitForNavigation(options);
    } catch (err) {
      this.emit(PAGE_CALL_ERROR_EVENT, {
        method: 'waitForNavigation',
        error: err,
      });
      throw err;
    }
  }

  // waitForFunction
  async waitForFunction(fn, options, ...args) {
    try {
      return await this.page.waitForFunction(fn, options, ...args);
    } catch (err) {
      this.emit(PAGE_CALL_ERROR_EVENT, {
        method: 'waitForFunction',
        error: err,
      });
      throw err;
    }
  }

  // setRequestInterception
  async setRequestInterception(value: boolean) {
    try {
      return await this.page.setRequestInterception(value);
    } catch (err) {
      this.emit(PAGE_CALL_ERROR_EVENT, {
        method: 'setRequestInterception',
        error: err,
      });
      throw err;
    }
  }

  // exposeFunction
  async exposeFunction(name: string, fn: (...args: any[]) => any) {
    try {
      return await this.page.exposeFunction(name, fn);
    } catch (err) {
      this.emit(PAGE_CALL_ERROR_EVENT, {
        method: 'exposeFunction',
        error: err,
      });
      throw err;
    }
  }

  // removeExposedFunction
  async removeExposedFunction(name: string) {
    try {
      return await this.page.removeExposedFunction(name);
    } catch (err) {
      this.emit(PAGE_CALL_ERROR_EVENT, {
        method: 'removeExposedFunction',
        error: err,
      });
      throw err;
    }
  }

  async reload(options?: any): Promise<any> {
    try {
      return await this.page.reload(options);
    } catch (err) {
      this.emit(PAGE_CALL_ERROR_EVENT, {
        method: 'reload',
        error: err,
      });
      throw err;
    }
  }

  on(event: string | symbol, listener: (...args: any[]) => void): this {
    if (event === PAGE_CALL_ERROR_EVENT) {
      super.on(event, listener);
      return this;
    }
    this.page.on(event, listener);
    return this.page as any;
  }

  get tracing() {
    return this.page.tracing;
  }
}
