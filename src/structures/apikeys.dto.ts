import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { SessionActions } from '@waha/core/auth/casl.types';
import { SessionName } from '@waha/structures/sessions.dto';

export class SessionActionsDTO implements SessionActions {
  @ApiProperty({
    required: false,
    description: 'Read session data (messages, contacts, chats, groups, etc.)',
  })
  @IsBoolean()
  @IsOptional()
  read?: boolean;

  @ApiProperty({
    required: false,
    description:
      'Send messages and manage session entities (groups, labels, channels, contacts, profile)',
  })
  @IsBoolean()
  @IsOptional()
  send?: boolean;

  @ApiProperty({
    required: false,
    description:
      'Session lifecycle: start, stop, restart, logout, authenticate',
  })
  @IsBoolean()
  @IsOptional()
  control?: boolean;

  @ApiProperty({
    required: false,
    description: 'Session config: update session settings',
  })
  @IsBoolean()
  @IsOptional()
  setting?: boolean;

  @ApiProperty({ required: false, description: 'Manage apps' })
  @IsBoolean()
  @IsOptional()
  app?: boolean;

  @ApiProperty({ required: false, description: 'Delete the session' })
  @IsBoolean()
  @IsOptional()
  delete?: boolean;
}

export class ApiKeyDTO {
  @ApiProperty({ example: 'key_id_00000000000000000000000000' })
  id: string;

  @ApiProperty({ example: 'key_11111111111AAAAAAAAAAAAAAAAAAAAA' })
  key: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: false })
  isAdmin: boolean;

  @ApiProperty({ example: 'default', required: false, nullable: true })
  session: string | null;

  @ApiProperty({ type: SessionActionsDTO, required: false, nullable: true })
  actions: SessionActions | null;
}

export class ApiKeyRequest {
  @ApiProperty({ example: false })
  @IsBoolean()
  isAdmin: boolean = false;

  @ApiProperty({ example: 'default', nullable: true })
  @SessionName()
  @IsOptional()
  session: string | null = null;

  @ApiProperty({ required: true, example: true })
  @IsOptional()
  @IsBoolean()
  isActive: boolean = true;

  @ApiProperty({ type: SessionActionsDTO, required: false, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => SessionActionsDTO)
  actions: SessionActionsDTO | null = null;
}
