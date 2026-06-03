import {
  McpServer,
  ResourceTemplate as SdkResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { VERSION } from '@waha/version';
import { McpController } from '@waha/apps/mcp/decorators/controller';
import { getTools } from '@waha/apps/mcp/decorators/tool';
import {
  getResources,
  getResourceTemplates,
} from '@waha/apps/mcp/decorators/resource';

export class WMcpServer {
  private readonly mcp: McpServer;

  constructor(controllers: McpController[]) {
    this.mcp = new McpServer({
      name: 'whatsapp-server-mcp',
      version: `${VERSION.version} (${VERSION.engine}, ${VERSION.tier}, ${VERSION.platform})`,
    });

    for (const controller of controllers) {
      for (const { name, config, method } of getTools(controller)) {
        this.mcp.registerTool(
          name,
          config,
          (controller as any)[method].bind(controller),
        );
      }

      for (const { name, uri, config, method } of getResources(controller)) {
        this.mcp.registerResource(
          name,
          uri,
          config,
          (controller as any)[method].bind(controller),
        );
      }

      for (const { name, uriTemplate, config, method } of getResourceTemplates(
        controller,
      )) {
        const template = new SdkResourceTemplate(uriTemplate, {
          list: undefined,
        });
        this.mcp.registerResource(
          name,
          template,
          config,
          (controller as any)[method].bind(controller),
        );
      }
    }
  }

  connect(transport: Transport) {
    return this.mcp.connect(transport);
  }

  close() {
    return this.mcp.close();
  }
}
