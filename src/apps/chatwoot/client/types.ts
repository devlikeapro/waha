export enum EventName {
  CONVERSATION_CREATED = 'conversation_created',
  CONVERSATION_STATUS_CHANGED = 'conversation_status_changed',
  CONVERSATION_UPDATED = 'conversation_updated',
  CONTACT_CREATED = 'contact_created',
  CONTACT_UPDATED = 'contact_updated',
  MESSAGE_CREATED = 'message_created',
  MESSAGE_UPDATED = 'message_updated',
  WEBWIDGET_TRIGGERED = 'webwidget_triggered',
  CONVERSATION_TYPING_ON = 'conversation_typing_on',
  CONVERSATION_TYPING_OFF = 'conversation_typing_off',
}

export interface MessageAttachment {
  id: number;
  account_id: number;
  message_id: number;
  file_type: 'image' | 'video' | 'audio' | string;
  file_size: number;
  data_url?: string;
  thumb_url?: string;
  extension?: string;
  width?: number;
  height?: number;
}

export interface SendAttachment {
  content: string;
  filename?: string;
  encoding: 'base64';
}

export enum MessageType {
  OUTGOING = 'outgoing',
  INCOMING = 'incoming',
  ACTIVITY = 'activity',
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

export enum CustomAttributeType {
  TEXT = 0,
  NUMBER = 1,
  CURRENCY = 2,
  PERCENT = 3,
  LINK = 4,
  DATE = 5,
  LIST = 6,
  CHECKBOX = 7,
}

export enum CustomAttributeModel {
  CONVERSATION = 0,
  CONTACT = 1,
}

export enum ConversationStatus {
  OPEN = 'open',
  PENDING = 'pending',
  SNOOZED = 'snoozed',
  RESOLVED = 'resolved',
}
