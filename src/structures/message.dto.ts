import { ApiProperty } from '@nestjs/swagger';
import {
  ChatIdProperty,
  MessageIdOnlyProperty,
} from '@waha/structures/properties.dto';

export class ReplyToMessage {
  @MessageIdOnlyProperty()
  id: string;

  @ChatIdProperty()
  participant?: string;

  @ApiProperty({
    example: 'Hello!',
  })
  body?: string;
}
