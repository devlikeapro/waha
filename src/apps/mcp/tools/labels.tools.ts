import { z } from 'zod';
import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { McpController } from '@waha/apps/mcp/decorators/controller';
import { Tool } from '@waha/apps/mcp/decorators/tool';
import {
  LabelBodyInput,
  LabelChatInput,
  LabelIdInput,
  LabelsSessionInput,
  LabelUpdateInput,
  SetChatLabelsInput,
} from '@waha/apps/mcp/tools/labels.zod';

export class LabelTools extends McpController {
  constructor(api: WAHASelf) {
    super(api);
  }

  @Tool('labels-get-all', {
    title: 'Get all labels',
    description: 'Get all labels for a session',
    inputSchema: LabelsSessionInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getAll({ session }: z.infer<typeof LabelsSessionInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/labels`,
    });
  }

  @Tool('labels-create', {
    title: 'Create label',
    description: 'Create a new label (max 20 per session)',
    inputSchema: LabelBodyInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async create({ session, ...body }: z.infer<typeof LabelBodyInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/labels`,
      data: body,
    });
  }

  @Tool('labels-update', {
    title: 'Update label',
    description: 'Update an existing label name or color',
    inputSchema: LabelUpdateInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async update({
    session,
    labelId,
    ...body
  }: z.infer<typeof LabelUpdateInput>) {
    return this.textRequest({
      method: 'PUT',
      url: `/api/${session}/labels/${labelId}`,
      data: body,
    });
  }

  @Tool('labels-delete', {
    title: 'Delete label',
    description: 'Delete a label',
    inputSchema: LabelIdInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
    },
  })
  async delete({ session, labelId }: z.infer<typeof LabelIdInput>) {
    return this.textRequest({
      method: 'DELETE',
      url: `/api/${session}/labels/${labelId}`,
    });
  }

  @Tool('labels-get-chat-labels', {
    title: 'Get chat labels',
    description: 'Get all labels applied to a chat',
    inputSchema: LabelChatInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getChatLabels({ session, chatId }: z.infer<typeof LabelChatInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/labels/chats/${chatId}`,
    });
  }

  @Tool('labels-set-chat-labels', {
    title: 'Set chat labels',
    description: 'Replace all labels on a chat',
    inputSchema: SetChatLabelsInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async setChatLabels({
    session,
    chatId,
    ...body
  }: z.infer<typeof SetChatLabelsInput>) {
    return this.textRequest({
      method: 'PUT',
      url: `/api/${session}/labels/chats/${chatId}`,
      data: body,
    });
  }

  @Tool('labels-get-chats-by-label', {
    title: 'Get chats by label',
    description: 'Get all chats that have a given label applied',
    inputSchema: LabelIdInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getChatsByLabel({ session, labelId }: z.infer<typeof LabelIdInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/labels/${labelId}/chats`,
    });
  }
}
