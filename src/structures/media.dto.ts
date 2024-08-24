import { ApiProperty } from '@nestjs/swagger';
import { S3MediaData } from '@waha/structures/media.s3.dto';

export class WAMedia {
  @ApiProperty({
    description: 'The URL for the media in the message if any',
    example:
      'http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga',
  })
  url?: string;

  @ApiProperty({
    description: 'mimetype for the media in the message if any',
    example: 'audio/jpeg',
  })
  mimetype?: string;

  @ApiProperty({
    description: 'The original filename in mediaUrl in the message if any',
    example: 'example.pdf',
  })
  filename?: string;

  @ApiProperty({
    description:
      'S3 attributes for the media in the message ' +
      'if you are using S3 media storage',
  })
  s3?: S3MediaData;

  @ApiProperty({
    description: "Error message if there's an error downloading the media",
    example: null,
  })
  // eslint-disable-next-line @typescript-eslint/ban-types
  error?: object;
}
