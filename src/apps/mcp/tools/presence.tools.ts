import { z } from 'zod';
import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { McpController } from '@waha/apps/mcp/decorators/controller';
import { Tool } from '@waha/apps/mcp/decorators/tool';
import {
  PresenceChatInput,
  PresenceSessionInput,
  PresenceSetInput,
} from '@waha/apps/mcp/tools/presence.zod';

export class PresenceTools extends McpController {
  constructor(api: WAHASelf) {
    super(api);
  }

  @Tool('presence-set', {
    title: 'Set presence',
    description:
      'Set the session presence. Use ONLINE/OFFLINE for global scope (no chatId). ' +
      'Use TYPING/RECORDING/PAUSED with a chatId for chat-scoped presence.',
    inputSchema: PresenceSetInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async set({ session, ...body }: z.infer<typeof PresenceSetInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/presence`,
      data: body,
    });
  }

  @Tool('presence-get-all', {
    title: 'Get all presences',
    description: 'Get all subscribed presence information for a session',
    inputSchema: PresenceSessionInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getAll({ session }: z.infer<typeof PresenceSessionInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/presence`,
    });
  }

  @Tool('presence-get', {
    title: 'Get chat presence',
    description:
      'Get presence for a chat. Subscribes automatically if not yet subscribed.',
    inputSchema: PresenceChatInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async get({ session, chatId }: z.infer<typeof PresenceChatInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/presence/${chatId}`,
    });
  }

  @Tool('presence-subscribe', {
    title: 'Subscribe to presence',
    description: 'Subscribe to presence events for a chat',
    inputSchema: PresenceChatInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async subscribe({ session, chatId }: z.infer<typeof PresenceChatInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/presence/${chatId}/subscribe`,
    });
  }
}
