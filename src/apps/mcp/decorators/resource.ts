import type { ResourceMetadata } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpController } from '@waha/apps/mcp/decorators/controller';

export const RESOURCES_KEY = Symbol('waha:mcp:resources');
export const RESOURCE_TEMPLATES_KEY = Symbol('waha:mcp:resource-templates');

export interface ResourceDef {
  name: string;
  uri: string;
  config: ResourceMetadata;
  method: string;
}

export interface ResourceTemplateDef {
  name: string;
  uriTemplate: string;
  config: ResourceMetadata;
  method: string;
}

export function Resource(
  name: string,
  uri: string,
  config: ResourceMetadata = {},
) {
  return (target: object, propertyKey: string) => {
    const defs: ResourceDef[] = (target as any)[RESOURCES_KEY] ?? [];
    defs.push({ name, uri, config, method: propertyKey });
    (target as any)[RESOURCES_KEY] = defs;
  };
}

export function ResourceTemplate(
  name: string,
  uriTemplate: string,
  config: ResourceMetadata = {},
) {
  return (target: object, propertyKey: string) => {
    const defs: ResourceTemplateDef[] =
      (target as any)[RESOURCE_TEMPLATES_KEY] ?? [];
    defs.push({ name, uriTemplate, config, method: propertyKey });
    (target as any)[RESOURCE_TEMPLATES_KEY] = defs;
  };
}

export function getResources(controller: McpController): ResourceDef[] {
  return (controller as any)[RESOURCES_KEY] ?? [];
}

export function getResourceTemplates(
  controller: McpController,
): ResourceTemplateDef[] {
  return (controller as any)[RESOURCE_TEMPLATES_KEY] ?? [];
}
