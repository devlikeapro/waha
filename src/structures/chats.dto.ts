import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { BooleanString } from '@waha/nestjs/validation/BooleanString';
import { CommaSeparatedStrings } from '@waha/nestjs/validation/CommaSeparatedStrings';
import { WAMessageAck, WAMessageAckName } from '@waha/structures/enums.dto';
import {
  LimitOffsetParams,
  PaginationParams,
} from '@waha/structures/pagination.dto';
import {
  ChatIdProperty,
  MessageIdProperty,
} from '@waha/structures/properties.dto';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

/**
 * Queries
 */

export class GetChatMessagesFilter {
  @ApiProperty({
    required: false,
    description: 'Filter messages before this timestamp (inclusive)',
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  'filter.timestamp.lte'?: number;

  @ApiProperty({
    required: false,
    description: 'Filter messages after this timestamp (inclusive)',
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  'filter.timestamp.gte'?: number;

  @ApiProperty({
    required: false,
    description: 'From me filter (by default shows all messages)',
  })
  @Transform(BooleanString)
  @IsBoolean()
  @IsOptional()
  'filter.fromMe'?: boolean;

  @ApiProperty({
    required: false,
    description: 'Filter messages by acknowledgment status',
    enum: WAMessageAckName,
  })
  @IsEnum(WAMessageAckName)
  @IsOptional()
  'filter.ack'?: WAMessageAck;
}

export function transformAck(
  filter: GetChatMessagesFilter,
): GetChatMessagesFilter {
  if (!filter) return filter;
  if (!filter['filter.ack']) return filter;
  const ackName = filter['filter.ack'];
  // @ts-ignore
  const ack: WAMessageAck = WAMessageAck[ackName];
  if (ack == null) {
    throw new BadRequestException(`Invalid ack: '${ackName}'`);
  }
  filter['filter.ack'] = ack;
  return filter;
}

export class ChatPictureQuery {
  @Transform(BooleanString)
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    example: false,
    required: false,
    description:
      'Refresh the picture from the server (24h cache by default). Do not refresh if not needed, you can get rate limit error',
  })
  refresh?: boolean = false;
}

export class ChatPictureResponse {
  url: string;
}

export enum MessageSortField {
  TIMESTAMP = 'timestamp',
  MESSAGE_TIMESTAMP = 'messageTimestamp',
}

export class GetChatMessagesQuery extends PaginationParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit: number = 10;

  @ApiProperty({
    description: 'Sort by field',
    enum: MessageSortField,
  })
  @IsOptional()
  @IsEnum(MessageSortField)
  sortBy?: string = MessageSortField.TIMESTAMP;

  @ApiProperty({
    required: false,
    description: 'Download media for messages',
  })
  @Transform(BooleanString)
  @IsBoolean()
  @IsOptional()
  downloadMedia?: boolean;

  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
    description: 'Download only media with these mimetypes (prefix match)',
  })
  @Transform(CommaSeparatedStrings)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  downloadMediaMimetypes?: string[];

  @ApiProperty({
    example: true,
    required: false,
    description:
      'Merge LID (@lid) and phone-number (@c.us) chats referencing the same contact',
  })
  @Transform(BooleanString)
  @IsBoolean()
  @IsOptional()
  merge?: boolean = true;
}

export class ReadChatMessagesQuery {
  @ApiProperty({
    example: 30,
    required: false,
    description: 'How much messages to read (latest first)',
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  messages: number;

  @ApiProperty({
    required: false,
    description: 'How much days to read (latest first)',
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  days: number = 7;
}

export class ReadChatMessagesResponse {
  @ApiProperty({
    required: false,
    description: 'Messages IDs that have been read',
  })
  ids?: string[];
}

export class DeleteChatQuery {
  @ApiProperty({
    required: false,
    default: false,
    description:
      'Also delete the media of the chat from the phone gallery, like "Delete ' +
      'media in this chat from your device gallery" on the phone: the photos, ' +
      "videos and files saved in the phone's gallery go too, irreversibly " +
      '(GOWS only). It does not change what happens on the server, see purge.',
  })
  @Transform(BooleanString)
  @IsBoolean()
  @IsOptional()
  deleteMedia?: boolean = false;

  @ApiProperty({
    required: false,
    description:
      'Clear the chat from the server once deleted: the messages GOWS stored ' +
      'for it. Omit to follow the session setting ' +
      'config.gows.storage.purgeDeletedChats (true by default). Applies to ' +
      'this deletion only, never to one made on the phone (GOWS only)',
  })
  @Transform(BooleanString)
  @IsBoolean()
  @IsOptional()
  purge?: boolean;
}

export class DeleteChatLastMessage {
  @MessageIdProperty()
  id: string;

  @ApiProperty({
    description: 'When the message was sent (unix time, seconds)',
    example: 1760000000,
  })
  timestamp: number;
}

export class DeleteChatRange {
  @ChatIdProperty({
    description:
      'The id the deletion was sent to: the chat, or the other id (phone number or LID) of a direct chat',
  })
  chatId: string;

  @ApiProperty({
    description:
      'Messages sent up to this time (unix time, seconds) are deleted, newer ones are kept',
    example: 1760000000,
  })
  lastMessageTimestamp: number;

  @ApiProperty({
    type: DeleteChatLastMessage,
    nullable: true,
    description:
      'The last message stored under this id, sent to WhatsApp as the end of the range; null when none is stored (the range then ends when the chat was deleted)',
  })
  lastMessage: DeleteChatLastMessage | null;
}

export class DeleteChatResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ChatIdProperty({ description: 'The chat, as requested' })
  id: string;

  @ApiProperty({
    description:
      'Whether WhatsApp was asked to delete the media from the phone gallery too',
  })
  deleteMedia: boolean;

  @ApiProperty({
    description:
      'Whether the chat is cleared from the server (the messages GOWS stored) ' +
      'when the deletion comes back from WhatsApp',
  })
  purge: boolean;

  @ApiProperty({
    description:
      'false when WhatsApp accepted the deletion but reading it back failed: ' +
      'the chat is deleted for the account, the stored messages go once it ' +
      'is read again, retried in the background and on the next sync',
  })
  confirmed: boolean;

  @ApiProperty({
    type: [DeleteChatRange],
    description:
      'One per id the deletion was sent to, the one the phone uses first: ' +
      'the chat and, for a direct chat, its other id (phone number or LID) when known',
  })
  ranges: DeleteChatRange[];
}

export class GetChatMessageQuery {
  @ApiProperty({
    required: false,
    description: 'Download media for messages',
  })
  @Transform(BooleanString)
  @IsBoolean()
  @IsOptional()
  downloadMedia?: boolean;

  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
    description: 'Download only media with these mimetypes (prefix match)',
  })
  @Transform(CommaSeparatedStrings)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  downloadMediaMimetypes?: string[];

  @ApiProperty({
    example: true,
    required: false,
    description:
      'Merge LID (@lid) and phone-number (@c.us) chats referencing the same contact',
  })
  @Transform(BooleanString)
  @IsBoolean()
  @IsOptional()
  merge?: boolean = true;
}

export enum ChatSortField {
  CONVERSATION_TIMESTAMP = 'conversationTimestamp',
  ID = 'id',
  NAME = 'name',
}

export class ChatsPaginationParams extends PaginationParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  @ApiProperty({
    description: 'Sort by field',
    enum: ChatSortField,
  })
  @IsOptional()
  @IsEnum(ChatSortField)
  sortBy?: string;
}

export class GetChatsParams extends ChatsPaginationParams {
  @ApiProperty({
    example: true,
    required: false,
    description:
      'Merge LID (@lid) and phone-number (@c.us) chats referencing the same contact',
  })
  @Transform(BooleanString)
  @IsBoolean()
  @IsOptional()
  merge?: boolean = true;
}

export enum PinDuration {
  DAY = 86400,
  WEEK = 604800,
  MONTH = 2592000,
}

export class PinMessageRequest {
  @IsNumber()
  @IsEnum(PinDuration)
  @ApiProperty({
    description:
      'Duration in seconds. 24 hours (86400), 7 days (604800), 30 days (2592000)',
    example: 86400,
  })
  duration: number;
}

export class OverviewPaginationParams extends LimitOffsetParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;
}

export class GetChatsOverviewParams extends OverviewPaginationParams {
  @ApiProperty({
    example: true,
    required: false,
    description:
      'Merge LID (@lid) and phone-number (@c.us) chats referencing the same contact',
  })
  @Transform(BooleanString)
  @IsBoolean()
  @IsOptional()
  merge?: boolean = true;
}

export class OverviewFilter {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(CommaSeparatedStrings)
  @ApiProperty({
    description: 'Filter by chat ids',
    required: false,
    example: ['111111111@c.us'],
  })
  ids?: string[];
}

export class OverviewBodyRequest {
  @IsDefined()
  @ValidateNested()
  @Type(() => GetChatsOverviewParams)
  pagination: GetChatsOverviewParams;

  @IsOptional()
  @ValidateNested()
  @Type(() => OverviewFilter)
  filter?: OverviewFilter;
}

export class ChatSummary {
  id: string;
  name: string | null;
  picture: string | null;
  lastMessage: any;
  _chat: any;
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
