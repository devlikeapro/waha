import { ApiProperty } from '@nestjs/swagger';
import { App } from '@waha/apps/app_sdk/dto/app.dto';
import { BooleanString } from '@waha/nestjs/validation/BooleanString';
import { IsDynamicObject } from '@waha/nestjs/validation/IsDynamicObject';
import { SessionName } from '@waha/nestjs/validation/SessionName';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { WAHAPresenceStatus, WAHASessionStatus } from './enums.dto';
import { ChatIdProperty } from './properties.dto';
import { WebhookConfig } from './webhooks.config.dto';

/**
 * Queries
 */
export enum SessionExpand {
  apps = 'apps',
}

export class SessionExpandQuery {
  @ApiProperty({
    required: false,
    type: String,
    enum: SessionExpand,
    isArray: true,
    description: 'Expand additional session details.',
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsEnum(SessionExpand, { each: true })
  @IsOptional()
  expand?: SessionExpand[];
}

export class ListSessionsQuery extends SessionExpandQuery {
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

export class SessionInfoQuery extends SessionExpandQuery {}

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

export class GowsStorageConfig {
  @ApiProperty({
    description:
      'Store messages locally. Set to false to disable; omit or null to keep enabled.',
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  messages?: boolean | null;

  @ApiProperty({
    description:
      'Store groups locally. Set to false to disable; omit or null to keep enabled.',
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  groups?: boolean | null;

  @ApiProperty({
    description:
      'Store chats locally. Set to false to disable; omit or null to keep enabled.',
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  chats?: boolean | null;

  @ApiProperty({
    description:
      'Store labels locally. Set to false to disable; omit or null to keep enabled.',
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  labels?: boolean | null;

  @ApiProperty({
    description:
      'Store contacts locally. Set to false to disable; omit or null to keep enabled. ' +
      'When disabled: contacts API returns no data, no contact names in chats, ' +
      'no PushName/BusinessName events, and sending status to all contacts does not work.',
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  contacts?: boolean | null;

  @ApiProperty({
    description:
      'Store message secrets locally. Set to false to disable; omit or null to keep enabled. ' +
      'When disabled: incoming poll votes, event responses and bot messages can not be decrypted, ' +
      'and sending own poll votes does not work.',
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  messageSecrets?: boolean | null;
}

export class GowsConfig {
  @ValidateNested()
  @Type(() => GowsStorageConfig)
  @IsOptional()
  storage?: GowsStorageConfig;
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

export class ClientSessionConfig {
  @IsString()
  @IsOptional()
  deviceName?: string;

  @IsString()
  @IsOptional()
  browserName?: string;
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
    description:
      "How connected session renders in device - in format 'Browser (Device)' - Firefox (MacOS)",
    example: {
      browserName: 'Firefox',
      deviceName: 'MacOS',
    },
  })
  @ValidateNested()
  @Type(() => ClientSessionConfig)
  @IsOptional()
  client?: ClientSessionConfig;

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
    example: {
      storage: {
        messages: true,
        groups: true,
        chats: true,
        labels: true,
        contacts: true,
        messageSecrets: true,
      },
    },
  })
  @ValidateNested()
  @Type(() => GowsConfig)
  @IsOptional()
  gows?: GowsConfig;

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

/**
 * Enforcement types as listed in the WhatsApp Web app (WAWebUserPrefsTypes.ReachoutTimelockEnforcementType).
 * WhatsApp may introduce new values at any time - treat it as an open set.
 */
export enum ReachoutTimelockEnforcementType {
  // No restriction
  DEFAULT = 'DEFAULT',
  BIZ_QUALITY = 'BIZ_QUALITY',
  BIZ_COMMERCE_VIOLATION_ADULT = 'BIZ_COMMERCE_VIOLATION_ADULT',
  BIZ_COMMERCE_VIOLATION_ALCOHOL = 'BIZ_COMMERCE_VIOLATION_ALCOHOL',
  BIZ_COMMERCE_VIOLATION_ANIMALS = 'BIZ_COMMERCE_VIOLATION_ANIMALS',
  BIZ_COMMERCE_VIOLATION_BODY_PARTS_FLUIDS = 'BIZ_COMMERCE_VIOLATION_BODY_PARTS_FLUIDS',
  BIZ_COMMERCE_VIOLATION_DATING = 'BIZ_COMMERCE_VIOLATION_DATING',
  BIZ_COMMERCE_VIOLATION_DIGITAL_SERVICES_PRODUCTS = 'BIZ_COMMERCE_VIOLATION_DIGITAL_SERVICES_PRODUCTS',
  BIZ_COMMERCE_VIOLATION_DRUGS = 'BIZ_COMMERCE_VIOLATION_DRUGS',
  BIZ_COMMERCE_VIOLATION_DRUGS_ONLY_OTC = 'BIZ_COMMERCE_VIOLATION_DRUGS_ONLY_OTC',
  BIZ_COMMERCE_VIOLATION_GAMBLING = 'BIZ_COMMERCE_VIOLATION_GAMBLING',
  BIZ_COMMERCE_VIOLATION_HEALTHCARE = 'BIZ_COMMERCE_VIOLATION_HEALTHCARE',
  BIZ_COMMERCE_VIOLATION_REAL_FAKE_CURRENCY = 'BIZ_COMMERCE_VIOLATION_REAL_FAKE_CURRENCY',
  BIZ_COMMERCE_VIOLATION_SUPPLEMENTS = 'BIZ_COMMERCE_VIOLATION_SUPPLEMENTS',
  BIZ_COMMERCE_VIOLATION_TOBACCO = 'BIZ_COMMERCE_VIOLATION_TOBACCO',
  BIZ_COMMERCE_VIOLATION_VIOLENT_CONTENT = 'BIZ_COMMERCE_VIOLATION_VIOLENT_CONTENT',
  BIZ_COMMERCE_VIOLATION_WEAPONS = 'BIZ_COMMERCE_VIOLATION_WEAPONS',
  WEB_COMPANION_ONLY = 'WEB_COMPANION_ONLY',
  RESTRICT_ALL_COMPANIONS = 'RESTRICT_ALL_COMPANIONS',
}

export class ReachoutTimelockData {
  @ApiProperty({
    example: ReachoutTimelockEnforcementType.RESTRICT_ALL_COMPANIONS,
    enum: ReachoutTimelockEnforcementType,
    description:
      'Raw WhatsApp enforcement type. Informational only - it does not change what is blocked. ' +
      'WhatsApp may introduce new values, so treat it as an open set.',
  })
  enforcementType: ReachoutTimelockEnforcementType;

  @ApiProperty({
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    example: 1784477333,
    nullable: true,
    description: 'Unix timestamp (seconds) when the enforcement ends.',
  })
  timeEnforcementEnds: number | null;
}

/**
 * Capping status for the per-cycle new-chat message quota.
 * WhatsApp may introduce new values at any time - treat it as an open set.
 */
export enum MessageCappingStatus {
  NONE = 'NONE',
  FIRST_WARNING = 'FIRST_WARNING',
  SECOND_WARNING = 'SECOND_WARNING',
  CAPPED = 'CAPPED',
}

export class MessageCappingData {
  @ApiProperty({
    example: MessageCappingStatus.FIRST_WARNING,
    enum: MessageCappingStatus,
    description:
      'How close the account is to its new-chat quota. ' +
      'CAPPED means new chats are blocked. WhatsApp may introduce new values, ' +
      'so treat it as an open set.',
  })
  cappingStatus: MessageCappingStatus;

  @ApiProperty({
    example: 1000,
    description:
      'New-chat messages allowed in the current cycle. -1 when the account ' +
      'has no cap.',
  })
  totalQuota: number;

  @ApiProperty({
    example: 640,
    description: 'New-chat messages already used in the current cycle.',
  })
  usedQuota: number;

  @ApiProperty({
    example: 1782874800,
    nullable: true,
    description: 'Unix timestamp (seconds) when the current cycle started.',
  })
  cycleStart: number | null;

  @ApiProperty({
    example: 1785553199,
    nullable: true,
    description: 'Unix timestamp (seconds) when the current cycle ends.',
  })
  cycleEnd: number | null;

  @ApiProperty({
    example: 'NOT_ELIGIBLE',
    nullable: true,
    description: 'Meta Verified status. Informational.',
  })
  mvStatus: string | null;

  @ApiProperty({
    example: 'NOT_ELIGIBLE',
    nullable: true,
    description: 'One-time engagement status. Informational.',
  })
  oteStatus: string | null;
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

  @ApiProperty({
    required: false,
    nullable: true,
    description:
      'WhatsApp reachout timelock (account restriction) info. ' +
      'Null if no enforcement has been seen for the account.',
  })
  reachoutTimelock?: ReachoutTimelockData | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description:
      'WhatsApp new-chat message capping (per-cycle quota) info. ' +
      'Null until the capping state has been fetched for the account.',
  })
  messageCapping?: MessageCappingData | null;
}

export class SessionInfo extends SessionDTO {
  me?: MeInfo;
  assignedWorker?: string;
  // Timestamp of the last activity in milliseconds
  presence: WAHAPresenceStatus.ONLINE | WAHAPresenceStatus.OFFLINE | null;
  timestamps: {
    activity: number | null;
  };

  @ApiProperty({
    description: 'Apps configured for the session.',
    required: false,
    isArray: true,
    type: App,
    nullable: true,
  })
  apps?: App[];
}

export class SessionDetailedInfo extends SessionInfo {
  engine?: any;
}

export { SessionName };

export class SessionCreateRequest {
  @ApiProperty({
    example: 'default',
    description: 'Session name (id)',
    required: false,
  })
  @IsOptional()
  @SessionName()
  name: string | undefined;

  @ValidateNested()
  @Type(() => SessionConfig)
  @IsOptional()
  config?: SessionConfig;

  @ApiProperty({
    description: 'Apps to be synchronized for this session.',
    required: false,
    isArray: true,
    type: App,
    nullable: true,
  })
  @ValidateNested({ each: true })
  @Type(() => App)
  @IsArray()
  @IsOptional()
  apps?: App[] | null;

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

  @ApiProperty({
    description: 'Apps to be synchronized for this session.',
    required: false,
    isArray: true,
    type: App,
    nullable: true,
  })
  @ValidateNested({ each: true })
  @Type(() => App)
  @IsArray()
  @IsOptional()
  apps?: App[] | null;
}

export class SessionLogoutAppsOptions {
  @ApiProperty({
    description:
      "Purge the session apps' storage (messages, caches) as part of logout.",
    required: false,
    default: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  purge?: boolean;
}

export class SessionLogoutRequest {
  @ApiProperty({
    description: 'Options for the session apps during logout.',
    required: false,
    type: SessionLogoutAppsOptions,
  })
  @ValidateNested()
  @Type(() => SessionLogoutAppsOptions)
  @IsOptional()
  apps?: SessionLogoutAppsOptions;
}
