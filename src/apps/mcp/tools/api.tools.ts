import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { McpController } from '@waha/apps/mcp/decorators/controller';
import { Tool } from '@waha/apps/mcp/decorators/tool';
import { APIInput } from '@waha/apps/mcp/tools/api.zod';
import { Auth } from '@waha/core/auth/config';
import { z } from 'zod';

export class ApiTools extends McpController {
  constructor(api: WAHASelf) {
    super(api);
  }

  @Tool('api-openapi', {
    title: 'Get OpenAPI schema for HTTP API',
    description:
      'Get the latest OpenAPI schema for the HTTP API available to call in the "api-call" tool. ' +
      'Use it as a last option if no native tools are found. ' +
      'Find appropriate /api/send.* methods to send messages to direct chats (lid, c.us), groups (g.us) and channels/newsletter (@newsletter). ' +
      'Use api/:session/status to send status.',
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async openapi() {
    const headers: Record<string, string> = {};
    const swaggerUser = Auth.swagger.username.value;
    const swaggerPassword = Auth.swagger.password.value;
    if (swaggerUser && swaggerPassword) {
      const encoded = Buffer.from(`${swaggerUser}:${swaggerPassword}`).toString(
        'base64',
      );
      headers['Authorization'] = `Basic ${encoded}`;
    }
    return this.textRequest({
      method: 'GET',
      url: '/-json',
      headers: headers,
    });
  }

  @Tool('api-call', {
    title: 'Call HTTP API',
    description:
      'Call HTTP API for certain method if no native MCP tools available. ' +
      'Before calling fetch "api-openapi" tool to get the latest openapi spec. ' +
      'Use it as last option if no native tools are found.',
    inputSchema: APIInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
    },
  })
  async call({ path, method, body }: z.infer<typeof APIInput>) {
    return this.textRequest({
      method: method,
      url: path,
      data: body,
    });
  }
}
