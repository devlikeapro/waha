import { ApiProperty } from '@nestjs/swagger';

export class WAHAEnvironment {
  @ApiProperty({
    example: 'YYYY.MM.BUILD',
  })
  version: string;

  @ApiProperty({
    example: 'WEBJS',
  })
  engine: string;

  @ApiProperty({
    example: 'PLUS',
  })
  tier: string;

  @ApiProperty({
    example: '/usr/path/to/bin/google-chrome',
  })
  browser: string;
}
