import { z } from 'zod';
import { DtoToZod } from '@waha/apps/mcp/schemas/DtoToZod';
import {
  CreateGroupRequest,
  DescriptionRequest,
  GroupMemberTagRequest,
  GroupsListFields,
  GroupsPaginationParams,
  JoinGroupRequest,
  ParticipantsRequest,
  SettingsMembershipApproval,
  SettingsMemberShareHistoryMode,
  SettingsSecurityChangeInfo,
  SubjectRequest,
} from '@waha/structures/groups.dto';
import { ChatPictureQuery } from '@waha/structures/chats.dto';
import { ProfilePictureRequest } from '@waha/structures/profile.dto';

const SessionField = z.string().describe('Session name');
const GroupIdField = z.string().describe('Group ID (e.g. 123456789@g.us)');

export const GroupsListInput = DtoToZod(GroupsPaginationParams)
  .merge(DtoToZod(GroupsListFields))
  .extend({ session: SessionField });

export const GroupsSessionInput = z.object({ session: SessionField });

export const GroupIdInput = z.object({
  session: SessionField,
  id: GroupIdField,
});

export const GroupCreateInput = DtoToZod(CreateGroupRequest).extend({
  session: SessionField,
});

export const GroupJoinInput = DtoToZod(JoinGroupRequest).extend({
  session: SessionField,
});

export const GroupPictureInput = DtoToZod(ChatPictureQuery).extend({
  session: SessionField,
  id: GroupIdField,
});

export const GroupSetPictureInput = DtoToZod(ProfilePictureRequest).extend({
  session: SessionField,
  id: GroupIdField,
});

export const GroupDescriptionInput = DtoToZod(DescriptionRequest).extend({
  session: SessionField,
  id: GroupIdField,
});

export const GroupSubjectInput = DtoToZod(SubjectRequest).extend({
  session: SessionField,
  id: GroupIdField,
});

export const GroupAdminOnlyInput = DtoToZod(SettingsSecurityChangeInfo).extend({
  session: SessionField,
  id: GroupIdField,
});

export const GroupParticipantsInput = DtoToZod(ParticipantsRequest).extend({
  session: SessionField,
  id: GroupIdField,
});

export const GroupMembershipApprovalInput = DtoToZod(
  SettingsMembershipApproval,
).extend({
  session: SessionField,
  id: GroupIdField,
});

export const GroupMemberShareHistoryInput = DtoToZod(
  SettingsMemberShareHistoryMode,
).extend({
  session: SessionField,
  id: GroupIdField,
});

export const GroupParticipantIdInput = GroupIdInput.extend({
  participantId: z
    .string()
    .describe(
      'Participant ID as reported in messages and participants (e.g. 123456789@lid or 123456789@c.us)',
    ),
});

export const GroupMemberTagInput = DtoToZod(GroupMemberTagRequest).extend({
  session: SessionField,
  id: GroupIdField,
  // DtoToZod drops the nullable part of `string | null`
  tag: z
    .string()
    .nullable()
    .optional()
    .describe(
      'Your member tag in the group (2-30 characters). Empty or null removes it.',
    ),
});
