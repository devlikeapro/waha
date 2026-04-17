export enum QueueName {
  //
  // Scheduled
  //
  SCHEDULED_MESSAGE_CLEANUP = 'chatwoot.scheduled | message.cleanup',
  SCHEDULED_CHECK_VERSION = 'chatwoot.scheduled | check.version',
  SCHEDULED_CHECK_TIER = 'chatwoot.scheduled | check.tier',

  //
  // Task
  //
  TASK_CONTACTS_PULL = 'chatwoot.task | contacts.pull',
  TASK_MESSAGES_PULL = 'chatwoot.task | messages.pull',

  //
  // WAHA Events
  //
  WAHA_SESSION_STATUS = 'chatwoot.waha | session.status',
  WAHA_MESSAGE_ANY = 'chatwoot.waha | message.any',
  WAHA_MESSAGE_REACTION = 'chatwoot.waha | message.reaction',
  WAHA_MESSAGE_EDITED = 'chatwoot.waha | message.edited',
  WAHA_MESSAGE_REVOKED = 'chatwoot.waha | message.revoked',
  WAHA_MESSAGE_ACK = 'chatwoot.waha | message.ack',
  WAHA_CALL_RECEIVED = 'chatwoot.waha | call.received',
  WAHA_CALL_ACCEPTED = 'chatwoot.waha | call.accepted',
  WAHA_CALL_REJECTED = 'chatwoot.waha | call.rejected',
  //
  // ChatWoot Events - Real
  //
  INBOX_MESSAGE_CREATED = 'chatwoot.inbox | message_created',
  INBOX_MESSAGE_UPDATED = 'chatwoot.inbox | message_updated',
  INBOX_CONVERSATION_CREATED = 'chatwoot.inbox | conversation_created',
  INBOX_CONVERSATION_STATUS_CHANGED = 'chatwoot.inbox | conversation_status_changed',
  //
  // ChatWoot Events - Artificial
  //
  INBOX_MESSAGE_DELETED = 'chatwoot.inbox | message_deleted',
  INBOX_COMMANDS = 'chatwoot.inbox | commands',
}

export enum FlowProducerName {
  MESSAGES_PULL_FLOW = 'messages.pull.flow',
}
