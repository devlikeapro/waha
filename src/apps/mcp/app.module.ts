import { AppModule } from '@waha/apps/app_sdk/apps/definition';
import { AppName } from '@waha/apps/app_sdk/apps/apps';
import { McpController } from '@waha/apps/mcp/api/mcp.controller';
import { McpService } from '@waha/apps/mcp/mcp.service';
import { McpAppService } from '@waha/apps/mcp/services/McpAppService';
import { HttpPathsRegistration } from '@waha/plugins/http.paths.module';

const McpAppModule: AppModule = {
  name: AppName.mcp,
  openapi: {
    title: 'MCP',
    description: 'Model Context Protocol (MCP) server for AI clients',
  },
  definition: {
    plainkey: false,
    queue: false,
    migrations: false,
    restartOnChange: false,
    unique: false,
  },
  nestjs: {
    imports: [
      HttpPathsRegistration(
        { prefix: '/mcp', include: { authBasic: false } },
        { prefix: 'mcp', include: { authApiKey: true } },
      ),
    ],
    controllers: [McpController],
    providers: [McpService, McpAppService],
  },
  Service: McpAppService,
};

export default McpAppModule;
