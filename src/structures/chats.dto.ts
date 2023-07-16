import { ApiProperty } from '@nestjs/swagger';

import { SessionBaseRequest, SessionQuery } from './base.dto';

/**
 * Queries
 */

export class GetChatMessagesQuery extends SessionQuery {
  limit: number = 100;
  @ApiProperty({
    example: true,
    required: false,
    description: 'Download media for messages',
  })
  downloadMedia: boolean = true;
}

/**
 * Requests
 */
