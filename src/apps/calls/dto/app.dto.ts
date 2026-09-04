import { App } from '@waha/apps/app_sdk/dto/app.dto';
import { CallsAppConfig } from '@waha/apps/calls/dto/config.dto';
import { Type } from 'class-transformer';

export class CallsAppDto extends App<CallsAppConfig> {
  @Type(() => CallsAppConfig)
  config: CallsAppConfig;
}
