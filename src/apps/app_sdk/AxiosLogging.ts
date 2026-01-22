import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { ILogger } from './ILogger';

export class AxiosLogging {
  constructor(private readonly logger: ILogger) {}

  applyTo(instance: AxiosInstance) {
    instance.interceptors.request.use(this.onRequest.bind(this));
    instance.interceptors.response.use(
      this.onResponse.bind(this),
      this.onError.bind(this),
    );
  }

  private onRequest(config: AxiosRequestConfig) {
    const method = config.method?.toUpperCase() ?? 'GET';
    const url = config.url ?? '';
    const query = config.params
      ? `?${new URLSearchParams(config.params).toString()}`
      : '';
    const body = config.data ? JSON.stringify(config.data) : '';

    this.logger.debug(`${method} ${url}${query} ${body}`);
    return config;
  }

  private onResponse(response: AxiosResponse) {
    const { method, url } = response.config;
    const status = response.status;
    const methodStr = method?.toUpperCase() ?? 'GET';

    const type: any = response.headers['content-type'];
    // Log warnings for non-2xx/3xx responses
    if (status < 200 || status >= 400) {
      const data = JSON.stringify(response.data);
      this.logger.warn(`${methodStr} ${status} ${url} ${data}`);
      return response;
    }

    // Log debug for 2xx/3xx responses
    this.logger.debug(`${methodStr} ${status}:OK ${url}`);
    if (type?.startsWith('application/json')) {
      const data = JSON.stringify(response.data);
      this.logger.trace(`${methodStr} ${status}:OK ${url} ${data}`);
    } else {
      this.logger.trace(`${methodStr} ${status}:OK ${url} [${type}]`);
    }

    return response;
  }

  private onError(error: any) {
    if (error.response) {
      const { method, url } = error.config;
      const status = error.response.status;
      const message = `${
        method?.toUpperCase() ?? 'GET'
      } ${status} ${url} ${JSON.stringify(error.response.data)}`;
      this.logger.error(message);
    } else {
      this.logger.error(`Axios error: ${error.message}`);
    }

    return Promise.reject(error);
  }
}
