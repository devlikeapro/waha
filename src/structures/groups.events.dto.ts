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

export enum GroupParticipantsJoinRequestAction {
  // A user requested to join the group
  CREATED = 'created',
  // An admin rejected the request
  REJECTED = 'rejected',
  // The requester cancelled their own request
  REVOKED = 'revoked',
}

export class GroupV2ParticipantsJoinRequestEvent {
  group: GroupId;

  @ApiProperty({
    description: 'What happened to the request to join the group',
    enum: GroupParticipantsJoinRequestAction,
    example: GroupParticipantsJoinRequestAction.CREATED,
  })
  action: GroupParticipantsJoinRequestAction;

  @ApiProperty({
    description: 'ID of the user requesting to join the group',
    example: '123456789@lid',
  })
  requesterId: string;

  @ApiProperty({
    description: 'Phone number ID of the requester, if known',
    example: '123456789@c.us',
    nullable: true,
    required: false,
  })
  requesterPn?: string | null;

  @ApiProperty({
    description:
      'How the request was created, for example non_admin_add, invite_link, or linked_group_join',
    example: 'invite_link',
    nullable: true,
    required: false,
  })
  requestMethod?: string | null;

  @ApiProperty({
    description: 'Unix timestamp',
    example: 1666943582,
  })
  timestamp: number;

  _data: any;
}
