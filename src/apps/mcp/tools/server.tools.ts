import { z } from 'zod';
import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { McpController } from '@waha/apps/mcp/decorators/controller';
import { Tool } from '@waha/apps/mcp/decorators/tool';
import { EnvironmentInput, StopInput } from '@waha/apps/mcp/tools/server.zod';

export class ServerTools extends McpController {
  constructor(api: WAHASelf) {
    super(api);
  }

  @Tool('server-version', {
    title: 'Get server version',
    description: 'Get the version and build information of the WAHA server',
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async version() {
    return this.textRequest({
      method: 'GET',
      url: '/api/server/version',
    });
  }

  @Tool('server-status', {
    title: 'Get server status',
    description: 'Get server uptime, start timestamp, and worker information',
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async status() {
    return this.textRequest({
      method: 'GET',
      url: '/api/server/status',
    });
  }

  @Tool('server-environment', {
    title: 'Get server environment',
    description:
      'Get environment variables from the server (WAHA_* and WHATSAPP_* by default)',
    inputSchema: EnvironmentInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async environment(params: z.infer<typeof EnvironmentInput>) {
    return this.textRequest({
      method: 'GET',
      url: '/api/server/environment',
      params: params,
    });
  }

  @Tool('server-stop', {
    title: 'Stop the server',
    description:
      'Stop (and restart) the WAHA server. Use force=true for immediate termination.',
    inputSchema: StopInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
    },
  })
  async stop(body: z.infer<typeof StopInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/server/stop',
      data: body,
    });
  }
}
