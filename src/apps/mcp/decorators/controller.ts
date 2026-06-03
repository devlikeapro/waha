import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { AxiosRequestConfig } from 'axios';
import { ImageMcpResponse, TextMcpResponse } from '@waha/apps/mcp/responses';

export class McpController {
  constructor(protected readonly api: WAHASelf) {}

  protected async request(config: AxiosRequestConfig<any>) {
    const requestConfig = { ...config };
    requestConfig.validateStatus = () => true;
    const response = await this.api.request(requestConfig);
    return response;
  }

  protected async textRequest(config: AxiosRequestConfig) {
    const response = await this.request(config);
    const responseText =
      typeof response.data === 'string'
        ? response.data
        : JSON.stringify(response.data);
    return TextMcpResponse(
      JSON.stringify({ status: response.status, response: responseText }),
    );
  }

  protected async imageRequest(url: string) {
    const response = await this.api.request({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
    });
    return ImageMcpResponse(Buffer.from(response.data));
  }
}
