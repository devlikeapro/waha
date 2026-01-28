import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { SessionManager } from '../core/abc/manager.abc';
import { SessionQuery } from '../structures/base.dto';
import {
  CheckNumberStatusQuery,
  WANumberExistResult,
} from '../structures/chatting.dto';
import {
  ContactProfilePictureQuery,
  ContactQuery,
  ContactRequest,
  ContactsPaginationParams,
} from '../structures/contacts.dto';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { CanSession, FromBody, FromQuery } from '@waha/core/auth/policies';

import { Action } from '@waha/core/auth/casl.types';

@ApiSecurity('api_key')
@Controller('api/contacts')
@ApiTags('👤 Contacts')
@UseGuards(PoliciesGuard)
export class ContactsController {
  constructor(private manager: SessionManager) {}

  @Get('/all')
  @ApiOperation({ summary: 'Get all contacts' })
  @CheckPolicies(CanSession(Action.Use, FromQuery('session')))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getAll(
    @Query() query: SessionQuery,
    @Query() pagination: ContactsPaginationParams,
  ) {
    const whatsapp = await this.manager.getWorkingSession(query.session);
    return whatsapp.getContacts(pagination);
  }

  @Get('/')
  @ApiOperation({
    summary: 'Get contact basic info',
    description:
      'The method always return result, even if the phone number is not registered in WhatsApp. For that - use /contacts/check-exists endpoint below.',
  })
  @CheckPolicies(CanSession(Action.Use, FromQuery('session')))
  async get(@Query() query: ContactQuery) {
    const whatsapp = await this.manager.getWorkingSession(query.session);
    return whatsapp.getContact(query);
  }

  @Get('/check-exists')
  @ApiOperation({ summary: 'Check phone number is registered in WhatsApp.' })
  @CheckPolicies(CanSession(Action.Use, FromQuery('session')))
  async checkExists(
    @Query() request: CheckNumberStatusQuery,
  ): Promise<WANumberExistResult> {
    const whatsapp = await this.manager.getWorkingSession(request.session);
    return whatsapp.checkNumberStatus(request);
  }

  @Get('/about')
  @ApiOperation({
    summary: 'Gets the Contact\'s "about" info',
    description:
      'Returns null if you do not have permission to read their status.',
  })
  @CheckPolicies(CanSession(Action.Use, FromQuery('session')))
  async getAbout(@Query() query: ContactQuery) {
    const whatsapp = await this.manager.getWorkingSession(query.session);
    return whatsapp.getContactAbout(query);
  }

  @Get('/profile-picture')
  @ApiOperation({
    summary: "Get contact's profile picture URL",
    description:
      'If privacy settings do not allow to get the picture, the method will return null.',
  })
  @CheckPolicies(CanSession(Action.Use, FromQuery('session')))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getProfilePicture(@Query() query: ContactProfilePictureQuery) {
    const whatsapp = await this.manager.getWorkingSession(query.session);
    const url = await whatsapp.getContactProfilePicture(
      query.contactId,
      query.refresh,
    );
    return { profilePictureURL: url };
  }

  @Post('/block')
  @ApiOperation({ summary: 'Block contact' })
  @CheckPolicies(CanSession(Action.Use, FromBody('session')))
  async block(@Body() request: ContactRequest) {
    const whatsapp = await this.manager.getWorkingSession(request.session);
    return whatsapp.blockContact(request);
  }

  @Post('/unblock')
  @ApiOperation({ summary: 'Unblock contact' })
  @CheckPolicies(CanSession(Action.Use, FromBody('session')))
  async unblock(@Body() request: ContactRequest) {
    const whatsapp = await this.manager.getWorkingSession(request.session);
    return whatsapp.unblockContact(request);
  }
}
