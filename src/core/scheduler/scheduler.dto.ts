import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  VOICE = 'voice',
  VIDEO = 'video',
}

export class ScheduleMessageRequest {
  @ApiProperty({ description: 'Unique ID for the job. If empty, one will be generated.' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Date to execute', example: '2026-01-31T23:59:59Z' })
  @IsDateString()
  executeAt: string;

  @ApiProperty({ description: 'Type of message', enum: MessageType })
  @IsEnum(MessageType)
  type: MessageType;

  @ApiProperty({ description: 'Payload depending on type', example: { session: 'default', chatId: '123123@c.us', text: 'Hello' } })
  @IsObject()
  payload: any;
}
