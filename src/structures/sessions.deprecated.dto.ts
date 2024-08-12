import { ApiProperty } from '@nestjs/swagger';
import { SessionConfig } from '@waha/structures/sessions.dto';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class SessionStartDeprecatedRequest {
  @ApiProperty({
    example: 'default',
    description: 'Session name (id)',
  })
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => SessionConfig)
  @IsOptional()
  config?: SessionConfig;
}

export class SessionStopDeprecatedRequest {
  @ApiProperty({
    example: 'default',
    description: 'Session name (id)',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: false,
    required: false,
    description: 'Stop and logout from the session.',
  })
  @IsBoolean()
  @IsOptional()
  logout: boolean | undefined = false;
}

export class SessionLogoutDeprecatedRequest {
  @ApiProperty({
    example: 'default',
    description: 'Session name (id)',
  })
  @IsString()
  name: string;
}
