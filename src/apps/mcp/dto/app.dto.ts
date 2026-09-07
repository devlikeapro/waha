import { App } from '@waha/apps/app_sdk/dto/app.dto';
import { McpAppConfig } from '@waha/apps/mcp/dto/config.dto';
import { Type } from 'class-transformer';

export class McpAppDto extends App<McpAppConfig> {
  @Type(() => McpAppConfig)
  config: McpAppConfig;
}
