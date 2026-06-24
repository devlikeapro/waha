import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  Param,
  Post,
  BadRequestException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  SessionApiParam,
  WorkingSessionParam,
} from '@waha/nestjs/params/SessionApiParam';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import {
  CallStateResponse,
  ExchangeCallWebRTCRequest,
  ExchangeCallWebRTCResponse,
  RejectCallRequest,
  StartCallRequest,
  StartCallResponse,
} from '../structures/calls.dto';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { CanSession, FromParam } from '@waha/core/auth/policies';
import { ensureSuffix } from '@waha/core/abc/session.abc';
import { toJID, normalizeJid } from '@waha/core/utils/jids';

import { Action } from '@waha/core/auth/casl.types';

const CallIdApiParam = ApiParam({
  name: 'id',
  required: true,
  type: 'string',
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

  @Post()
  @SessionApiParam
  @ApiOperation({ summary: 'Start an outgoing VoIP call (GOWS engine)' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  startCall(
    @WorkingSessionParam session: WhatsappSession,
    @Body() request: StartCallRequest,
  ): Promise<StartCallResponse> {
    const jid = request.jid
      ? normalizeJid(toJID(ensureSuffix(request.jid)))
      : normalizeJid(toJID(ensureSuffix(request.phone)));
    return session.startCall(jid, request.video ?? false);
  }

  @Get('state')
  @SessionApiParam
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Get active call state (GOWS engine)' })
  getCallState(
    @WorkingSessionParam session: WhatsappSession,
  ): Promise<CallStateResponse> {
    return session.getCallState();
  }

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

  @Post(':id/reject')
  @SessionApiParam
  @CallIdApiParam
  @ApiOperation({
    summary: 'Reject incoming call by ID (WaCalls-compatible, GOWS engine)',
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async rejectCallById(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
    @Body() request: Partial<RejectCallRequest>,
  ) {
    let from = request?.from;
    if (!from && 'getCallState' in session) {
      const state = await (session as any).getCallState();
      from = state?.from;
    }
    if (!from) {
      throw new BadRequestException(
        'from is required when call state is unavailable',
      );
    }
    return session.rejectCall(from, id);
  }

  @Post(':id/accept')
  @SessionApiParam
  @CallIdApiParam
  @ApiOperation({ summary: 'Accept an incoming call (GOWS engine)' })
  acceptCall(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
    @Headers('x-client-id') ownerId?: string,
  ): Promise<void> {
    return session.acceptCall(id, ownerId);
  }

  @Post(':id/webrtc')
  @SessionApiParam
  @CallIdApiParam
  @ApiOperation({
    summary: 'Exchange WebRTC SDP for browser audio bridge (GOWS engine)',
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  exchangeCallWebRTC(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
    @Body() request: ExchangeCallWebRTCRequest,
  ): Promise<ExchangeCallWebRTCResponse> {
    return session.exchangeCallWebRTC(id, request.sdp_offer);
  }

  @Delete(':id')
  @SessionApiParam
  @CallIdApiParam
  @ApiOperation({ summary: 'End an active call (GOWS engine)' })
  endCall(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<void> {
    return session.endCall(id);
  }
}
