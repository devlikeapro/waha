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
