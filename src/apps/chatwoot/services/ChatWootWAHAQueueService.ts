import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ListenEventsForChatWoot } from '@waha/apps/chatwoot/consumers/waha/base';
import { populateSessionInfo } from '@waha/core/abc/manager.abc';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { WAHAEvents } from '@waha/structures/enums.dto';
import { Queue } from 'bullmq';

import { QueueName } from '../consumers/QueueName';

/**
 * Service for managing ChatWoot queues for WAHA events
 * This service is used to avoid cycle dependency between ChatWoot module and SessionManager
 */
@Injectable()
export class ChatWootWAHAQueueService {
  constructor(
    @InjectQueue(QueueName.WAHA_MESSAGE_ANY)
    private readonly queueMessageAny: Queue,
    @InjectQueue(QueueName.WAHA_MESSAGE_REACTION)
    private readonly queueMessageReaction: Queue,
    @InjectQueue(QueueName.WAHA_MESSAGE_EDITED)
    private readonly queueMessageEdited: Queue,
    @InjectQueue(QueueName.WAHA_MESSAGE_REVOKED)
    private readonly queueMessageRevoked: Queue,
    @InjectQueue(QueueName.WAHA_MESSAGE_READ)
    private readonly queueMessageRead: Queue,
    @InjectQueue(QueueName.WAHA_SESSION_STATUS)
    private readonly queueSessionStatus: Queue,
  ) {}

  /**
   * Get the specific queue for an event
   * @param event The event to get the queue for
   * @returns The queue for the event, or null if there is no specific queue
   */
  private getQueueForEvent(event: WAHAEvents): Queue | null {
    switch (event) {
      case WAHAEvents.MESSAGE_ANY:
        return this.queueMessageAny;
      case WAHAEvents.MESSAGE_REACTION:
        return this.queueMessageReaction;
      case WAHAEvents.MESSAGE_EDITED:
        return this.queueMessageEdited;
      case WAHAEvents.MESSAGE_REVOKED:
        return this.queueMessageRevoked;
      case WAHAEvents.MESSAGE_ACK:
        return this.queueMessageRead;
      case WAHAEvents.SESSION_STATUS:
        return this.queueSessionStatus;
      default:
        return null;
    }
  }

  /**
   * Add a job to the queue for an event
   */
  private async addJobToQueue(
    event: WAHAEvents,
    data: any,
    appId: string,
  ): Promise<void> {
    const queue = this.getQueueForEvent(event);
    if (queue) {
      await queue.add(data.event, { app: appId, event: data });
    }
  }

  /**
   * Configure ChatWoot event handling for a session
   */
  listenEvents(appId: string, session: WhatsappSession): void {
    const events = ListenEventsForChatWoot();
    for (const event of events) {
      const obs$ = session.getEventObservable(event);
      obs$.subscribe(async (payload) => {
        const data = populateSessionInfo(event, session)(payload);
        await this.addJobToQueue(event, data, appId);
      });
    }
  }
}
