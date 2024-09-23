export const SECOND = 1000;

export enum WAHAEvents {
  SESSION_STATUS = 'session.status',
  MESSAGE = 'message',
  MESSAGE_REACTION = 'message.reaction',
  MESSAGE_ANY = 'message.any',
  MESSAGE_ACK = 'message.ack',
  MESSAGE_WAITING = 'message.waiting',
  MESSAGE_REVOKED = 'message.revoked',
  STATE_CHANGE = 'state.change',
  GROUP_JOIN = 'group.join',
  GROUP_LEAVE = 'group.leave',
  PRESENCE_UPDATE = 'presence.update',
  POLL_VOTE = 'poll.vote',
  POLL_VOTE_FAILED = 'poll.vote.failed',
  CHAT_ARCHIVE = 'chat.archive',
  CALL_RECEIVED = 'call.received',
  CALL_ACCEPTED = 'call.accepted',
  CALL_REJECTED = 'call.rejected',
  LABEL_UPSERT = 'label.upsert',
  LABEL_DELETED = 'label.deleted',
  LABEL_CHAT_ADDED = 'label.chat.added',
  LABEL_CHAT_DELETED = 'label.chat.deleted',
}

export enum WAHASessionStatus {
  STOPPED = 'STOPPED',
  STARTING = 'STARTING',
  SCAN_QR_CODE = 'SCAN_QR_CODE',
  WORKING = 'WORKING',
  FAILED = 'FAILED',
}

export enum WAHAEngine {
  WEBJS = 'WEBJS',
  NOWEB = 'NOWEB',
}

export enum WAHAPresenceStatus {
  OFFLINE = 'offline',
  ONLINE = 'online',
  TYPING = 'typing',
  RECORDING = 'recording',
  PAUSED = 'paused',
}

export enum WAMessageAck {
  ERROR = -1,
  PENDING = 0,
  SERVER = 1,
  DEVICE = 2,
  READ = 3,
  PLAYED = 4,
}
export const ACK_UNKNOWN = 'UNKNOWN';
