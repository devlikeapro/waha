import { ApiProperty } from '@nestjs/swagger';

export class WAHAEnvironment {
  @ApiProperty({
    example: '2029.10.29',
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
