import { App } from '@waha/apps/app_sdk/dto/app.dto';
import { ChatWootAppConfig } from '@waha/apps/chatwoot/dto/config.dto';
import { Type } from 'class-transformer';

export class ChatWootAppDto extends App<ChatWootAppConfig> {
  @Type(() => ChatWootAppConfig)
  config: ChatWootAppConfig;
}
