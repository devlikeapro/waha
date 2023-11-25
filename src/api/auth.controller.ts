import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Readable } from 'stream';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import { OTPRequest, RequestCodeRequest } from '../structures/auth.dto';
import { WAHASessionStatus } from '../structures/enums.dto';
import { SessionApiParam, SessionParam } from './helpers';

@ApiSecurity('api_key')
@Controller('api/:session/auth')
@ApiTags('auth')
class AuthController {
  constructor(private manager: SessionManager) {}

  @Get('qr')
  @SessionApiParam
  @ApiOperation({
    summary: 'Get QR code for pairing WhatsApp Web.',
  })
  async getQR(@Res() res: Response, @SessionParam session: WhatsappSession) {
    if (session.status != WAHASessionStatus.SCAN_QR_CODE) {
      const err = `Can get QR code only in SCAN_QR_CODE status. The current status is '${session.status}'`;
      throw new UnprocessableEntityException(err);
    }

    const buffer = await session.getQR();
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    res.set({
      'Content-Type': 'image/png',
      'Content-Length': buffer.length,
    });
    stream.pipe(res);
  }

  @Post('request-code')
  @SessionApiParam
  @ApiOperation({
    summary: 'Request authentication code.',
  })
  requestCode(
    @SessionParam session: WhatsappSession,
    @Body() request: RequestCodeRequest,
  ) {
    return session.requestCode(request.phoneNumber, request.method);
  }

  @Post('authorize-code')
  @SessionApiParam
  @ApiOperation({
    summary: 'Send OTP authentication code.',
  })
  authorizeCode(
    @SessionParam session: WhatsappSession,
    @Body() request: OTPRequest,
  ) {
    return session.authorizeCode(request.code);
  }
}

export { AuthController };
