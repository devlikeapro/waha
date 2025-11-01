import { ApiProperty } from '@nestjs/swagger';
import { BooleanString } from '@waha/nestjs/validation/BooleanString';
import { IsDynamicObject } from '@waha/nestjs/validation/IsDynamicObject';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { WAHASessionStatus } from './enums.dto';
import { ChatIdProperty } from './properties.dto';
import { WebhookConfig } from './webhooks.config.dto';

/**
 * Queries
 */
export class ListSessionsQuery {
  @ApiProperty({
    example: false,
    required: false,
    description:
      'Return all sessions, including those that are in the STOPPED state.',
  })
  @Transform(BooleanString)
  @IsBoolean()
  @IsOptional()
  all?: boolean;
}

/**
 * Requests
 */
export class ProxyConfig {
  @ApiProperty({
    example: 'localhost:3128',
  })
  @IsString()
  server: string;

  @ApiProperty({
    example: null,
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    example: null,
  })
  @IsString()
  @IsOptional()
  password?: string;
}

export class NowebStoreConfig {
  @ApiProperty({
    description:
      'Enable or disable the store for contacts, chats, and messages.',
    example: true,
  })
  @IsBoolean()
  enabled: boolean = false;

  @ApiProperty({
    description:
      'Enable full sync on session initialization (when scanning QR code).\n' +
      'Full sync will download all contacts, chats, and messages from the phone.\n' +
      'If disabled, only messages early than 90 days will be downloaded and some contacts may be missing.',
  })
  @IsBoolean()
  fullSync: boolean = false;
}

export class NowebConfig {
  @ValidateNested()
  @Type(() => NowebStoreConfig)
  @IsOptional()
  store?: NowebStoreConfig;

  @ApiProperty({
    description: 'Mark the session as online when it connects to the server.',
  })
  @IsBoolean()
  markOnline: boolean = true;
}

export class WebjsConfig {
  @ApiProperty({
    description:
      "Enable emission of special 'tag:*' engine events required for presence.update and message.ack.\n" +
      'WARNING: Enabling this may have performance and stability impact. Disabled by default.',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  tagsEventsOn?: boolean = false;
}

export class IgnoreConfig {
  @ApiProperty({
    description: 'Ignore a status@broadcast (stories) events',
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @ApiProperty({
    description: 'Ignore groups events',
  })
  @IsBoolean()
  @IsOptional()
  groups?: boolean;

  @ApiProperty({
    description: 'Ignore channels events',
  })
  @IsBoolean()
  @IsOptional()
  channels?: boolean;

  @ApiProperty({
    description: 'Ignore broadcast events (broadcast list and status)',
  })
  @IsBoolean()
  @IsOptional()
  broadcast?: boolean;
}

export class SessionConfig {
  @ValidateNested({ each: true })
  @Type(() => WebhookConfig)
  @IsArray()
  @IsOptional()
  webhooks?: WebhookConfig[];

  @ApiProperty({
    example: {
      'user.id': '123',
      'user.email': 'email@example.com',
    },
    description:
      "Metadata for the session. You'll get 'metadata' in all webhooks.",
    required: false,
  })
  @IsDynamicObject()
  @IsOptional()
  metadata?: Record<string, string>;

  @ApiProperty({
    example: null,
  })
  @ValidateNested()
  @Type(() => ProxyConfig)
  @IsOptional()
  proxy?: ProxyConfig;

  @ApiProperty({
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  debug?: boolean;

  @ApiProperty({
    example: {
      status: null,
      groups: null,
      channels: null,
    },
    description: 'Ignore some events related to specific chats',
  })
  @ValidateNested()
  @Type(() => IgnoreConfig)
  @IsOptional()
  ignore?: IgnoreConfig;

  @ApiProperty({
    example: {
      store: {
        enabled: true,
        fullSync: false,
      },
    },
  })
  @ValidateNested()
  @Type(() => NowebConfig)
  @IsOptional()
  noweb?: NowebConfig;

  @ApiProperty({
    description: 'WebJS-specific settings.',
    required: false,
  })
  @ValidateNested()
  @Type(() => WebjsConfig)
  @IsOptional()
  webjs?: WebjsConfig;
}

export class SessionDTO {
  @ApiProperty({
    example: 'default',
    description: 'Session name (id)',
  })
  @IsString()
  name: string;

  status: WAHASessionStatus;
  config?: SessionConfig;
}

export class MeInfo {
  @ChatIdProperty()
  id: string;

  @ApiProperty({
    example: '123123@lid',
  })
  lid?: string;

  @ApiProperty({
    example: '123123:123@s.whatsapp.net',
    description: 'Your id with device number',
  })
  jid?: string;

  pushName: string;
}

export class SessionInfo extends SessionDTO {
  me?: MeInfo;
  assignedWorker?: string;
  lastActivityTimestamp?: number; // Timestamp of the last activity in milliseconds
}

export class SessionDetailedInfo extends SessionInfo {
  engine?: any;
}

// Affect almost all Databases - Sqlite, MongoDB, Postgres.
const DB_NAME_LIMIT = 64;
const DB_NAME_MAX_PREFIX_LEN = 'waha_noweb'.length;

export class SessionCreateRequest {
  @ApiProperty({
    example: 'default',
    description: 'Session name (id)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(DB_NAME_LIMIT - DB_NAME_MAX_PREFIX_LEN)
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message:
      'Session name can only contain alphanumeric characters, hyphens, and underscores (a-z, A-Z, 0-9, -, _) or be empty',
  })
  name: string | undefined;

  @ValidateNested()
  @Type(() => SessionConfig)
  @IsOptional()
  config?: SessionConfig;

  @ApiProperty({
    description: 'Start session after creation',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  start?: boolean;
}

export class SessionUpdateRequest {
  @ValidateNested()
  @Type(() => SessionConfig)
  @IsOptional()
  config?: SessionConfig;
}
