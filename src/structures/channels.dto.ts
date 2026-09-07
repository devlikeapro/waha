import { ApiParam, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { BooleanString } from '@waha/nestjs/validation/BooleanString';
import { CommaSeparatedStrings } from '@waha/nestjs/validation/CommaSeparatedStrings';
import { BinaryFile, RemoteFile } from '@waha/structures/files.dto';
import { WAMessage } from '@waha/structures/responses.dto';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChannelRequest {
  @ApiProperty({
    example: 'Channel Name',
  })
  name: string;

  @ApiProperty({
    example: 'Channel Description',
  })
  description?: string;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(RemoteFile) },
      { $ref: getSchemaPath(BinaryFile) },
    ],
  })
  picture?: RemoteFile | BinaryFile;
}

export enum ChannelRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  SUBSCRIBER = 'SUBSCRIBER',
  GUEST = 'GUEST',
}

export enum ChannelRoleFilter {
  OWNER = ChannelRole.OWNER,
  ADMIN = ChannelRole.ADMIN,
  SUBSCRIBER = ChannelRole.SUBSCRIBER,
}

export class ListChannelsQuery {
  role?: ChannelRoleFilter;
}

class ChannelBase {
  @ApiProperty({
    description: 'Newsletter id',
    example: '123123123123@newsletter',
  })
  id: string;

  @ApiProperty({
    description: 'Channel name',
    example: 'Channel Name',
  })
  name: string;

  description?: string;

  @ApiProperty({
    description: 'Invite link',
    example: 'https://www.whatsapp.com/channel/111111111111111111111111',
  })
  invite: string;

  @ApiProperty({
    description: "Preview for channel's picture",
    example: 'https://mmg.whatsapp.net/m1/v/t24/An&_nc_cat=10',
  })
  preview?: string;

  @ApiProperty({
    description: "Channel's picture",
    example: 'https://mmg.whatsapp.net/m1/v/t24/An&_nc_cat=10',
  })
  picture?: string;

  verified: boolean;

  subscribersCount: number;
}

export class Channel extends ChannelBase {
  role: ChannelRole;
}

export class ChannelPublicInfo extends ChannelBase {}

export const NewsletterIdApiParam = ApiParam({
  name: 'id',
  required: true,
  type: 'string',
  schema: {
    default: '123123123@newsletter',
  },
  description: 'WhatsApp Channel ID',
});

export const NewsletterIdOrInviteCodeApiParam = ApiParam({
  name: 'id',
  required: true,
  type: 'string',
  schema: {
    default: '123123123@newsletter',
  },
  description:
    'WhatsApp Channel ID or invite code from invite link https://www.whatsapp.com/channel/11111',
});

export class ChannelCountry {
  code: string;
  name: string;
}

export class ChannelCategory {
  value: string;
  name: string;
}

export class ChannelView {
  value: string;
  name: string;
}

export class ChannelSearch {
  @IsNumber()
  @IsOptional()
  limit: number = 50;

  @IsString()
  startCursor: string = '';
}

export class ChannelSearchByView extends ChannelSearch {
  @IsString()
  view: string = 'RECOMMENDED';

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  countries: string[] = ['US'];

  @IsArray()
  @IsString({ each: true })
  categories: string[] = [];
}

export class ChannelSearchByText extends ChannelSearch {
  @IsString()
  @IsNotEmpty()
  text: string = 'Donald Trump';

  @IsArray()
  @IsString({ each: true })
  categories: string[] = [];
}

export class ChannelPagination {
  startCursor: string | null;
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class ChannelListResult {
  page: ChannelPagination;
  channels: ChannelPublicInfo[];
}

export class ChannelMessage {
  message: WAMessage;

  @ApiProperty({
    example: { '👍': 10, '❤️': 5 },
    type: Object,
    additionalProperties: { type: 'number' },
  })
  reactions: { [emoji: string]: number };

  viewCount: number;
}

export class PreviewChannelMessages {
  @Transform(BooleanString)
  @IsBoolean()
  downloadMedia: boolean = false;

  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
    description: 'Download only media with these mimetypes (prefix match)',
  })
  @Transform(CommaSeparatedStrings)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  downloadMediaMimetypes?: string[];

  @IsNumber()
  @Type(() => Number)
  limit: number = 10;
}
