import {
  NotImplementedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { getEngineName } from '@waha/config';
import { ProxyScheme } from '@waha/structures/enums.dto';

export const DOCS_URL = 'https://waha.devlike.pro/';

const engine = getEngineName();

export class NotImplementedByEngineError extends NotImplementedException {
  constructor(msg = '') {
    let error = `The method is not implemented by '${engine}' engine. Check the docs and try another engine: ${DOCS_URL}`;
    if (msg) {
      error = `${msg} ${error}`;
    }
    super(error);
  }
}

export class ProxyError extends UnprocessableEntityException {
  constructor(server: string, cause: Error) {
    super(`Invalid proxy server '${server}': ${cause.message}`);
  }
}

export class UnsupportedProxySchemeError extends UnprocessableEntityException {
  constructor(scheme: string) {
    const supported = Object.values(ProxyScheme).join(', ');
    super(`Unsupported proxy scheme '${scheme}' - use one of ${supported}`);
  }
}

export class AvailableInPlusVersion extends UnprocessableEntityException {
  constructor(feature: string = 'The feature') {
    super(
      `${feature} is available only in Plus version for '${engine}' engine. Check this out: ${DOCS_URL}`,
    );
  }
}

export class AvailableInPlusVersionAll extends UnprocessableEntityException {
  constructor(feature: string = 'The feature') {
    super(
      `${feature} is available only in Plus version. Check this out: ${DOCS_URL}`,
    );
  }
}
