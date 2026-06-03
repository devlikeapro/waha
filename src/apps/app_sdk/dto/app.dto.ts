import { ChatWootAppConfig } from '@waha/apps/chatwoot/dto/config.dto';
import { CallsAppConfig } from '@waha/apps/calls/dto/config.dto';
import { McpAppConfig } from '@waha/apps/mcp/dto/config.dto';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { AppName } from '@waha/apps/app_sdk/apps/name';

export type AllowedAppConfig =
  | ChatWootAppConfig
  | CallsAppConfig
  | McpAppConfig;

@ApiExtraModels(ChatWootAppConfig, CallsAppConfig, McpAppConfig)
export class App<T extends AllowedAppConfig = any> {
  @IsString()
  id: string;

  @IsString()
  session: string;

  // App name (aka type)
  @IsEnum(AppName)
  app: AppName;

  @ApiProperty({
    description:
      'Enable or disable this app without deleting it. If omitted, treated as enabled (true).',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean = true;

  @ValidateNested()
  @Type((options) => {
    if (options && options.object && options.object.app) {
      switch (options.object.app) {
        case AppName.chatwoot:
          return ChatWootAppConfig;
        case AppName.calls:
          return CallsAppConfig;
        case AppName.mcp:
          return McpAppConfig;
        default:
          return Object;
      }
    }
    return Object;
  })
  config: T;
}

export class ChatWootAppDto extends App<ChatWootAppConfig> {
  @Type(() => ChatWootAppConfig)
  config: ChatWootAppConfig;
}

export class CallsAppDto extends App<CallsAppConfig> {
  @Type(() => CallsAppConfig)
  config: CallsAppConfig;
}

export class McpAppDto extends App<McpAppConfig> {
  @Type(() => McpAppConfig)
  config: McpAppConfig;
}

export type AppDto = ChatWootAppDto | CallsAppDto | McpAppDto;
