import { ApiProperty } from '@nestjs/swagger';

import { WAHASessionStatus } from './enums.dto';
import { WebhookConfig } from './webhooks.dto';

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
export class SessionConfig {
  webhooks?: WebhookConfig[];
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
  config: SessionConfig;
}
