import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import {
  SessionApiParam,
  WorkingSessionParam,
} from '@waha/nestjs/params/SessionApiParam';

import { SessionManager } from '../core/abc/manager.abc';
import {
  EventCancelRequest,
  EventMessageRequest,
} from '../structures/events.dto';
import { WAMessage } from '../structures/responses.dto';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { CanSession, FromParam } from '@waha/core/auth/policies';

import { Action } from '@waha/core/auth/casl.types';

@ApiSecurity('api_key')
@Controller('api/:session/events')
@ApiTags('📅 Events')
@UseGuards(PoliciesGuard)
@CheckPolicies(CanSession(Action.Use, FromParam('session')))
export class EventsController {
  constructor(private manager: SessionManager) {}

  @Post()
  @ApiOperation({ summary: 'Send an event message' })
  @UsePipes(new ValidationPipe())
  @SessionApiParam
  async sendEvent(
    @WorkingSessionParam session: WhatsappSession,
    @Body() request: EventMessageRequest,
  ): Promise<WAMessage> {
    return session.sendEvent(request);
  }

  // @Post(':id/cancel')
  // @ApiOperation({ summary: 'Cancel an event by ID' })
  // @UsePipes(new ValidationPipe())
  // @SessionApiParam
  // async cancelEvent(
  //   @WorkingSessionParam session: WhatsappSession,
  //   @Param('id') id: string,
  // ): Promise<WAMessage> {
  //   return session.cancelEvent(id);
  // }
}
