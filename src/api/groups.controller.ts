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
import { GroupIdApiParam } from '@waha/nestjs/params/ChatIdApiParam';
import {
  SessionApiParam,
  WorkingSessionParam,
} from '@waha/nestjs/params/SessionApiParam';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import {
  CreateGroupRequest,
  DescriptionRequest,
  ParticipantsRequest,
  SettingsSecurityChangeInfo,
  SubjectRequest,
} from '../structures/groups.dto';

@ApiSecurity('api_key')
@Controller('api/:session/groups')
@ApiTags('👥 Groups')
export class GroupsController {
  constructor(private manager: SessionManager) {}

  @Post('')
  @SessionApiParam
  @ApiOperation({ summary: 'Create a new group.' })
  createGroup(
    @WorkingSessionParam session: WhatsappSession,
    @Body() request: CreateGroupRequest,
  ) {
    return session.createGroup(request);
  }

  @Get('')
  @SessionApiParam
  @ApiOperation({ summary: 'Get all groups.' })
  getGroups(@WorkingSessionParam session: WhatsappSession) {
    return session.getGroups();
  }

  @Get(':id')
  @GroupIdApiParam
  @SessionApiParam
  @ApiOperation({ summary: 'Get the group.' })
  getGroup(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
  ) {
    return session.getGroup(id);
  }

  @Put(':id/settings/security/info-admin-only')
  @SessionApiParam
  @GroupIdApiParam
  @ApiOperation({
    summary: 'Updates the group "info admin only" settings.',
    description:
      'You can allow only admins to edit group info (title, description, photo).',
  })
  setInfoAdminOnly(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
    @Body() request: SettingsSecurityChangeInfo,
  ) {
    return session.setInfoAdminsOnly(id, request.adminsOnly);
  }

  @Get(':id/settings/security/info-admin-only')
  @SessionApiParam
  @GroupIdApiParam
  @ApiOperation({
    summary: "Get the group's 'info admin only' settings.",
    description:
      'You can allow only admins to edit group info (title, description, photo).',
  })
  getInfoAdminOnly(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<SettingsSecurityChangeInfo> {
    return session.getInfoAdminsOnly(id);
  }

  @Put(':id/settings/security/messages-admin-only')
  @SessionApiParam
  @GroupIdApiParam
  @ApiOperation({
    summary: 'Update settings - who can send messages',
    description:
      'Updates the group settings to only allow admins to send messages.',
  })
  setMessagesAdminOnly(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
    @Body() request: SettingsSecurityChangeInfo,
  ) {
    return session.setMessagesAdminsOnly(id, request.adminsOnly);
  }

  @Get(':id/settings/security/messages-admin-only')
  @SessionApiParam
  @GroupIdApiParam
  @ApiOperation({
    summary: 'Get settings - who can send messages',
    description: 'The group settings to only allow admins to send messages.',
  })
  getMessagesAdminOnly(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<SettingsSecurityChangeInfo> {
    return session.getMessagesAdminsOnly(id);
  }

  @Delete(':id')
  @SessionApiParam
  @GroupIdApiParam
  @ApiOperation({ summary: 'Delete the group.' })
  deleteGroup(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
  ) {
    return session.deleteGroup(id);
  }

  @Post(':id/leave')
  @SessionApiParam
  @GroupIdApiParam
  @ApiOperation({ summary: 'Leave the group.' })
  leaveGroup(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
  ) {
    return session.leaveGroup(id);
  }

  @Put(':id/description')
  @ApiOperation({
    summary: 'Updates the group description.',
    description:
      'Returns "true" if the subject was properly updated. This can return "false" if the user does not have the necessary permissions.',
  })
  @SessionApiParam
  @GroupIdApiParam
  setDescription(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
    @Body() request: DescriptionRequest,
  ) {
    return session.setDescription(id, request.description);
  }

  @Put(':id/subject')
  @SessionApiParam
  @GroupIdApiParam
  @ApiOperation({
    summary: 'Updates the group subject',
    description:
      'Returns "true" if the subject was properly updated. This can return "false" if the user does not have the necessary permissions.',
  })
  setSubject(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
    @Body() request: SubjectRequest,
  ) {
    return session.setSubject(id, request.subject);
  }

  @Get(':id/invite-code')
  @SessionApiParam
  @GroupIdApiParam
  @ApiOperation({ summary: 'Gets the invite code for the group.' })
  getInviteCode(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<string> {
    return session.getInviteCode(id);
  }

  @Post(':id/invite-code/revoke')
  @SessionApiParam
  @GroupIdApiParam
  @ApiOperation({
    summary:
      'Invalidates the current group invite code and generates a new one.',
  })
  revokeInviteCode(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
  ): Promise<string> {
    return session.revokeInviteCode(id);
  }

  @Get(':id/participants/')
  @SessionApiParam
  @GroupIdApiParam
  @ApiOperation({ summary: 'Get participants' })
  getParticipants(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
  ) {
    return session.getParticipants(id);
  }

  @Post(':id/participants/add')
  @SessionApiParam
  @GroupIdApiParam
  @ApiOperation({ summary: 'Add participants' })
  addParticipants(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
    @Body() request: ParticipantsRequest,
  ) {
    return session.addParticipants(id, request);
  }

  @Post(':id/participants/remove')
  @SessionApiParam
  @GroupIdApiParam
  @ApiOperation({
    summary: 'Remove participants',
  })
  removeParticipants(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
    @Body() request: ParticipantsRequest,
  ) {
    return session.removeParticipants(id, request);
  }

  @Post(':id/admin/promote')
  @SessionApiParam
  @GroupIdApiParam
  @ApiOperation({ summary: 'Promote participants to admin users.' })
  promoteToAdmin(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
    @Body() request: ParticipantsRequest,
  ) {
    return session.promoteParticipantsToAdmin(id, request);
  }

  @Post(':id/admin/demote')
  @SessionApiParam
  @GroupIdApiParam
  @ApiOperation({ summary: 'Demotes participants to regular users.' })
  demoteToAdmin(
    @WorkingSessionParam session: WhatsappSession,
    @Param('id') id: string,
    @Body() request: ParticipantsRequest,
  ) {
    return session.demoteParticipantsToUser(id, request);
  }
}
