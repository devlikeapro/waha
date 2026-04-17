import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CallsAppChannelConfig {
  @ApiProperty({
    description: 'Reject incoming calls for this chat type',
    default: true,
  })
  @IsBoolean()
  reject: boolean = true;

  @ApiProperty({
    description:
      'Optional auto-reply message sent after the call is rejected. If empty, no message is sent.',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    description:
      'Seconds to wait before declining the call. If not set or undefined, the call is declined immediately (0 seconds).',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  waitBeforeDecline?: number;

  @ApiProperty({
    description:
      'Seconds to wait before sending the auto-reply message. If not set or undefined, the message is sent immediately (0 seconds).',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  waitBeforeResponse?: number;
}

export class CallsAppConfig {
  @ApiProperty({
    description: 'Rules applied to direct messages (non-group calls)',
    type: CallsAppChannelConfig,
  })
  @ValidateNested()
  @Type(() => CallsAppChannelConfig)
  dm: CallsAppChannelConfig = new CallsAppChannelConfig();

  @ApiProperty({
    description: 'Rules applied to group calls',
    type: CallsAppChannelConfig,
  })
  @ValidateNested()
  @Type(() => CallsAppChannelConfig)
  group: CallsAppChannelConfig = new CallsAppChannelConfig();
}
