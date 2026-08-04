import { WebjsClientCore } from '@waha/core/engines/webjs/WebjsClientCore';
import {
  GroupId,
  GroupInfo,
  GroupParticipant,
  GroupParticipantRole,
} from '@waha/structures/groups.dto';
import {
  GroupParticipantType,
  GroupV2JoinEvent,
  GroupV2LeaveEvent,
  GroupV2ParticipantsEvent,
  GroupV2UpdateEvent,
} from '@waha/structures/groups.events.dto';
import {
  GroupChat,
  GroupNotification,
  GroupNotificationTypes,
  GroupParticipant as WEBJSGroupParticipant,
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
    newMembersApprovalRequired: groupMetadata.membershipApprovalMode,
    participants: participants,
  };
  return info;
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
