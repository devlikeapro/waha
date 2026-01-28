import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ChannelsInfoServiceCore } from '@waha/core/services/ChannelsInfoServiceCore';
import { isJidNewsletter } from '@waha/core/utils/jids';
import {
  SessionApiParam,
  WorkingSessionParam,
} from '@waha/nestjs/params/SessionApiParam';
import { WAHAValidationPipe } from '@waha/nestjs/pipes/WAHAValidationPipe';
import {
  Channel,
  ChannelCategory,
  ChannelCountry,
  ChannelListResult,
  ChannelMessage,
  ChannelSearchByText,
  ChannelSearchByView,
  ChannelView,
  CreateChannelRequest,
  ListChannelsQuery,
  NewsletterIdApiParam,
  NewsletterIdOrInviteCodeApiParam,
  PreviewChannelMessages,
} from '@waha/structures/channels.dto';

import { SessionManager } from '../core/abc/manager.abc';
import {
  parseChannelInviteLink,
  WhatsappSession,
} from '../core/abc/session.abc';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { CanSession, FromParam } from '@waha/core/auth/policies';

import { Action } from '@waha/core/auth/casl.types';

@ApiSecurity('api_key')
@Controller('api/:session/channels')
@ApiTags('📢 Channels')
@UseGuards(PoliciesGuard)
@CheckPolicies(CanSession(Action.Use, FromParam('session')))
export class ChannelsController {
  constructor(
    private manager: SessionManager,
    private channelsInfoService: ChannelsInfoServiceCore,
  ) {}

  @Get('')
  @SessionApiParam
  @ApiOperation({ summary: 'Get list of know channels' })
  async list(
    @WorkingSessionParam session: WhatsappSession,
    @Query() query: ListChannelsQuery,
  ): Promise<Channel[]> {
    return session.channelsList(query);
  }

  @Post('')
  @SessionApiParam
  @ApiOperation({ summary: 'Create a new channel.' })
  create(
    @WorkingSessionParam session: WhatsappSession,
    @Body() request: CreateChannelRequest,
  ): Promise<Channel> {
    return session.channelsCreateChannel(request);
  }

  @Delete(':id')
  @SessionApiParam
  @NewsletterIdApiParam
  @ApiOperation({ summary: 'Delete the channel.' })
  delete(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
  ) {
    return session.channelsDeleteChannel(id);
  }

  @Get(':id')
  @SessionApiParam
  @NewsletterIdOrInviteCodeApiParam
  @ApiOperation({
    summary: 'Get the channel info',
    description:
      'You can use either id (123@newsletter) ' +
      'OR invite code (https://www.whatsapp.com/channel/123)',
  })
  get(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<Channel> {
    if (isJidNewsletter(id)) {
      return session.channelsGetChannel(id);
    } else {
      const inviteCode = parseChannelInviteLink(id);
      return session.channelsGetChannelByInviteCode(inviteCode);
    }
  }

  @Get(':id/messages/preview')
  @SessionApiParam
  @UsePipes(new WAHAValidationPipe())
  @ApiParam({
    name: 'id',
    description: 'Channel id or invite code',
    required: true,
    type: 'string',
    schema: {
      default: '0029Va4K0PZ5a245NkngBA2M',
    },
  })
  @ApiOperation({
    summary: 'Preview channel messages',
    description:
      'You can use either ' +
      'invite code (https://www.whatsapp.com/channel/123) or (123)' +
      'OR' +
      'Channel ID (123@newsletter).',
  })
  async previewChannelMessages(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') code: string,
    @Query() query: PreviewChannelMessages,
  ): Promise<ChannelMessage[]> {
    if (isJidNewsletter(code)) {
      const channel = await session.channelsGetChannel(code);
      code = parseChannelInviteLink(channel.invite);
    }
    const inviteCode = parseChannelInviteLink(code);
    return session.previewChannelMessages(inviteCode, query);
  }

  @Post(':id/follow')
  @SessionApiParam
  @NewsletterIdApiParam
  @ApiOperation({ summary: 'Follow the channel.' })
  follow(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<void> {
    return session.channelsFollowChannel(id);
  }

  @Post(':id/unfollow')
  @SessionApiParam
  @NewsletterIdApiParam
  @ApiOperation({ summary: 'Unfollow the channel.' })
  unfollow(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<void> {
    return session.channelsUnfollowChannel(id);
  }

  @Post(':id/mute')
  @SessionApiParam
  @NewsletterIdApiParam
  @ApiOperation({ summary: 'Mute the channel.' })
  mute(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<void> {
    return session.channelsMuteChannel(id);
  }

  @Post(':id/unmute')
  @SessionApiParam
  @NewsletterIdApiParam
  @ApiOperation({ summary: 'Unmute the channel.' })
  unmute(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<void> {
    return session.channelsUnmuteChannel(id);
  }

  @Post('/search/by-view')
  @HttpCode(HttpStatus.OK)
  @SessionApiParam
  @UsePipes(new WAHAValidationPipe())
  @ApiOperation({ summary: 'Search for channels (by view)' })
  async searchByView(
    @WorkingSessionParam session: WhatsappSession,
    @Body() request: ChannelSearchByView,
  ): Promise<ChannelListResult> {
    return session.searchChannelsByView(request);
  }

  @Post('/search/by-text')
  @HttpCode(HttpStatus.OK)
  @SessionApiParam
  @UsePipes(new WAHAValidationPipe())
  @ApiOperation({ summary: 'Search for channels (by text)' })
  async searchByText(
    @WorkingSessionParam session: WhatsappSession,
    @Body() request: ChannelSearchByText,
  ): Promise<ChannelListResult> {
    return session.searchChannelsByText(request);
  }

  @Get('/search/views')
  @SessionApiParam
  @ApiOperation({ summary: 'Get list of views for channel search' })
  getSearchViews(): Promise<ChannelView[]> {
    return this.channelsInfoService.getViews();
  }

  @Get('/search/countries')
  @SessionApiParam
  @ApiOperation({ summary: 'Get list of countries for channel search' })
  getSearchCountries(): Promise<ChannelCountry[]> {
    return this.channelsInfoService.getCountries();
  }

  @Get('/search/categories')
  @SessionApiParam
  @ApiOperation({ summary: 'Get list of categories for channel search' })
  getSearchCategories(): Promise<ChannelCategory[]> {
    return this.channelsInfoService.getCategories();
  }
}
