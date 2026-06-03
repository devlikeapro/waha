import { z } from 'zod';
import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { McpController } from '@waha/apps/mcp/decorators/controller';
import { Tool } from '@waha/apps/mcp/decorators/tool';
import {
  GroupAdminOnlyInput,
  GroupCreateInput,
  GroupDescriptionInput,
  GroupIdInput,
  GroupJoinInput,
  GroupParticipantsInput,
  GroupPictureInput,
  GroupsListInput,
  GroupsSessionInput,
  GroupSetPictureInput,
  GroupSubjectInput,
} from '@waha/apps/mcp/tools/groups.zod';

export class GroupTools extends McpController {
  constructor(api: WAHASelf) {
    super(api);
  }

  @Tool('groups-list', {
    title: 'List groups',
    description: 'Get all groups for a session',
    inputSchema: GroupsListInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async list({ session, ...query }: z.infer<typeof GroupsListInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/groups`,
      params: query,
    });
  }

  @Tool('groups-count', {
    title: 'Count groups',
    description: 'Get the number of groups for a session',
    inputSchema: GroupsSessionInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async count({ session }: z.infer<typeof GroupsSessionInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/groups/count`,
    });
  }

  @Tool('groups-refresh', {
    title: 'Refresh groups',
    description: 'Refresh the groups list from the server',
    inputSchema: GroupsSessionInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async refresh({ session }: z.infer<typeof GroupsSessionInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/groups/refresh`,
    });
  }

  @Tool('groups-join-info', {
    title: 'Get group join info',
    description:
      'Get info about a group before joining via invite code or link',
    inputSchema: GroupJoinInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async joinInfo({ session, ...query }: z.infer<typeof GroupJoinInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/groups/join-info`,
      params: query,
    });
  }

  @Tool('groups-join', {
    title: 'Join group',
    description: 'Join a group via invite code or invite link',
    inputSchema: GroupJoinInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async join({ session, ...body }: z.infer<typeof GroupJoinInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/groups/join`,
      data: body,
    });
  }

  @Tool('groups-create', {
    title: 'Create group',
    description: 'Create a new WhatsApp group',
    inputSchema: GroupCreateInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async create({ session, ...body }: z.infer<typeof GroupCreateInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/groups`,
      data: body,
    });
  }

  @Tool('groups-get', {
    title: 'Get group',
    description: 'Get group information by ID',
    inputSchema: GroupIdInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async get({ session, id }: z.infer<typeof GroupIdInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/groups/${id}`,
    });
  }

  @Tool('groups-delete', {
    title: 'Delete group',
    description: 'Delete a WhatsApp group',
    inputSchema: GroupIdInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
    },
  })
  async delete({ session, id }: z.infer<typeof GroupIdInput>) {
    return this.textRequest({
      method: 'DELETE',
      url: `/api/${session}/groups/${id}`,
    });
  }

  @Tool('groups-leave', {
    title: 'Leave group',
    description: 'Leave a WhatsApp group',
    inputSchema: GroupIdInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async leave({ session, id }: z.infer<typeof GroupIdInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/groups/${id}/leave`,
    });
  }

  @Tool('groups-get-picture', {
    title: 'Get group picture',
    description: 'Get the group profile picture URL',
    inputSchema: GroupPictureInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getPicture({
    session,
    id,
    ...query
  }: z.infer<typeof GroupPictureInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/groups/${id}/picture`,
      params: query,
    });
  }

  @Tool('groups-set-picture', {
    title: 'Set group picture',
    description: 'Set the group profile picture',
    inputSchema: GroupSetPictureInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async setPicture({
    session,
    id,
    ...body
  }: z.infer<typeof GroupSetPictureInput>) {
    return this.textRequest({
      method: 'PUT',
      url: `/api/${session}/groups/${id}/picture`,
      data: body,
    });
  }

  @Tool('groups-delete-picture', {
    title: 'Delete group picture',
    description: 'Remove the group profile picture',
    inputSchema: GroupIdInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
    },
  })
  async deletePicture({ session, id }: z.infer<typeof GroupIdInput>) {
    return this.textRequest({
      method: 'DELETE',
      url: `/api/${session}/groups/${id}/picture`,
    });
  }

  @Tool('groups-set-description', {
    title: 'Set group description',
    description: 'Update the group description',
    inputSchema: GroupDescriptionInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async setDescription({
    session,
    id,
    ...body
  }: z.infer<typeof GroupDescriptionInput>) {
    return this.textRequest({
      method: 'PUT',
      url: `/api/${session}/groups/${id}/description`,
      data: body,
    });
  }

  @Tool('groups-set-subject', {
    title: 'Set group subject',
    description: 'Update the group name/subject',
    inputSchema: GroupSubjectInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async setSubject({
    session,
    id,
    ...body
  }: z.infer<typeof GroupSubjectInput>) {
    return this.textRequest({
      method: 'PUT',
      url: `/api/${session}/groups/${id}/subject`,
      data: body,
    });
  }

  @Tool('groups-get-info-admin-only', {
    title: 'Get info-admin-only setting',
    description: 'Get whether only admins can edit group info',
    inputSchema: GroupIdInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getInfoAdminOnly({ session, id }: z.infer<typeof GroupIdInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/groups/${id}/settings/security/info-admin-only`,
    });
  }

  @Tool('groups-set-info-admin-only', {
    title: 'Set info-admin-only setting',
    description:
      'Allow only admins to edit group info (title, description, photo)',
    inputSchema: GroupAdminOnlyInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async setInfoAdminOnly({
    session,
    id,
    ...body
  }: z.infer<typeof GroupAdminOnlyInput>) {
    return this.textRequest({
      method: 'PUT',
      url: `/api/${session}/groups/${id}/settings/security/info-admin-only`,
      data: body,
    });
  }

  @Tool('groups-get-messages-admin-only', {
    title: 'Get messages-admin-only setting',
    description: 'Get whether only admins can send messages in the group',
    inputSchema: GroupIdInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getMessagesAdminOnly({ session, id }: z.infer<typeof GroupIdInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/groups/${id}/settings/security/messages-admin-only`,
    });
  }

  @Tool('groups-set-messages-admin-only', {
    title: 'Set messages-admin-only setting',
    description: 'Allow only admins to send messages in the group',
    inputSchema: GroupAdminOnlyInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async setMessagesAdminOnly({
    session,
    id,
    ...body
  }: z.infer<typeof GroupAdminOnlyInput>) {
    return this.textRequest({
      method: 'PUT',
      url: `/api/${session}/groups/${id}/settings/security/messages-admin-only`,
      data: body,
    });
  }

  @Tool('groups-get-invite-code', {
    title: 'Get group invite code',
    description: 'Get the invite code for a group',
    inputSchema: GroupIdInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getInviteCode({ session, id }: z.infer<typeof GroupIdInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/groups/${id}/invite-code`,
    });
  }

  @Tool('groups-revoke-invite-code', {
    title: 'Revoke group invite code',
    description: 'Invalidate the current invite code and generate a new one',
    inputSchema: GroupIdInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
    },
  })
  async revokeInviteCode({ session, id }: z.infer<typeof GroupIdInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/groups/${id}/invite-code/revoke`,
    });
  }

  @Tool('groups-get-participants', {
    title: 'Get group participants',
    description: 'Get the list of group participants with roles',
    inputSchema: GroupIdInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getParticipants({ session, id }: z.infer<typeof GroupIdInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/groups/${id}/participants/v2`,
    });
  }

  @Tool('groups-add-participants', {
    title: 'Add participants',
    description: 'Add participants to a group',
    inputSchema: GroupParticipantsInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async addParticipants({
    session,
    id,
    ...body
  }: z.infer<typeof GroupParticipantsInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/groups/${id}/participants/add`,
      data: body,
    });
  }

  @Tool('groups-remove-participants', {
    title: 'Remove participants',
    description: 'Remove participants from a group',
    inputSchema: GroupParticipantsInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
    },
  })
  async removeParticipants({
    session,
    id,
    ...body
  }: z.infer<typeof GroupParticipantsInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/groups/${id}/participants/remove`,
      data: body,
    });
  }

  @Tool('groups-promote-to-admin', {
    title: 'Promote to admin',
    description: 'Promote participants to group admin',
    inputSchema: GroupParticipantsInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async promoteToAdmin({
    session,
    id,
    ...body
  }: z.infer<typeof GroupParticipantsInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/groups/${id}/admin/promote`,
      data: body,
    });
  }

  @Tool('groups-demote-to-user', {
    title: 'Demote to user',
    description: 'Demote admin participants back to regular users',
    inputSchema: GroupParticipantsInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async demoteToUser({
    session,
    id,
    ...body
  }: z.infer<typeof GroupParticipantsInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/groups/${id}/admin/demote`,
      data: body,
    });
  }
}
