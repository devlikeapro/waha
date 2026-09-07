import { WebjsClientCore } from '@waha/core/engines/webjs/WebjsClientCore';
import {
  GroupId,
  GroupInfo,
  GroupJoinRequest,
  GroupJoinRequestResult,
  GroupParticipant,
  GroupParticipantRole,
  NormalizeJoinRequestMethod,
} from '@waha/structures/groups.dto';
import {
  GroupParticipantsJoinRequestAction,
  GroupParticipantType,
  GroupV2JoinEvent,
  GroupV2LeaveEvent,
  GroupV2ParticipantsJoinRequestEvent,
  GroupV2ParticipantsEvent,
  GroupV2UpdateEvent,
} from '@waha/structures/groups.events.dto';
import {
  GroupChat,
  GroupMembershipRequest as WEBJSGroupJoinRequest,
  GroupNotification,
  GroupNotificationTypes,
  GroupParticipant as WEBJSGroupParticipant,
  MembershipRequestActionResult as WEBJSMembershipRequestActionResult,
} from 'whatsapp-web.js';
import { isPnUser } from '@waha/core/utils/jids';
import { GetSerialized } from '@waha/core/utils/serialized';

function ToGroupInfo(
  group: GroupChat,
  invite: string,
  participants = [],
): GroupInfo {
  // @ts-ignore
  const groupMetadata = group.groupMetadata;
  const info: GroupInfo = {
    // @ts-ignore
    id: GetSerialized(group.id),
    subject: group.name,
    description: group.description,
    invite: invite,
    membersCanAddNewMember: groupMetadata.memberAddMode === 'all_member_add',
    membersCanSendMessages: groupMetadata.announce,
    newMembersApprovalRequired: ToGroupMembershipApprovalRequired(
      groupMetadata.membershipApprovalMode,
    ),
    participants: participants,
  };
  return info;
}

export function ToGroupMembershipApprovalRequired(value: unknown): boolean {
  return value === true || value === 1;
}

export function ToGroupJoinRequest(
  request: WEBJSGroupJoinRequest,
): GroupJoinRequest {
  const requesterId = GetSerialized(request.id);
  if (!requesterId) {
    throw new Error('Unable to serialize group membership requester ID');
  }
  return {
    requesterId: requesterId,
    addedById: GetSerialized(request.addedBy),
    parentGroupId: GetSerialized(request.parentGroupId),
    requestMethod: NormalizeJoinRequestMethod(request.requestMethod),
    timestamp: request.t,
  };
}

export function ToGroupJoinRequestResults(
  result: WEBJSMembershipRequestActionResult,
): GroupJoinRequestResult[] {
  // whatsapp-web.js may report one result for multiple requesters - flatten to one entry per requester
  let requesterIds: (string | null)[];
  if (Array.isArray(result.requesterId)) {
    requesterIds = result.requesterId;
  } else {
    requesterIds = [result.requesterId ?? null];
  }
  return requesterIds.map((requesterId) => ({
    requesterId: requesterId,
    success: !result.error,
    error: result.error,
  }));
}

export function ToGroupV2ParticipantsJoinRequestEvent(
  notification: GroupNotification,
): GroupV2ParticipantsJoinRequestEvent | null {
  if (!notification.chatId || !notification.author) {
    return null;
  }
  return {
    group: {
      id: notification.chatId,
    },
    action: GroupParticipantsJoinRequestAction.CREATED,
    requesterId: notification.author,
    timestamp: notification.timestamp,
    _data: notification,
  };
}

export async function ToGroupV2JoinEvent(
  client: WebjsClientCore,
  me: string,
  notification: GroupNotification,
): Promise<GroupV2JoinEvent | null> {
  if (!notification.recipientIds.includes(me)) {
    return null;
  }
  // @ts-ignore
  const group: GroupChat = await client.getChatById(notification.id.remote);
  const invite = await group.getInviteCode();
  const participants = getParticipants(group.participants);
  const info: GroupInfo = ToGroupInfo(group, invite, participants);
  return {
    timestamp: notification.timestamp,
    group: info,
    _data: notification,
  };
}

export function getParticipants(
  participants: WEBJSGroupParticipant[],
): GroupParticipant[] {
  return participants.map((participant) => {
    let role: GroupParticipantRole = GroupParticipantRole.PARTICIPANT;
    if (participant.isSuperAdmin) {
      role = GroupParticipantRole.SUPERADMIN;
    } else if (participant.isAdmin) {
      role = GroupParticipantRole.ADMIN;
    }

    const participantId = GetSerialized(participant.id);
    return {
      id: participantId,
      pn: isPnUser(participantId) ? participantId : null,
      role: role,
    };
  });
}

export function ToGroupV2LeaveEvent(
  me: string,
  notification: GroupNotification,
): GroupV2LeaveEvent | null {
  if (!notification.recipientIds.includes(me)) {
    return null;
  }
  const group: GroupId = {
    // @ts-ignore
    id: notification.id.remote,
  };
  return {
    timestamp: notification.timestamp,
    group: group,
    _data: notification,
  };
}

export async function ToGroupV2UpdateEvent(
  client: WebjsClientCore,
  notification: GroupNotification,
): Promise<GroupV2UpdateEvent> {
  // @ts-ignore
  const group: GroupChat = await client.getChatById(notification.id.remote);
  const invite = await group.getInviteCode();
  const info: GroupInfo = ToGroupInfo(group, invite, undefined);
  return {
    group: info,
    timestamp: notification.timestamp,
    _data: notification,
  };
}

export function ToGroupV2ParticipantsEvent(
  notification: GroupNotification,
): GroupV2ParticipantsEvent | null {
  let type: GroupParticipantType;
  let role: GroupParticipantRole;
  if (['add', 'invite', 'linked_group_join'].includes(notification.type)) {
    type = GroupParticipantType.JOIN;
    role = GroupParticipantRole.PARTICIPANT;
  } else if (['remove', 'leave'].includes(notification.type)) {
    type = GroupParticipantType.LEAVE;
    role = GroupParticipantRole.LEFT;
  } else if (['promote'].includes(notification.type)) {
    type = GroupParticipantType.PROMOTE;
    role = GroupParticipantRole.ADMIN;
  } else if (['demote'].includes(notification.type)) {
    type = GroupParticipantType.DEMOTE;
    role = GroupParticipantRole.PARTICIPANT;
  } else {
    return null;
  }

  const participants: GroupParticipant[] = notification.recipientIds.map(
    (id) => {
      return {
        id: id,
        pn: isPnUser(id) ? id : null,
        role: role,
      };
    },
  );
  const group: GroupId = {
    // @ts-ignore
    id: notification.id.remote,
  };
  return {
    group: group,
    type: type,
    timestamp: notification.timestamp,
    participants: participants,
    _data: notification,
  };
}
