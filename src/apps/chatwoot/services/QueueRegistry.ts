import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { QueueName } from '../consumers/QueueName';

/**
 * Central registry for ChatWoot queues backed by direct @InjectQueue bindings.
 */
@Injectable()
export class QueueRegistry {
  private readonly queues: Record<QueueName, Queue>;

  constructor(
    @InjectQueue(QueueName.SCHEDULED_MESSAGE_CLEANUP)
    private readonly scheduledMessageCleanupQueue: Queue,
    @InjectQueue(QueueName.SCHEDULED_CHECK_VERSION)
    private readonly scheduledCheckVersionQueue: Queue,
    @InjectQueue(QueueName.SCHEDULED_CHECK_TIER)
    private readonly scheduledCheckTierQueue: Queue,
    @InjectQueue(QueueName.TASK_CONTACTS_PULL)
    private readonly taskContactsPullQueue: Queue,
    @InjectQueue(QueueName.TASK_MESSAGES_PULL)
    private readonly taskMessagesPullQueue: Queue,
    @InjectQueue(QueueName.WAHA_SESSION_STATUS)
    private readonly wahaSessionStatusQueue: Queue,
    @InjectQueue(QueueName.WAHA_MESSAGE_ANY)
    private readonly wahaMessageAnyQueue: Queue,
    @InjectQueue(QueueName.WAHA_MESSAGE_REACTION)
    private readonly wahaMessageReactionQueue: Queue,
    @InjectQueue(QueueName.WAHA_MESSAGE_EDITED)
    private readonly wahaMessageEditedQueue: Queue,
    @InjectQueue(QueueName.WAHA_MESSAGE_REVOKED)
    private readonly wahaMessageRevokedQueue: Queue,
    @InjectQueue(QueueName.WAHA_MESSAGE_ACK)
    private readonly wahaMessageAckQueue: Queue,
    @InjectQueue(QueueName.WAHA_CALL_RECEIVED)
    private readonly wahaCallReceivedQueue: Queue,
    @InjectQueue(QueueName.WAHA_CALL_ACCEPTED)
    private readonly wahaCallAcceptedQueue: Queue,
    @InjectQueue(QueueName.WAHA_CALL_REJECTED)
    private readonly wahaCallRejectedQueue: Queue,
    @InjectQueue(QueueName.INBOX_MESSAGE_CREATED)
    private readonly inboxMessageCreatedQueue: Queue,
    @InjectQueue(QueueName.INBOX_MESSAGE_UPDATED)
    private readonly inboxMessageUpdatedQueue: Queue,
    @InjectQueue(QueueName.INBOX_CONVERSATION_CREATED)
    private readonly inboxConversationCreatedQueue: Queue,
    @InjectQueue(QueueName.INBOX_CONVERSATION_STATUS_CHANGED)
    private readonly inboxConversationStatusChangedQueue: Queue,
    @InjectQueue(QueueName.INBOX_MESSAGE_DELETED)
    private readonly inboxMessageDeletedQueue: Queue,
    @InjectQueue(QueueName.INBOX_COMMANDS)
    private readonly inboxCommandsQueue: Queue,
  ) {
    // Strictly typed object literal
    this.queues = {
      [QueueName.SCHEDULED_MESSAGE_CLEANUP]: this.scheduledMessageCleanupQueue,
      [QueueName.SCHEDULED_CHECK_VERSION]: this.scheduledCheckVersionQueue,
      [QueueName.SCHEDULED_CHECK_TIER]: this.scheduledCheckTierQueue,
      [QueueName.TASK_CONTACTS_PULL]: this.taskContactsPullQueue,
      [QueueName.TASK_MESSAGES_PULL]: this.taskMessagesPullQueue,
      [QueueName.WAHA_SESSION_STATUS]: this.wahaSessionStatusQueue,
      [QueueName.WAHA_MESSAGE_ANY]: this.wahaMessageAnyQueue,
      [QueueName.WAHA_MESSAGE_REACTION]: this.wahaMessageReactionQueue,
      [QueueName.WAHA_MESSAGE_EDITED]: this.wahaMessageEditedQueue,
      [QueueName.WAHA_MESSAGE_REVOKED]: this.wahaMessageRevokedQueue,
      [QueueName.WAHA_MESSAGE_ACK]: this.wahaMessageAckQueue,
      [QueueName.WAHA_CALL_RECEIVED]: this.wahaCallReceivedQueue,
      [QueueName.WAHA_CALL_ACCEPTED]: this.wahaCallAcceptedQueue,
      [QueueName.WAHA_CALL_REJECTED]: this.wahaCallRejectedQueue,
      [QueueName.INBOX_MESSAGE_CREATED]: this.inboxMessageCreatedQueue,
      [QueueName.INBOX_MESSAGE_UPDATED]: this.inboxMessageUpdatedQueue,
      [QueueName.INBOX_CONVERSATION_CREATED]:
        this.inboxConversationCreatedQueue,
      [QueueName.INBOX_CONVERSATION_STATUS_CHANGED]:
        this.inboxConversationStatusChangedQueue,
      [QueueName.INBOX_MESSAGE_DELETED]: this.inboxMessageDeletedQueue,
      [QueueName.INBOX_COMMANDS]: this.inboxCommandsQueue,
    } satisfies Record<QueueName, Queue>;
  }

  queue(name: QueueName): Queue {
    const queue = this.queues[name];
    if (!queue) {
      throw new Error(`Queue ${name} is not registered`);
    }
    return queue;
  }
}
