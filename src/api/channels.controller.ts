import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  SessionApiParam,
  SessionParam,
} from '@waha/nestjs/params/SessionApiParam';
import {
  Channel,
  CreateChannelRequest,
  ListChannelsQuery,
  NewsletterIdApiParam,
  NewsletterIdOrInviteCodeApiParam,
} from '@waha/structures/channels.dto';

import { SessionManager } from '../core/abc/manager.abc';
import { isNewsletter, WhatsappSession } from '../core/abc/session.abc';

@ApiSecurity('api_key')
@Controller('api/:session/channels')
@ApiTags('📢 Channels')
export class ChannelsController {
  constructor(private manager: SessionManager) {}

  @Get('')
  @SessionApiParam
  @ApiOperation({ summary: 'Get list of know channels' })
  async list(
    @SessionParam session: WhatsappSession,
    @Query() query: ListChannelsQuery,
  ): Promise<Channel[]> {
    return session.channelsList(query);
  }

  @Post('')
  @SessionApiParam
  @ApiOperation({ summary: 'Create a new channel.' })
  create(
    @SessionParam session: WhatsappSession,
    @Body() request: CreateChannelRequest,
  ): Promise<Channel> {
    return session.channelsCreateChannel(request);
  }

  @Delete(':id')
  @SessionApiParam
  @NewsletterIdApiParam
  @ApiOperation({ summary: 'Delete the channel.' })
  delete(@SessionParam session: WhatsappSession, @Param('id') id: string) {
    return session.channelsDeleteChannel(id);
  }

  @Get(':id')
  @SessionApiParam
  @NewsletterIdOrInviteCodeApiParam
  @ApiOperation({
    summary: 'Get the channel info - either by id @newsletter OR invite code.',
  })
  get(
    @SessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<Channel> {
    if (isNewsletter(id)) {
      return session.channelsGetChannel(id);
    } else {
      // https://www.whatsapp.com/channel/123 => 123
      const inviteCode = id.split('/').pop();
      return session.channelsGetChannelByInviteCode(inviteCode);
    }
  }

  @Post('follow')
  @SessionApiParam
  @NewsletterIdApiParam
  @ApiOperation({ summary: 'Follow the channel.' })
  follow(
    @SessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<void> {
    return session.channelsFollowChannel(id);
  }

  @Post('unfollow')
  @SessionApiParam
  @NewsletterIdApiParam
  @ApiOperation({ summary: 'Unfollow the channel.' })
  unfollow(
    @SessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<void> {
    return session.channelsUnfollowChannel(id);
  }

  @Post('mute')
  @SessionApiParam
  @NewsletterIdApiParam
  @ApiOperation({ summary: 'Mute the channel.' })
  mute(
    @SessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<void> {
    return session.channelsMuteChannel(id);
  }

  @Post('unmute')
  @SessionApiParam
  @NewsletterIdApiParam
  @ApiOperation({ summary: 'Unmute the channel.' })
  unmute(
    @SessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<void> {
    return session.channelsUnmuteChannel(id);
  }
}
