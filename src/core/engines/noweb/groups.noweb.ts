import type { GroupMetadata } from '@adiwajshing/baileys';
import type { Contact } from '@adiwajshing/baileys/lib/Types/Contact';
import type {
  GroupParticipant as NOWEBGroupParticipant,
  ParticipantAction,
} from '@adiwajshing/baileys/lib/Types/GroupMetadata';
import { getGroupInviteLink } from '@waha/core/abc/session.abc';
import {
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
import { isPnUser, toCusFormat } from '@waha/core/utils/jids';
import esm from '@waha/vendor/esm';

export function ToGroupInfo(group: Partial<GroupMetadata>): GroupInfo {
  let participants: GroupParticipant[] = undefined;
  if (group.participants && group.participants.length > 0) {
    participants = group.participants.map(ToGroupParticipant);
  }
  return {
    id: group.id,
    subject: group.subject,
    description: group.desc,
    invite: group.inviteCode ? getGroupInviteLink(group.inviteCode) : undefined,
    participants: participants,
    membersCanAddNewMember: group.memberAddMode,
    membersCanSendMessages: group.announce,
    newMembersApprovalRequired: group.joinApprovalMode,
  };
}

export function ToGroupV2JoinEvent(group: GroupMetadata): GroupV2JoinEvent {
  return {
    timestamp: Date.now(),
    group: ToGroupInfo(group),
    _data: group,
  };
}

export function ToGroupParticipant(
  participant: NOWEBGroupParticipant,
): GroupParticipant {
  let role: GroupParticipantRole = GroupParticipantRole.PARTICIPANT;
  if (participant.admin === 'admin') {
    role = GroupParticipantRole.ADMIN;
  } else if (participant.admin === 'superadmin') {
    role = GroupParticipantRole.SUPERADMIN;
  }
  return {
    id: toCusFormat(participant.id),
    pn: toCusFormat(participant.phoneNumber),
    role: role,
  };
}

interface GroupParticipantUpdate {
  id: string;
  author: string;
  participants: Array<string | NOWEBGroupParticipant>;
  action: ParticipantAction;
}

export function getParticipantId(
  participant: string | NOWEBGroupParticipant,
): string | undefined {
  if (typeof participant === 'string') {
    return participant;
  }
  return participant?.id;
}

function getParticipantPn(
  participant: string | NOWEBGroupParticipant,
): string | null {
  if (typeof participant === 'string') {
    return isPnUser(participant) ? participant : null;
  }
  return participant?.phoneNumber || null;
}

function getParticipantIds(
  participant: string | NOWEBGroupParticipant,
): string[] {
  if (typeof participant === 'string') {
    return [participant];
  }
  return [participant?.id, participant?.phoneNumber].filter(Boolean);
}

/**
 * Check if me.id or me.lid in participant list
 */
export function participantsIncludeMe(
  me: Contact,
  participants: Array<string | NOWEBGroupParticipant>,
): boolean {
  const myIds = [me.id, me.lid].filter(Boolean);
  return participants.some((participant) =>
    getParticipantIds(participant).some((id) =>
      myIds.some((meId) => esm.b.areJidsSameUser(id, meId)),
    ),
  );
}

export function ToGroupV2Participants(
  update: GroupParticipantUpdate,
): GroupV2ParticipantsEvent {
  let role: GroupParticipantRole;
  let type: GroupParticipantType;
  switch (update.action) {
    case 'add':
      role = GroupParticipantRole.PARTICIPANT;
      type = GroupParticipantType.JOIN;
      break;
    case 'remove':
      role = GroupParticipantRole.LEFT;
      type = GroupParticipantType.LEAVE;
      break;
    case 'promote':
      role = GroupParticipantRole.ADMIN;
      type = GroupParticipantType.PROMOTE;
      break;
    case 'demote':
      role = GroupParticipantRole.ADMIN;
      type = GroupParticipantType.DEMOTE;
      break;
  }

  const participants: GroupParticipant[] = update.participants.map((item) => {
    const id = getParticipantId(item);
    return {
      id: toCusFormat(id),
      pn: toCusFormat(getParticipantPn(item)),
      role: role,
    };
  });

  return {
    group: {
      id: toCusFormat(update.id),
    },
    type: type,
    timestamp: Date.now(),
    participants: participants,
    _data: update,
  };
}

export function ToGroupV2UpdateEvent(
  group: Partial<GroupMetadata>,
): GroupV2UpdateEvent {
  return {
    timestamp: Date.now(),
    group: ToGroupInfo(group),
    _data: group,
  };
}

// Raw <membership_approval_request> node attrs from groupRequestParticipantsList
interface MembershipApprovalRequestAttrs {
  jid?: string;
  phone_number?: string;
  request_method?: string;
  request_time?: string;
  t?: string;
}

export function ToGroupJoinRequest(
  attrs: MembershipApprovalRequestAttrs,
): GroupJoinRequest {
  return {
    requesterId: toCusFormat(attrs.jid),
    requesterPn: toCusFormat(attrs.phone_number) || null,
    addedById: null,
    parentGroupId: null,
    requestMethod: NormalizeJoinRequestMethod(attrs.request_method),
    timestamp: Number(attrs.request_time || attrs.t) || 0,
  };
}

export function ToGroupJoinRequestResult(result: {
  status: string;
  jid: string | undefined;
}): GroupJoinRequestResult {
  const success = result.status === '200';
  let error: number | undefined;
  if (!success) {
    error = Number(result.status) || undefined;
  }
  return {
    requesterId: toCusFormat(result.jid) || null,
    success: success,
    error: error,
  };
}

interface GroupJoinRequestUpdate {
  id: string;
  author: string;
  authorPn?: string;
  participant: string;
  participantPn?: string;
  action: string;
  method?: string;
}

function ToGroupParticipantsJoinRequestAction(
  action: string,
): GroupParticipantsJoinRequestAction | null {
  switch (action) {
    case 'created':
      return GroupParticipantsJoinRequestAction.CREATED;
    case 'rejected':
      return GroupParticipantsJoinRequestAction.REJECTED;
    case 'revoked':
      return GroupParticipantsJoinRequestAction.REVOKED;
    default:
      return null;
  }
}

export function ToGroupV2ParticipantsJoinRequestEvent(
  update: GroupJoinRequestUpdate,
): GroupV2ParticipantsJoinRequestEvent | null {
  const action = ToGroupParticipantsJoinRequestAction(update.action);
  if (!action) {
    return null;
  }
  return {
    group: {
      id: toCusFormat(update.id),
    },
    action: action,
    requesterId: toCusFormat(update.participant),
    requesterPn: toCusFormat(update.participantPn) || null,
    requestMethod: NormalizeJoinRequestMethod(update.method),
    timestamp: Date.now(),
    _data: update,
  };
}

export function ToGroupV2LeaveEvent(
  me: Contact,
  update: GroupParticipantUpdate,
): GroupV2LeaveEvent | null {
  if (update.action !== 'remove') {
    return null;
  }
  if (!me) {
    return null;
  }
  if (!participantsIncludeMe(me, update.participants)) {
    return null;
  }

  return {
    timestamp: Date.now(),
    group: {
      id: toCusFormat(update.id),
    },
    _data: update,
  };
}
