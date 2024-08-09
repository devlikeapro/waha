import { ApiProperty } from '@nestjs/swagger';

export class EnvironmentQuery {
  @ApiProperty({
    example: false,
    required: false,
    description: 'Include all environment variables',
  })
  all: boolean = false;
}
