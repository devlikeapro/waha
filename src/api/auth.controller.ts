import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import { OTPRequest, RequestCodeRequest } from '../structures/auth.dto';
import { WAHASessionStatus } from '../structures/enums.dto';
import { Base64File } from '../structures/files.dto';
import { ApiFileAcceptHeader, SessionApiParam, SessionParam } from './helpers';

@ApiSecurity('api_key')
@Controller('api/:session/auth')
@ApiTags('auth')
class AuthController {
  constructor(private manager: SessionManager) {}

  @Get('qr')
  @SessionApiParam
  @ApiFileAcceptHeader()
  @ApiOperation({
    summary: 'Get QR code for pairing WhatsApp Web.',
  })
  async getQR(
    @Res({ passthrough: true }) res: Response,
    // We don't use @Headers and work directly with @Req here to avoid adding it to Swagger
    @Req() req: Request,
    @SessionParam session: WhatsappSession,
  ): Promise<Base64File | StreamableFile> {
    if (session.status != WAHASessionStatus.SCAN_QR_CODE) {
      const err = `Can get QR code only in SCAN_QR_CODE status. The current status is '${session.status}'`;
      throw new UnprocessableEntityException(err);
    }

    const buffer = await session.getQR();
    const accept = req.headers['accept'];
    if (accept == 'application/json') {
      return {
        mimetype: 'image/png',
        data: buffer.toString('base64'),
      };
    }

    const file = new StreamableFile(buffer);
    res.set({
      'Content-Type': 'image/png',
      'Content-Length': buffer.length,
    });
    return file;
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
