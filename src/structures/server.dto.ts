import { ApiProperty } from '@nestjs/swagger';
import { BooleanString } from '@waha/nestjs/validation/BooleanString';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class EnvironmentQuery {
  @ApiProperty({
    example: false,
    required: false,
    description: 'Include all environment variables',
  })
  @Transform(BooleanString)
  @IsBoolean()
  @IsOptional()
  all: boolean = false;
}

export class StopRequest {
  @ApiProperty({
    example: false,
    required: false,
    description:
      'By default, it gracefully stops the server, ' +
      'but you can force it to terminate immediately.',
  })
  @IsBoolean()
  @IsOptional()
  force: boolean = false;
}

export class StopResponse {
  @ApiProperty({
    example: true,
    description: "Always 'true' if the server is stopping.",
  })
  stopping: boolean = true;
}

export class WorkerInfo {
  @ApiProperty({
    example: 'waha',
    description: 'The worker ID.',
  })
  id: string;
}

export class ServerStatusResponse {
  @ApiProperty({
    example: 1723788847247,
    description: 'The timestamp when the server started (milliseconds).',
  })
  startTimestamp: number;

  @ApiProperty({
    example: 3600000,
    description: 'The uptime of the server in milliseconds.',
  })
  uptime: number;

  worker: WorkerInfo;
}
