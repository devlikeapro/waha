import { ApiProperty } from '@nestjs/swagger';

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
  all: boolean;
}

/**
 * Requests
 */
export class ProxyConfig {
  @ApiProperty({
    example: 'localhost:3128',
  })
  server: string;

  @ApiProperty({
    example: null,
  })
  username?: string;

  @ApiProperty({
    example: null,
  })
  password?: string;
}

export class NowebStoreConfig {
  @ApiProperty({
    description:
      'Enable or disable the store for contacts, chats, and messages.',
  })
  enabled: boolean = false;

  @ApiProperty({
    description:
      'Enable full sync on session initialization (when scanning QR code).\n' +
      'Full sync will download all contacts, chats, and messages from the phone.\n' +
      'If disabled, only messages early than 90 days will be downloaded and some contacts may be missing.',
  })
  fullSync: boolean = false;
}

export class NowebConfig {
  store?: NowebStoreConfig;
}

export class SessionConfig {
  webhooks?: WebhookConfig[];

  @ApiProperty({
    example: null,
  })
  proxy?: ProxyConfig;

  debug: boolean = false;

  @ApiProperty({
    example: {
      store: {
        enabled: true,
        fullSync: false,
      },
    },
  })
  noweb?: NowebConfig;
}

export class SessionStartRequest {
  name = 'default';
  config?: SessionConfig;
}

export class SessionStopRequest {
  name = 'default';
  @ApiProperty({
    example: false,
    required: false,
    description: 'Stop and logout from the session.',
  })
  logout = false;
}

export class SessionLogoutRequest {
  name = 'default';
}

export class SessionDTO {
  name = 'default';
  status: WAHASessionStatus;
  config?: SessionConfig;
}

export class MeInfo {
  @ChatIdProperty()
  id: string;

  pushName: string;
}

export class SessionInfo extends SessionDTO {
  me?: MeInfo;
  engine?: any;
}
