import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  SessionApiParam,
  WorkingSessionParam,
} from '@waha/nestjs/params/SessionApiParam';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import {
  CallInfo,
  CallMediaRequest,
  CallMediaResponse,
  RejectCallRequest,
  StartCallRequest,
} from '../structures/calls.dto';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { CanSession, FromParam } from '@waha/core/auth/policies';

import { Action } from '@waha/core/auth/casl.types';

const CallIdParam = ApiParam({
  name: 'id',
  description: 'Call ID',
  example: 'ABCDEFGABCDEFGABCDEFGABCDEFG',
});

@ApiSecurity('api_key')
@Controller('api/:session/calls')
@ApiTags('📞 Calls')
@UseGuards(PoliciesGuard)
@CheckPolicies(CanSession(Action.Send, FromParam('session')))
export class CallsController {
  constructor(private manager: SessionManager) {}

  @Post('reject')
  @SessionApiParam
  @ApiOperation({ summary: 'Reject incoming call' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  rejectCall(
    @WorkingSessionParam session: WhatsappSession,
    @Body() request: RejectCallRequest,
  ) {
    return session.rejectCall(request.from, request.id);
  }

  //
  // Native (VoIP) calls - GOWS engine
  //
  @Get('')
  @SessionApiParam
  @ApiOperation({
    summary: 'Get active calls',
    description: 'Native voice calls handled by the session (GOWS only).',
  })
  @ApiOkResponse({ type: CallInfo, isArray: true })
  getActiveCalls(
    @WorkingSessionParam session: WhatsappSession,
  ): Promise<CallInfo[]> {
    return session.getActiveCalls();
  }

  @Post('start')
  @SessionApiParam
  @ApiOperation({
    summary: 'Start a voice call',
    description:
      'Places a native 1:1 voice call (GOWS only). ' +
      'Follow the progress with the "call.state" event and attach audio with ' +
      'POST /api/{session}/calls/{id}/media.',
  })
  @ApiOkResponse({ type: CallInfo })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  startCall(
    @WorkingSessionParam session: WhatsappSession,
    @Body() request: StartCallRequest,
  ): Promise<CallInfo> {
    return session.startCall(request.chatId);
  }

  @Post(':id/accept')
  @HttpCode(200)
  @SessionApiParam
  @CallIdParam
  @ApiOperation({ summary: 'Accept an incoming call (GOWS only)' })
  acceptCall(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<void> {
    return session.acceptCall(id);
  }

  @Post(':id/end')
  @HttpCode(200)
  @SessionApiParam
  @CallIdParam
  @ApiOperation({ summary: 'Hang up a call (GOWS only)' })
  endCall(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<void> {
    return session.endCall(id);
  }

  @Post(':id/media')
  @HttpCode(200)
  @SessionApiParam
  @CallIdParam
  @ApiOperation({
    summary: 'Attach browser audio to a call (WebRTC)',
    description:
      'Send the browser SDP offer (with a "pcm" data channel), get the SDP answer back. ' +
      'Audio flows directly between the browser and the engine over WebRTC.',
  })
  @ApiOkResponse({ type: CallMediaResponse })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async connectCallMedia(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
    @Body() request: CallMediaRequest,
  ): Promise<CallMediaResponse> {
    const sdp = await session.connectCallMedia(id, request.sdp);
    return { sdp: sdp };
  }
}
