import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import {
  CreateGroupRequest,
  DescriptionRequest,
  ParticipantsRequest,
  SettingsSecurityChangeInfo,
  SubjectRequest,
} from '../structures/groups.dto';
import { SessionApiParam, SessionParam } from './helpers';

@ApiSecurity('api_key')
@Controller('api/:session/groups')
@ApiTags('groups')
export class GroupsController {
  constructor(private manager: SessionManager) {}

  @Post('')
  @SessionApiParam
  @ApiOperation({ summary: 'Create a new group.' })
  createGroup(
    @SessionParam session: WhatsappSession,
    @Body() request: CreateGroupRequest,
  ) {
    return session.createGroup(request);
  }

  @Get('')
  @SessionApiParam
  @ApiOperation({ summary: 'Get all groups.' })
  getGroups(@SessionParam session: WhatsappSession) {
    return session.getGroups();
  }

  @Get(':id')
  @SessionApiParam
  @ApiOperation({ summary: 'Get the group.' })
  getGroup(@SessionParam session: WhatsappSession, @Param('id') id: string) {
    return session.getGroup(id);
  }

  @Put(':id/settings/security/info-admin-only')
  @SessionApiParam
  @ApiOperation({
    summary:
      'Updates the group settings to only allow admins to edit group info (title, description, photo).',
  })
  setGroupAdminOnly(
    @SessionParam session: WhatsappSession,
    @Param('id') id: string,
  ) {
    return session.setInfoAdminsOnly(id, true);
  }

  @Get(':id/settings/security/info-admin-only')
  @SessionApiParam
  @ApiOperation({
    summary:
      'Gets the group settings to only allow admins to edit group info (title, description, photo).',
  })
  getInfoAdminOnly(
    @SessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<SettingsSecurityChangeInfo> {
    return session.getInfoAdminsOnly(id);
  }

  @Delete(':id')
  @SessionApiParam
  @ApiOperation({ summary: 'Delete the group.' })
  deleteGroup(@SessionParam session: WhatsappSession, @Param('id') id: string) {
    return session.deleteGroup(id);
  }

  @Post(':id/leave')
  @SessionApiParam
  @ApiOperation({ summary: 'Leave the group.' })
  leaveGroup(@SessionParam session: WhatsappSession, @Param('id') id: string) {
    return session.leaveGroup(id);
  }

  @Put(':id/description')
  @ApiOperation({
    summary:
      'Updates the group description.\n' +
      'Returns true if the subject was properly updated. This can return false if the user does not have the necessary permissions.\n',
  })
  @SessionApiParam
  setDescription(
    @SessionParam session: WhatsappSession,
    @Param('id') id: string,
    @Body() request: DescriptionRequest,
  ) {
    return session.setDescription(id, request.description);
  }

  @Put(':id/subject')
  @SessionApiParam
  @ApiOperation({
    summary:
      'Updates the group subject.\n' +
      'Returns true if the subject was properly updated. This can return false if the user does not have the necessary permissions.\n',
  })
  setSubject(
    @SessionParam session: WhatsappSession,
    @Param('id') id: string,
    @Body() request: SubjectRequest,
  ) {
    return session.setSubject(id, request.subject);
  }

  @Get(':id/invite-code')
  @SessionApiParam
  @ApiOperation({ summary: 'Gets the invite code for a specific group.' })
  getInviteCode(
    @SessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<string> {
    return session.getInviteCode(id);
  }

  @Post(':id/invite-code/revoke')
  @SessionApiParam
  @ApiOperation({
    summary:
      'Invalidates the current group invite code and generates a new one.',
  })
  revokeInviteCode(
    @SessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<string> {
    return session.revokeInviteCode(id);
  }

  @Get(':id/participants/')
  @SessionApiParam
  @ApiOperation({ summary: 'Get a list of participants by in the group.' })
  getParticipants(
    @SessionParam session: WhatsappSession,
    @Param('id') id: string,
  ) {
    return session.getParticipants(id);
  }

  @Post(':id/participants/add')
  @SessionApiParam
  @ApiOperation({ summary: 'Adds a list of participants by ID to the group.' })
  addParticipants(
    @SessionParam session: WhatsappSession,
    @Param('id') id: string,
    @Body() request: ParticipantsRequest,
  ) {
    return session.addParticipants(id, request);
  }

  @Post(':id/participants/remove')
  @SessionApiParam
  @ApiOperation({
    summary: 'Removes a list of participants by ID to the group.',
  })
  removeParticipants(
    @SessionParam session: WhatsappSession,
    @Param('id') id: string,
    @Body() request: ParticipantsRequest,
  ) {
    return session.removeParticipants(id, request);
  }

  @Post(':id/admin/promote')
  @SessionApiParam
  @ApiOperation({ summary: 'Promote participants to admin users.' })
  promoteToAdmin(
    @SessionParam session: WhatsappSession,
    @Param('id') id: string,
    @Body() request: ParticipantsRequest,
  ) {
    return session.promoteParticipantsToAdmin(id, request);
  }

  @Post(':id/admin/demote')
  @SessionApiParam
  @ApiOperation({ summary: 'Demotes participants by to regular users.' })
  demoteToAdmin(
    @SessionParam session: WhatsappSession,
    @Param('id') id: string,
    @Body() request: ParticipantsRequest,
  ) {
    return session.demoteParticipantsToUser(id, request);
  }
}
