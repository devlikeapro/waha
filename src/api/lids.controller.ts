import {
  Controller,
  Get,
  Param,
  Query,
  UnprocessableEntityException,
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
import { CountResponse } from '@waha/structures/base.dto';
import {
  LidsListQueryParams,
  LidToPhoneNumber,
} from '@waha/structures/lids.dto';
import { PaginationParams, SortOrder } from '@waha/structures/pagination.dto';

import { SessionManager } from '../core/abc/manager.abc';
import { isLidUser } from '@waha/core/utils/jids';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { CanSession, FromParam } from '@waha/core/auth/policies';

import { Action } from '@waha/core/auth/casl.types';

@ApiSecurity('api_key')
@Controller('api/:session/lids')
@ApiTags('👤 Contacts')
@UseGuards(PoliciesGuard)
@CheckPolicies(CanSession(Action.Use, FromParam('session')))
export class LidsController {
  constructor(private manager: SessionManager) {}

  @Get('/')
  @SessionApiParam
  @ApiOperation({ summary: 'Get all known lids to phone number mapping' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getAll(
    @WorkingSessionParam session: WhatsappSession,
    @Query() params: LidsListQueryParams,
  ): Promise<Array<LidToPhoneNumber>> {
    // Always lid
    const pagination: PaginationParams = params;
    pagination.sortBy = 'lid';
    pagination.sortOrder = SortOrder.ASC;
    const lids = await session.getAllLids(pagination);
    return lids;
  }

  @Get('/count')
  @SessionApiParam
  @ApiOperation({ summary: 'Get the number of known lids' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getLidsCount(
    @WorkingSessionParam session: WhatsappSession,
  ): Promise<CountResponse> {
    const count = await session.getLidsCount();
    return {
      count: count,
    };
  }

  @Get('/:lid')
  @SessionApiParam
  @ApiOperation({ summary: 'Get phone number by lid' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async findPNByLid(
    @WorkingSessionParam session: WhatsappSession,
    @Param('lid') lid: string,
  ): Promise<LidToPhoneNumber> {
    if (!lid.includes('@')) {
      lid = lid + '@lid';
    }

    if (!isLidUser(lid)) {
      throw new UnprocessableEntityException(
        'Invalid LID - it must end with @lid',
      );
    }
    const result = await session.findPNByLid(lid);
    result.pn = result.pn || null;
    return result;
  }

  @Get('/pn/:phoneNumber')
  @SessionApiParam
  @ApiOperation({ summary: 'Get lid by phone number (chat id)' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async findLIDByPhoneNumber(
    @WorkingSessionParam session: WhatsappSession,
    @Param('phoneNumber') phoneNumber: string,
  ): Promise<LidToPhoneNumber> {
    if (isLidUser(phoneNumber)) {
      return {
        lid: phoneNumber,
        pn: null,
      };
    }

    const result = await session.findLIDByPhoneNumber(phoneNumber);
    result.lid = result.lid || null;
    return result;
  }
}
