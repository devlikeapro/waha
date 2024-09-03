import { ApiParam, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { BinaryFile, RemoteFile } from '@waha/structures/files.dto';

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

export class Channel {
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

  role: ChannelRole;
}

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
