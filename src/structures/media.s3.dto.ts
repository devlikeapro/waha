import { ApiProperty } from '@nestjs/swagger';

export class S3MediaData {
  @ApiProperty({
    description: 'The name of the S3 bucket',
    example: 'my-bucket',
  })
  Bucket: string;

  @ApiProperty({
    description: 'The key of the object in the S3 bucket',
    example: 'default/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga',
  })
  Key: string;
}
