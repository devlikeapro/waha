import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SessionActionsDTO } from '@waha/structures/apikeys.dto';

export class McpAppConfig {
  @ApiProperty({
    type: SessionActionsDTO,
    description: 'Permission scopes for the generated API key.',
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => SessionActionsDTO)
  actions: SessionActionsDTO;

  @ApiProperty({
    example: 'key_id_00000000000000000000000000',
    required: false,
    nullable: true,
    readOnly: true,
    description: 'ID of the API key created for this app. Read-only.',
  })
  @IsOptional()
  @IsString()
  key_id?: string;

  @ApiProperty({
    example: 'key_11111111111AAAAAAAAAAAAAAAAAAAAA',
    required: false,
    nullable: true,
    readOnly: true,
    description:
      'The API key value. Populated on read; not persisted in this record.',
  })
  @IsOptional()
  @IsString()
  key?: string;
}
