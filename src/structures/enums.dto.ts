export const SECOND = 1000;

export enum WAHAEvents {
  SESSION_STATUS = 'session.status',
  MESSAGE = 'message',
  MESSAGE_REACTION = 'message.reaction',
  MESSAGE_ANY = 'message.any',
  MESSAGE_ACK = 'message.ack',
  MESSAGE_REVOKED = 'message.revoked',
  STATE_CHANGE = 'state.change',
  GROUP_JOIN = 'group.join',
  GROUP_LEAVE = 'group.leave',
  PRESENCE_UPDATE = 'presence.update',
  POLL_VOTE = 'poll.vote',
  POLL_VOTE_FAILED = 'poll.vote.failed',
  CHAT_ARCHIVE = 'chat.archive',
}

export enum WAHASessionStatus {
  STOPPED = 'STOPPED',
  STARTING = 'STARTING',
  SCAN_QR_CODE = 'SCAN_QR_CODE',
  WORKING = 'WORKING',
  FAILED = 'FAILED',
}

export enum WAHAEngine {
  VENOM = 'VENOM',
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
