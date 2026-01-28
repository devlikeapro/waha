import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { SessionName } from '@waha/structures/sessions.dto';

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
}
