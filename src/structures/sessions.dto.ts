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

export class SessionConfig {
  webhooks?: WebhookConfig[];
  @ApiProperty({
    example: null,
  })
  proxy?: ProxyConfig;
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
}
