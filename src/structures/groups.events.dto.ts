import { ApiProperty } from '@nestjs/swagger';

import { GroupId, GroupInfo, GroupParticipant } from './groups.dto';

/**
 * Happens when you join or are added to a group.
 */
export class GroupV2JoinEvent {
  @ApiProperty({
    description: 'Unix timestamp',
    example: 1666943582,
  })
  timestamp: number;

  group: GroupInfo;

  _data: any;
}

/**
 * Happens when you leave or are removed from a group.
 */
export class GroupV2LeaveEvent {
  @ApiProperty({
    description: 'Unix timestamp',
    example: 1666943582,
  })
  timestamp: number;

  group: GroupId;

  _data: any;
}

export class GroupV2UpdateEvent {
  @ApiProperty({
    description: 'Unix timestamp',
    example: 1666943582,
  })
  timestamp: number;

  group: Partial<GroupInfo>;

  _data: any;
}

export enum GroupParticipantType {
  JOIN = 'join',
  LEAVE = 'leave',
  PROMOTE = 'promote',
  DEMOTE = 'demote',
}

export class GroupV2ParticipantsEvent {
  group: GroupId;

  @ApiProperty({
    description: 'Type of the event',
  })
  type: GroupParticipantType;

  @ApiProperty({
    description: 'Unix timestamp',
    example: 1666943582,
  })
  timestamp: number;

  participants: GroupParticipant[];

  _data: any;
}

export class GroupV2MembershipRequestEvent {
  group: GroupId;

  @ApiProperty({
    description: 'ID of the user requesting to join the group',
    example: '123456789@c.us',
  })
  requesterId: string;

  @ApiProperty({
    description: 'Unix timestamp',
    example: 1666943582,
  })
  timestamp: number;

  _data: any;
}
