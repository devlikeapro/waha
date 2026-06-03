import { McpController } from '@waha/apps/mcp/api/mcp.controller';
import { McpService } from '@waha/apps/mcp/mcp.service';
import { McpAppService } from '@waha/apps/mcp/services/McpAppService';

export const McpModuleExports = {
  imports: [],
  controllers: [McpController],
  providers: [McpService, McpAppService],
};
