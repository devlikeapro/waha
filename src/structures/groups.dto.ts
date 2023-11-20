import { IsArray, IsString } from 'class-validator';

/**
 * Structures
 */
export class Participant {
  @IsString()
  id: string;
}

export class SettingsSecurityChangeInfo {
  adminsOnly: boolean;
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
