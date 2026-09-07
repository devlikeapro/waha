import { ApiProperty } from '@nestjs/swagger';
import { IsDuration } from '@waha/nestjs/validation/IsDuration';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import * as ms from 'ms';

export const DEFAULT_MEMORY_TTL: ms.StringValue = '24h';
export const DEFAULT_PERSISTENT_TTL: ms.StringValue = '31d';

export class BrazilianPhoneNumbersCacheConfig {
  @ApiProperty({
    description:
      'TTL for resolved numbers in the in-memory cache tier, as a duration string.',
    required: false,
    default: DEFAULT_MEMORY_TTL,
    example: '24h',
  })
  @IsOptional()
  @IsString()
  @IsDuration()
  memoryTtl?: string = DEFAULT_MEMORY_TTL;

  @ApiProperty({
    description:
      'Persist verified resolutions in the database so they survive session restarts. ' +
      'Unverified best-guesses and negatives are never persisted.',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  persistent?: boolean = true;

  @ApiProperty({
    description:
      'TTL for resolved numbers in the database cache tier, as a duration string.',
    required: false,
    default: DEFAULT_PERSISTENT_TTL,
    example: '31d',
  })
  @IsOptional()
  @IsString()
  @IsDuration()
  persistentTtl?: string = DEFAULT_PERSISTENT_TTL;
}

export class BrazilianPhoneNumbersAppConfig {
  @ApiProperty({
    description:
      'When a Brazilian mobile number is confirmed NOT to exist on WhatsApp: ' +
      'false (default) - warn and send the best-guess anyway; ' +
      'true - reject the send with 422. Strict trades delivery for certainty ' +
      'and can block valid sends on lookup false-negatives (throttling).',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  strict?: boolean = false;

  @ApiProperty({
    description:
      'Allow the WhatsApp server lookup tier for numbers the cache and the ' +
      'local contact store cannot resolve. When false, unresolved numbers are ' +
      'sent as provided.',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  lookup?: boolean = true;

  @ApiProperty({
    description: 'Cache tuning for resolved numbers.',
    required: false,
    type: BrazilianPhoneNumbersCacheConfig,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BrazilianPhoneNumbersCacheConfig)
  cache?: BrazilianPhoneNumbersCacheConfig =
    new BrazilianPhoneNumbersCacheConfig();
}
