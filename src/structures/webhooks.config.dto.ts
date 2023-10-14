import { ApiProperty } from '@nestjs/swagger';

export class RetriesConfiguration {
  @ApiProperty({
    example: 2,
  })
  delaySeconds: number;

  @ApiProperty({
    example: 15,
  })
  attempts: number;
}
export class CustomHeader {
  @ApiProperty({
    example: 'X-My-Custom-Header',
  })
  name: string;

  @ApiProperty({
    example: 'Value',
  })
  value: string;
}

export class HmacConfiguration {
  @ApiProperty({
    example: 'your-secret-key',
  })
  key: string;
}

export class WebhookConfig {
  @ApiProperty({
    example: 'https://httpbin.org/post',
    required: true,
  })
  url: string;

  @ApiProperty({
    example: ['message', 'session.status'],
    required: true,
  })
  events: string[];

  @ApiProperty({
    example: null,
  })
  hmac?: HmacConfiguration;

  @ApiProperty({
    example: null,
  })
  retries?: RetriesConfiguration;

  @ApiProperty({
    example: null,
  })
  customHeaders?: CustomHeader[];
}
