import { QueueName } from '../consumers/QueueName';
import { QueueRegistry } from '@waha/apps/chatwoot/services/QueueRegistry';
import { Injectable } from '@nestjs/common';
import { QueueNameRepr } from '@waha/apps/app_sdk/JobUtils';

const Managable = true;
const Locked = false;

export interface QueueStatus {
  name: string;
  paused: boolean;
  locked: boolean;
}

@Injectable()
export class QueueManager {
  private readonly queues: Record<QueueName, boolean>;

  constructor(private readonly registry: QueueRegistry) {
    this.queues = {
      [QueueName.SCHEDULED_MESSAGE_CLEANUP]: Locked,
      [QueueName.SCHEDULED_CHECK_VERSION]: Managable,
      [QueueName.SCHEDULED_CHECK_TIER]: Locked,
      [QueueName.TASK_CONTACTS_PULL]: Locked,
      [QueueName.TASK_MESSAGES_PULL]: Locked,
      [QueueName.WAHA_SESSION_STATUS]: Locked,
      [QueueName.WAHA_MESSAGE_ANY]: Managable,
      [QueueName.WAHA_MESSAGE_REACTION]: Managable,
      [QueueName.WAHA_MESSAGE_EDITED]: Managable,
      [QueueName.WAHA_MESSAGE_REVOKED]: Managable,
      [QueueName.WAHA_MESSAGE_ACK]: Managable,
      [QueueName.WAHA_CALL_RECEIVED]: Managable,
      [QueueName.WAHA_CALL_ACCEPTED]: Managable,
      [QueueName.WAHA_CALL_REJECTED]: Managable,
      [QueueName.INBOX_MESSAGE_CREATED]: Managable,
      [QueueName.INBOX_MESSAGE_UPDATED]: Managable,
      [QueueName.INBOX_CONVERSATION_CREATED]: Managable,
      [QueueName.INBOX_CONVERSATION_STATUS_CHANGED]: Managable,
      [QueueName.INBOX_MESSAGE_DELETED]: Managable,
      [QueueName.INBOX_COMMANDS]: Locked,
    } satisfies Record<QueueName, boolean>;
  }

  async pause(queues: QueueName[] = null) {
    queues = queues || Object.values(QueueName);
    queues = this.managable(queues);
    for (const name of queues) {
      const queue = this.registry.queue(name);
      await queue.pause();
    }
  }

  async resume(queues: QueueName[] = null) {
    queues = queues || Object.values(QueueName);
    queues = this.managable(queues);
    for (const name of queues) {
      const queue = this.registry.queue(name);
      await queue.resume();
    }
  }

  resolve(shortcut: string | null): QueueName[] {
    const queues = Object.values(QueueName);
    switch (shortcut) {
      case 'inbox':
        return queues.filter((q) => q.startsWith('chatwoot.inbox'));
      case 'whatsapp':
      case 'waha':
        return queues.filter((q) => q.startsWith('chatwoot.waha'));
      case 'scheduled':
        return queues.filter((q) => q.startsWith('chatwoot.scheduled'));
      case 'task':
        return queues.filter((q) => q.startsWith('chatwoot.task'));
      case 'all':
      case '':
      case null:
      case undefined:
        return queues;

      default: {
        const matches = queues.filter((q) => q.split(' | ')[1] === shortcut);
        if (matches.length === 1) {
          return [matches[0]];
        }
        if (matches.length > 1) {
          const names = matches.map(QueueNameRepr).join(', ');
          throw new Error(
            `Ambiguous queue name "${shortcut}", matches: ${names}`,
          );
        }
        return [shortcut as QueueName];
      }
    }
  }

  protected managable(queues) {
    return queues.filter((q) => this.queues[q] === Managable);
  }

  async status(queues: QueueName[] = null): Promise<QueueStatus[]> {
    queues = queues || Object.values(QueueName);
    const result: QueueStatus[] = [];
    for (const name of queues) {
      const queue = this.registry.queue(name);
      const paused = await queue.isPaused();
      result.push({
        name: name,
        paused: paused,
        locked: this.queues[name] === Locked,
      });
    }
    return result;
  }
}
