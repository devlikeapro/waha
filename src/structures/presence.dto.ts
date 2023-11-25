import { ApiProperty } from '@nestjs/swagger';

import { WAHAPresenceStatus } from './enums.dto';

export class WAHAPresenceData {
  @ApiProperty({
    description: 'Chat ID - participant or contact id',
    example: '11111111111@c.us',
  })
  participant: string;

  lastKnownPresence: WAHAPresenceStatus;
  @ApiProperty({
    example: 1686568773,
  })
  lastSeen?: number;
}
export class WAHAChatPresences {
  @ApiProperty({
    description: 'Chat ID - either group id or contact id',
    example: '11111111111@c.us',
  })
  id: string;

  presences: WAHAPresenceData[];
}

export class WAHASessionPresence {
  presence: WAHAPresenceStatus;

  @ApiProperty({
    description: 'Chat ID - either group id or contact id',
    example: '11111111111@c.us',
  })
  chatId: string;
}
