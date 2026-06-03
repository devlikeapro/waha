import { z } from 'zod';
import { DtoToZod } from '@waha/apps/mcp/schemas/DtoToZod';
import {
  CreateGroupRequest,
  DescriptionRequest,
  GroupsListFields,
  GroupsPaginationParams,
  JoinGroupRequest,
  ParticipantsRequest,
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
