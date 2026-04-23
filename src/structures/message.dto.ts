import { ApiProperty } from '@nestjs/swagger';
import {
  ChatIdProperty,
  MessageIdOnlyProperty,
} from '@waha/structures/properties.dto';
import { WAMedia } from '@waha/structures/media.dto';

export class ReplyToMessage {
  @MessageIdOnlyProperty()
  id: string;

  @ChatIdProperty()
  participant?: string;

  @ApiProperty({
    example: 'Hello!',
  })
  body?: string;

  @ApiProperty({
    description: 'Indicates if the message has media available for download',
  })
  hasMedia: boolean;

  @ApiProperty({
    description: 'Media object for the message if any and downloaded',
  })
  media?: WAMedia;

  @ApiProperty({
    description: "Raw data from reply's message",
  })
  _data?: any;
}
