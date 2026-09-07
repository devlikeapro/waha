import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { IsDuration } from '@waha/nestjs/validation/IsDuration';

export class ArgentinePhoneNumbersAppConfig {
  @ApiProperty({
    description:
      'Reject with 422 only when both phone variants are confirmed absent.',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  strict?: boolean = false;

  @ApiProperty({
    description:
      'Allow WhatsApp lookups. When disabled, only cached resolutions are used.',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  lookup?: boolean = true;

  @ApiProperty({
    description:
      'In-memory resolution TTL. Cache is cleared when the app or session restarts.',
    default: '24h',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsDuration()
  memoryTtl?: string = '24h';
}
