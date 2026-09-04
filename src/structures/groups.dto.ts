import { ApiProperty } from '@nestjs/swagger';
import { BooleanString } from '@waha/nestjs/validation/BooleanString';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import { PaginationParams } from './pagination.dto';

/**
 * Structures
 */
export class Participant {
  @IsString()
  @ApiProperty({
    example: '123456789@c.us',
  })
  id: string;
}

export class SettingsSecurityChangeInfo {
  adminsOnly: boolean = true;
}

export class SettingsMemberAddMode {
  membersCanAddNewMember: boolean = true;
}

export class SettingsMembershipApproval {
  @IsBoolean()
  newMembersApprovalRequired: boolean = false;
}

export enum GroupJoinRequestMethod {
  INVITE_LINK = 'invite_link',
  LINKED_GROUP_JOIN = 'linked_group_join',
  NON_ADMIN_ADD = 'non_admin_add',
}

export function NormalizeJoinRequestMethod(
  value: string | null | undefined,
): GroupJoinRequestMethod | null {
  // Engines report the method in different formats
  // NOWEB/GOWS use 'invite_link'
  // WEBJS/WPP use 'InviteLink'
  switch (value) {
    case 'InviteLink':
    case GroupJoinRequestMethod.INVITE_LINK:
      return GroupJoinRequestMethod.INVITE_LINK;
    case 'LinkedGroupJoin':
    case GroupJoinRequestMethod.LINKED_GROUP_JOIN:
      return GroupJoinRequestMethod.LINKED_GROUP_JOIN;
    case 'NonAdminAdd':
    case GroupJoinRequestMethod.NON_ADMIN_ADD:
      return GroupJoinRequestMethod.NON_ADMIN_ADD;
    default:
      return null;
  }
}

export class GroupJoinRequest {
  @ApiProperty({
    description: 'ID of the user requesting to join the group',
    example: '123456789@c.us',
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
    description: 'ID of the user who created the request',
    example: '123456789@c.us',
    nullable: true,
  })
  addedById: string | null;

  @ApiProperty({
    description: 'ID of the parent community group, if present',
    example: '123456789@g.us',
    nullable: true,
  })
  parentGroupId: string | null;

  @ApiProperty({
    description:
      'How the request was created, for example non_admin_add, invite_link, or linked_group_join',
    example: 'invite_link',
    nullable: true,
  })
  requestMethod: string | null;

  @ApiProperty({
    description: 'Unix timestamp when the request was created',
    example: 1666943582,
  })
  timestamp: number;
}

export class GroupJoinRequestResult {
  @ApiProperty({
    description: 'ID of the participant the action was applied to',
    example: '123456789@c.us',
    nullable: true,
  })
  requesterId: string | null;

  @ApiProperty({
    example: true,
  })
  success: boolean;

  @ApiProperty({
    required: false,
    example: 404,
  })
  error?: number;
}

/**
 * Queries
 */

/**
 * Requests
 */

export class ParticipantsRequest {
  @IsArray()
  participants: Array<Participant>;
}

export class DescriptionRequest {
  @IsString()
  description: string;
}

export class SubjectRequest {
  @IsString()
  subject: string;
}

export class CreateGroupRequest {
  @IsString()
  name: string;

  @IsArray()
  participants: Array<Participant>;
}

export class JoinGroupRequest {
  @ApiProperty({
    description: 'Group code (123) or url (https://chat.whatsapp.com/123)',
    example: 'https://chat.whatsapp.com/1234567890abcdef',
  })
  @IsString()
  code: string;
}

export class JoinGroupResponse {
  @ApiProperty({
    description: 'Group ID',
    example: '123@g.us',
  })
  id: string;
}

export enum GroupField {
  NONE = '',
  PARTICIPANTS = 'participants',
}

export class GroupsListFields {
  @IsOptional()
  @ApiProperty({
    description: 'Exclude fields',
    enum: GroupField,
    isArray: true,
    required: false,
  })
  @IsEnum(GroupField, { each: true })
  exclude: string[];
}

export enum GroupSortField {
  ID = 'id',
  SUBJECT = 'subject',
}

export class GroupsPaginationParams extends PaginationParams {
  @ApiProperty({
    description: 'Sort by field',
    enum: GroupSortField,
  })
  @IsOptional()
  @IsEnum(GroupSortField)
  sortBy?: string;
}

export enum GroupParticipantRole {
  LEFT = 'left',
  PARTICIPANT = 'participant',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

export class GroupParticipant {
  @ApiProperty({
    description: 'Member ID in @c.us or @lid format',
    example: '123456789@lid',
  })
  id: string;

  @ApiProperty({
    description: 'Member ID in @c.us format',
    example: '123456789@c.us',
  })
  pn?: string;

  @ApiProperty({
    example: GroupParticipantRole.PARTICIPANT,
  })
  role: GroupParticipantRole;
}

export class GroupId {
  @ApiProperty({
    example: '123456789@g.us',
  })
  id: string;
}

export class GroupInfo {
  @ApiProperty({
    example: '123456789@g.us',
  })
  id: string;

  @ApiProperty({
    example: 'Group Name',
  })
  subject: string;

  @ApiProperty({
    example: 'Group Description',
  })
  description: string;

  participants: GroupParticipant[];

  @ApiProperty({
    description: 'Invite URL',
    example: 'https://chat.whatsapp.com/1234567890abcdef',
  })
  invite?: string;

  @ApiProperty({
    description: 'Members can add new members',
  })
  membersCanAddNewMember: boolean;

  @ApiProperty({
    description: 'Members can send messages to the group',
  })
  membersCanSendMessages: boolean;

  @ApiProperty({
    description: 'Admin approval required for new members',
  })
  newMembersApprovalRequired: boolean;
}
