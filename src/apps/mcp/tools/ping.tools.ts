import { McpController } from '@waha/apps/mcp/decorators/controller';
import { Tool } from '@waha/apps/mcp/decorators/tool';
import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';

export class PingTools extends McpController {
  constructor(api: WAHASelf) {
    super(api);
  }

  @Tool('ping', {
    title: 'Ping the server',
    description: 'Check if the WAHA server is alive and responding',
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async ping() {
    return this.textRequest({
      method: 'GET',
      url: '/ping',
    });
  }
}
