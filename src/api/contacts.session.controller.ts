import {
  Body,
  Controller,
  Param,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { CanSession, FromParam } from '@waha/core/auth/policies';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { ChatIdApiParam } from '@waha/nestjs/params/ChatIdApiParam';
import {
  SessionApiParam,
  WorkingSessionParam,
} from '@waha/nestjs/params/SessionApiParam';
import { WAHAValidationPipe } from '@waha/nestjs/pipes/WAHAValidationPipe';

import { SessionManager } from '../core/abc/manager.abc';
import { Result } from '../structures/base.dto';
import { ContactUpdateBody } from '../structures/contacts.dto';
import { Action } from '@waha/core/auth/casl.types';

@ApiSecurity('api_key')
@Controller('api/:session/contacts')
@ApiTags('👤 Contacts')
@UseGuards(PoliciesGuard)
@CheckPolicies(CanSession(Action.Use, FromParam('session')))
export class ContactsSessionController {
  constructor(private manager: SessionManager) {}

  @Put('/:chatId')
  @SessionApiParam
  @ChatIdApiParam
  @ApiOperation({
    summary: 'Create or update contact',
    description:
      'Create or update contact on the phone address book. May not work if you have installed many WhatsApp apps on the same phone',
  })
  @UsePipes(new WAHAValidationPipe())
  async put(
    @WorkingSessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
    @Body() body: ContactUpdateBody,
  ): Promise<Result> {
    await session.upsertContact(chatId, body);
    return { success: true };
  }
}
