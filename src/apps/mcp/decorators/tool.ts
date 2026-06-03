import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpController } from '@waha/apps/mcp/decorators/controller';

export const TOOLS_KEY = Symbol('waha:mcp:tools');
export type ToolConfig = Parameters<McpServer['registerTool']>[1];

export interface ToolDef {
  name: string;
  config: ToolConfig;
  method: string;
}

export function Tool(name: string, config: ToolConfig) {
  return (target: object, propertyKey: string) => {
    const defs: ToolDef[] = (target as any)[TOOLS_KEY] ?? [];
    defs.push({ name, config, method: propertyKey });
    (target as any)[TOOLS_KEY] = defs;
  };
}

export function getTools(controller: McpController): ToolDef[] {
  return (controller as any)[TOOLS_KEY] ?? [];
}
