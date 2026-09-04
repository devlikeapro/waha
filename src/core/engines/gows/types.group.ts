// JID just a string alias, we dump it as String in golang
type JID = string;

interface GroupName {
  Name: string;
  NameSetAt: string; // ISO string format for time
  NameSetBy: JID;
}

interface GroupTopic {
  Topic: string;
  TopicID: string;
  TopicSetAt: string;
  TopicSetBy: JID;
  TopicDeleted: boolean;
}

interface GroupLocked {
  IsLocked: boolean;
}

interface GroupAnnounce {
  IsAnnounce: boolean;
  AnnounceVersionID: string;
}

interface GroupEphemeral {
  IsEphemeral: boolean;
  DisappearingTimer: number;
}

interface GroupMembershipApprovalMode {
  IsJoinApprovalRequired: boolean;
}

interface GroupDelete {
  Deleted: boolean;
  DeleteReason: string;
}

interface GroupLinkTarget {
  JID: JID;
  GroupName: GroupName;
  GroupIsDefaultSub: GroupIsDefaultSub;
}

interface GroupLinkChange {
  Type: string; // Enum in Go: GroupLinkChangeType
  UnlinkReason: string; // Enum in Go: GroupUnlinkReason
  Group: GroupLinkTarget;
}

interface GroupIsDefaultSub {
  IsDefaultSubGroup: boolean;
}

export interface GroupInfoEvent {
  JID: JID;
  Notify: string;
  Sender?: JID;
  Timestamp: string;

  Name?: GroupName;
  Topic?: GroupTopic;
  Locked?: GroupLocked;
  Announce?: GroupAnnounce;
  Ephemeral?: GroupEphemeral;

  MembershipApprovalMode?: GroupMembershipApprovalMode;
  Delete?: GroupDelete;

  Link?: GroupLinkChange;
  Unlink?: GroupLinkChange;
  NewInviteLink?: string;

  PrevParticipantVersionID: string;
  ParticipantVersionID: string;

  JoinReason: string;

  Join: JID[];
  Leave: JID[];
  Promote: JID[];
  Demote: JID[];
}

export interface GOWSGroupParticipant {
  JID: JID;
  PhoneNumber: JID;
  IsAdmin: boolean;
  IsSuperAdmin: boolean;
  Error?: number; // set when the participant action failed
}

export interface GroupInfoFull {
  JID: JID;
  OwnerJID: JID;
  Name: string; // Name has additional properties here
  Topic: string; // Topic has additional properties here
  IsLocked: boolean; // specifies whether the group info can only be edited by admins.
  IsAnnounce: boolean; // specifies whether only admins can send messages in the group
  Participants: GOWSGroupParticipant[];
  MemberAddMode: string; // all_member_add | admin_add
  IsJoinApprovalRequired: boolean;
}

export interface JoinedGroupEvent extends GroupInfoFull {
  Reason: string;
  Type: string;
}

export interface GOWSGroupJoinRequest {
  JID: JID;
  PhoneNumber: JID; // empty string if not provided
  RequestMethod: string; // invite_link | linked_group_join | non_admin_add
}

export interface GroupJoinRequestEvent {
  JID: JID;
  Sender?: JID;
  SenderPN?: JID;
  Timestamp: string;
  Action: string; // created | revoked
  Requests: GOWSGroupJoinRequest[];
}

// GetGroupRequestParticipants RPC result item
export interface GOWSGroupParticipantRequest {
  JID: JID;
  RequestedAt: string;
}
