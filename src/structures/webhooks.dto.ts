import { ApiProperty } from '@nestjs/swagger';

import { WAHAEngine, WAHAEvents, WAMessageAck } from './enums.dto';
import { WAMessage } from './responses.dto';

export class WAMessageAckBody {
  @ApiProperty({
    description: 'Message ID',
    example: 'false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA',
  })
  id: string;
  from: string;
  to: string;
  participant: string;
  fromMe: boolean;
  ack: WAMessageAck;
  ackName: string;
}

export class WAGroupPayload {
  @ApiProperty({
    description: 'ID that represents the groupNotification',
  })
  id: any;

  @ApiProperty({
    description: 'Unix timestamp for when the groupNotification was created',
  })
  timestamp: number;

  @ApiProperty({
    description: 'ID for the Chat that this groupNotification was sent for',
  })
  chatId: string;

  @ApiProperty({
    description: 'ContactId for the user that produced the GroupNotification',
  })
  author: string;

  @ApiProperty({
    description: 'Extra content',
  })
  body: string;

  @ApiProperty({
    description:
      'Contact IDs for the users that were affected by this GroupNotification',
  })
  recipientIds: string[];
}

export class WAWebhook {
  event: WAHAEvents;
  session: string;
  engine: WAHAEngine;
  // eslint-disable-next-line @typescript-eslint/ban-types
  payload: WAMessage | WAGroupPayload | WAMessageAckBody | object;
}
