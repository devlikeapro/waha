export const SECOND = 1000;

export enum WAHAEvents {
  MESSAGE = 'message',
  MESSAGE_ANY = 'message.any',
  MESSAGE_ACK = 'message.ack',
  STATE_CHANGE = 'state.change',
  GROUP_JOIN = 'group.join',
  GROUP_LEAVE = 'group.leave',
  PRESENCE_UPDATE = 'presence.update',
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
