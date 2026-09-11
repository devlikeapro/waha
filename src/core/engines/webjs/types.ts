export enum WAJSPresenceChatStateType {
  AVAILABLE = 'available', // User is online
  UNAVAILABLE = 'unavailable', // User went offline (may include `t`)
  TYPING = 'typing', // User is typing text
  RECORDING_AUDIO = 'recording_audio', // User is recording a voice message
}

export interface WebJSPresence {
  participant: string;
  lastSeen?: number;
  state: WAJSPresenceChatStateType;
}

export interface WebJSPresenceUpdate {
  id: string;
  presences: WebJSPresence[];
}
