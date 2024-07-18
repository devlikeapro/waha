import { ApiProperty } from '@nestjs/swagger';
import { ChatIdProperty } from '@waha/structures/properties.dto';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

import { SessionQuery } from './base.dto';

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

export class GetChatsQuery {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number;
}

/**
 * Events
 */

export class ChatArchiveEvent {
  @ChatIdProperty()
  id: string;

  archived: boolean;

  timestamp: number;
}
