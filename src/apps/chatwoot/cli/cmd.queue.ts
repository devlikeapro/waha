import * as lodash from 'lodash';
import { QueueManager } from '@waha/apps/chatwoot/services/QueueManager';
import { Locale } from '@waha/apps/chatwoot/i18n/locale';
import { Conversation } from '@waha/apps/chatwoot/client/Conversation';
import { QueueRegistry } from '@waha/apps/chatwoot/services/QueueRegistry';
import { QueueNameRepr } from '@waha/apps/app_sdk/JobUtils';

export interface QueueCommandContext {
  queues: {
    registry: QueueRegistry;
  };
  l: Locale;
  conversation: Conversation;
}

export async function QueueStatus(ctx: QueueCommandContext, name: string) {
  const manager = new QueueManager(ctx.queues.registry);
  const names = manager.resolve(name);
  let result = await manager.status(names);
  for (const status of result) {
    status.name = QueueNameRepr(status.name);
  }
  const categoryOrder = ['inbox', 'whatsapp', 'task', 'scheduled'];
  const categoryIndex = (name: string) => {
    const category = name.split(' | ')[0];
    const index = categoryOrder.indexOf(category);
    return index === -1 ? categoryOrder.length : index;
  };
  // locked: true - last, then by category (inbox/whatsapp/task/scheduled), then by name
  result = lodash.sortBy(result, [
    (x) => !!x.locked,
    (x) => categoryIndex(x.name),
    'name',
  ]);
  const msg = ctx.l.r('cli.cmd.queue.status.result', {
    queues: result,
  });
  await ctx.conversation.incoming(msg);
}

export async function QueueStart(ctx: QueueCommandContext, name: string) {
  const manager = new QueueManager(ctx.queues.registry);
  const names = manager.resolve(name);
  await manager.resume(names);
  const msg = ctx.l.r('cli.cmd.queue.resumed');
  await ctx.conversation.activity(msg);
}

export async function QueueStop(ctx: QueueCommandContext, name?: string) {
  const manager = new QueueManager(ctx.queues.registry);
  const names = manager.resolve(name);
  await manager.pause(names);
  const msg = ctx.l.r('cli.cmd.queue.paused');
  await ctx.conversation.activity(msg);
}
