import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UnprocessableEntityException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { ChatIdApiParam } from '@waha/nestjs/params/ChatIdApiParam';
import {
  SessionApiParam,
  WorkingSessionParam,
} from '@waha/nestjs/params/SessionApiParam';
import {
  Label,
  LabelBody,
  SetLabelsRequest,
} from '@waha/structures/labels.dto';
import * as lodash from 'lodash';

import { SessionManager } from '../core/abc/manager.abc';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { CanSession, FromParam } from '@waha/core/auth/policies';

import { Action } from '@waha/core/auth/casl.types';

@ApiSecurity('api_key')
@Controller('api/:session/labels')
@ApiTags('🏷️ Labels')
@UseGuards(PoliciesGuard)
@CheckPolicies(CanSession(Action.Use, FromParam('session')))
export class LabelsController {
  constructor(private manager: SessionManager) {}

  @Get('/')
  @SessionApiParam
  @ApiOperation({ summary: 'Get all labels' })
  getAll(@WorkingSessionParam session: WhatsappSession): Promise<Label[]> {
    return session.getLabels();
  }

  @Post('/')
  @SessionApiParam
  @ApiOperation({ summary: 'Create a new label' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @WorkingSessionParam session: WhatsappSession,
    @Body() body: LabelBody,
  ): Promise<Label> {
    const labelDto = body.toDTO();

    const labels = await session.getLabels();
    if (labels.length >= 20) {
      throw new UnprocessableEntityException('Maximum 20 labels allowed');
    }

    const labelByName = lodash.find(labels, { name: labelDto.name });
    if (labelByName) {
      throw new UnprocessableEntityException(
        `Label with '${labelByName.name}' already exists, id: ${labelByName.id}`,
      );
    }

    return session.createLabel(labelDto);
  }

  @Put('/:labelId')
  @SessionApiParam
  @ApiOperation({ summary: 'Update a label' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @WorkingSessionParam session: WhatsappSession,
    @Param('labelId') labelId: string,
    @Body() body: LabelBody,
  ): Promise<Label> {
    const label = await session.getLabel(labelId);
    if (!label) {
      throw new NotFoundException('Label not found');
    }

    const labelDto = body.toDTO();
    const labels = await session.getLabels();

    const labelByName = lodash.find(labels, { name: labelDto.name });
    if (labelByName) {
      throw new UnprocessableEntityException(
        `Label with '${labelByName.name}' already exists, id: ${labelByName.id}`,
      );
    }

    label.name = labelDto.name;
    label.color = labelDto.color;
    label.colorHex = Label.toHex(label.color);
    await session.updateLabel(label);
    return label;
  }

  @Delete('/:labelId')
  @SessionApiParam
  @ApiOperation({ summary: 'Delete a label' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async delete(
    @WorkingSessionParam session: WhatsappSession,
    @Param('labelId') labelId: string,
  ): Promise<any> {
    const label = await session.getLabel(labelId);
    if (!label) {
      throw new NotFoundException('Label not found');
    }
    await session.deleteLabel(label);
    return { result: true };
  }

  @Get('/chats/:chatId')
  @SessionApiParam
  @ChatIdApiParam
  @ApiOperation({ summary: 'Get labels for the chat' })
  getChatLabels(
    @WorkingSessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
  ): Promise<Label[]> {
    return session.getChatLabels(chatId);
  }

  @Put('/chats/:chatId')
  @SessionApiParam
  @ChatIdApiParam
  @ApiOperation({ summary: 'Save labels for the chat' })
  putChatLabels(
    @WorkingSessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
    @Body() request: SetLabelsRequest,
  ) {
    return session.putLabelsToChat(chatId, request.labels);
  }

  @Get('/:labelId/chats')
  @SessionApiParam
  @ApiOperation({ summary: 'Get chats by label' })
  getChatsByLabel(
    @WorkingSessionParam session: WhatsappSession,
    @Param('labelId') labelId: string,
  ) {
    return session.getChatsByLabelId(labelId);
  }
}
