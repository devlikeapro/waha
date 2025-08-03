import { ChatWootAPIConfig } from '@waha/apps/chatwoot/client/interfaces';
import { DEFAULT_LOCALE, LOCALES } from '@waha/apps/chatwoot/locale';
import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class ChatWootAppConfig implements ChatWootAPIConfig {
  @IsString()
  url: string;

  @IsNumber()
  accountId: number;

  @IsString()
  accountToken: string;

  @IsNumber()
  inboxId: number;

  @IsString()
  inboxIdentifier: string;

  @IsString()
  @IsIn(LOCALES)
  locale: string = DEFAULT_LOCALE;

  @IsBoolean()
  @IsOptional()
  disableServerCommands: boolean = false;
}
