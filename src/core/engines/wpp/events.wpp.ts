import { toCusFormat } from '@waha/core/utils/jids';
import { SerializeMsgKey } from '@waha/core/utils/ids';
import { WAMessageReaction } from '@waha/structures/responses.dto';
import { WAHAPresenceStatus } from '@waha/structures/enums.dto';
import {
  GroupId,
  GroupParticipant,
  GroupParticipantRole,
} from '@waha/structures/groups.dto';
import {
  GroupParticipantType,
  GroupV2LeaveEvent,
  GroupV2ParticipantsEvent,
  GroupV2UpdateEvent,
} from '@waha/structures/groups.events.dto';
import { MeInfo } from '@waha/structures/sessions.dto';
import { LabelChatAssociation } from '@waha/structures/labels.dto';
import { WAHAChatPresences } from '@waha/structures/presence.dto';
import {
  WppParticipantAction,
  WppParticipantEvent,
  WppPresenceEvent,
  WppReactionEvent,
  WppUpdateLabelEvent,
} from '@waha/core/engines/wpp/WppTypes';

//
// Converters
//

function presenceStateToWAHA(
  state: string,
  isOnline?: boolean,
): WAHAPresenceStatus {
  switch (state) {
    case 'available':
      return WAHAPresenceStatus.ONLINE;
    case 'composing':
    case 'typing':
      return WAHAPresenceStatus.TYPING;
    case 'recording':
      return WAHAPresenceStatus.RECORDING;
    case 'unavailable':
      return WAHAPresenceStatus.OFFLINE;
    default:
      return isOnline ? WAHAPresenceStatus.ONLINE : WAHAPresenceStatus.OFFLINE;
  }
}

export function WppPresenceToPresence(
  data: WppPresenceEvent,
): WAHAChatPresences {
  const chatId = toCusFormat(data.id);

  // Group: iterate over per-participant states when available
  if (data.isGroup && data.participants?.length) {
    return {
      id: chatId,
      presences: data.participants.map((p) => ({
        participant: toCusFormat(p.id),
        lastKnownPresence: presenceStateToWAHA(p.state),
        lastSeen: null,
      })),
    };
  }

  return {
    id: chatId,
    presences: [
      {
        participant: chatId,
        lastKnownPresence: presenceStateToWAHA(data.state, data.isOnline),
        lastSeen: null,
      },
    ],
  };
}

export function WppParticipantsToGroupV2Participants(
  data: WppParticipantEvent,
): GroupV2ParticipantsEvent | null {
  let type: GroupParticipantType;
  let role: GroupParticipantRole;

  switch (data.action) {
    case WppParticipantAction.ADD:
    case WppParticipantAction.JOIN:
      type = GroupParticipantType.JOIN;
      role = GroupParticipantRole.PARTICIPANT;
      break;
    case WppParticipantAction.REMOVE:
    case WppParticipantAction.LEAVE as any:
    case WppParticipantAction.LEAVER:
      type = GroupParticipantType.LEAVE;
      role = GroupParticipantRole.LEFT;
      break;
    case WppParticipantAction.PROMOTE:
      type = GroupParticipantType.PROMOTE;
      role = GroupParticipantRole.ADMIN;
      break;
    case WppParticipantAction.DEMOTE:
      type = GroupParticipantType.DEMOTE;
      role = GroupParticipantRole.PARTICIPANT;
      break;
    default:
      return null;
  }

  const group: GroupId = { id: toCusFormat(data.groupId) };
  const participants: GroupParticipant[] = data.who.map((id) => ({
    id: id,
    pn: null,
    role: role,
  }));

  return {
    group: group,
    type: type,
    timestamp: Math.floor(Date.now() / 1000),
    participants: participants,
    _data: data,
  };
}

export function WppParticipantsIsMyJoin(
  data: WppParticipantEvent,
  me: MeInfo | null | undefined,
): boolean {
  const joinActions = [WppParticipantAction.ADD, WppParticipantAction.JOIN];
  if (!joinActions.includes(data.action as WppParticipantAction)) return false;
  return data.who.some((id) => id === me?.id || id === me?.lid);
}

export function WppParticipantsIsMyLeave(
  data: WppParticipantEvent,
  me: MeInfo | null | undefined,
): boolean {
  const leaveActions = [
    WppParticipantAction.REMOVE,
    WppParticipantAction.LEAVE,
    WppParticipantAction.LEAVER,
  ];
  if (!leaveActions.includes(data.action as WppParticipantAction)) return false;
  return data.who.some((id) => id === me?.id || id === me?.lid);
}

export function WppParticipantsToGroupV2Leave(
  data: WppParticipantEvent,
): GroupV2LeaveEvent {
  return {
    timestamp: Math.floor(Date.now() / 1000),
    group: { id: toCusFormat(data.groupId) },
    _data: data,
  };
}

export function WppReactionToMessageReaction(
  data: WppReactionEvent,
): WAMessageReaction {
  // sender is present at runtime but absent from the installed package's type
  const raw = data as any;
  const sender: string =
    raw.sender?._serialized ?? raw.sender?.toString?.() ?? raw.sender ?? '';
  // remote is the chat ID (peer in DM, group JID in group chats)
  const remote = toCusFormat(raw.id?.remote ?? '');
  const isGroup = remote.includes('@g.us');
  // In DMs, the remote party IS the sender when sender field is missing
  const from = sender ? toCusFormat(sender) : isGroup ? '' : remote;
  const participant = sender ? toCusFormat(sender) : isGroup ? '' : remote;
  const id = SerializeMsgKey(data.id);
  const messageId = SerializeMsgKey(data.msgId);
  return {
    id: id,
    from: from,
    fromMe: raw.id?.fromMe ?? false,
    source: null,
    participant: participant,
    to: remote,
    timestamp: data.timestamp,
    reaction: {
      text: data.reactionText ?? '',
      messageId: messageId,
    },
    // @ts-ignore
    _data: data,
  };
}

export function WppGp2ToGroupV2Update(msg: any): GroupV2UpdateEvent {
  const id = toCusFormat(msg.chatId);
  const group: Partial<Record<string, any>> = { id: id };
  if (msg.subtype === 'subject') {
    group.subject = msg.body;
  } else if (msg.subtype === 'description') {
    group.description = msg.body;
  } else {
    return null;
  }
  return {
    timestamp: msg.timestamp,
    group: group as any,
    _data: msg,
  };
}

export function WppUpdateLabelToAssociations(
  data: WppUpdateLabelEvent,
): LabelChatAssociation[] {
  const chat = data.chat as any;
  const chatId: string = chat?.id?._serialized ?? chat?.id ?? chat ?? '';
  return data.ids.map((labelId, i) => ({
    labelId: labelId,
    label: (data.labels?.[i] ?? null) as any,
    chatId: toCusFormat(chatId),
  }));
}
