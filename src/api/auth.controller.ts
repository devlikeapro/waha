import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import {
  OTPRequest,
  QRCodeFormat,
  QRCodeQuery,
  QRCodeValue,
  RequestCodeRequest,
} from '../structures/auth.dto';
import { WAHASessionStatus } from '../structures/enums.dto';
import { Base64File } from '../structures/files.dto';
import { BufferResponseInterceptor } from './BufferResponseInterceptor';
import { ApiFileAcceptHeader, SessionApiParam, SessionParam } from './helpers';

@ApiSecurity('api_key')
@Controller('api/:session/auth')
@ApiTags('auth')
class AuthController {
  constructor(private manager: SessionManager) {}

  @Get('qr')
  @ApiOperation({
    summary: 'Get QR code for pairing WhatsApp Web.',
  })
  @SessionApiParam
  @ApiFileAcceptHeader(Base64File, QRCodeValue)
  @UseInterceptors(new BufferResponseInterceptor())
  async getQR(
    @SessionParam session: WhatsappSession,
    @Query() query: QRCodeQuery,
  ): Promise<Buffer | QRCodeValue> {
    if (session.status != WAHASessionStatus.SCAN_QR_CODE) {
      const err = `Can get QR code only in SCAN_QR_CODE status. The current status is '${session.status}'`;
      throw new UnprocessableEntityException(err);
    }
    const qr = session.getQR();
    if (query.format == QRCodeFormat.RAW) {
      return { value: qr.raw };
    }
    return qr.get();
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
