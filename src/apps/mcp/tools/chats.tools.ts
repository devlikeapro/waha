import { z } from 'zod';
import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { McpController } from '@waha/apps/mcp/decorators/controller';
import { Tool } from '@waha/apps/mcp/decorators/tool';
import { TextMcpResponse } from '@waha/apps/mcp/responses';
import {
  ChatInput,
  ChatMessageInput,
  ChatMessagesInput,
  ChatPictureInput,
  ChatsListInput,
  ChatsOverviewBodyInput,
  ChatsOverviewInput,
  DeleteMessageInput,
  EditMessageInput,
  PinMessageInput,
  ReadChatMessagesInput,
  UnpinMessageInput,
} from '@waha/apps/mcp/tools/chats.zod';

function FetchMediaUsingApiKeyContent(key: string) {
  return {
    type: 'text' as const,
    text: `To fetch media use "X-Api-Key: ${key}" HTTP header. If the user wants to open it - add "?x-api-key=${key}" to query params`,
  };
}

export class ChatTools extends McpController {
  constructor(api: WAHASelf) {
    super(api);
  }

  @Tool('chats-list', {
    title: 'List chats',
    description: 'Get list of chats for a session',
    inputSchema: ChatsListInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async list({ session, ...pagination }: z.infer<typeof ChatsListInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/chats`,
      params: pagination,
    });
  }

  @Tool('chats-overview', {
    title: 'Get chats overview',
    description:
      'Get chats overview with last message, name, and picture. Sorted by last message timestamp',
    inputSchema: ChatsOverviewInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async overview({ session, ...params }: z.infer<typeof ChatsOverviewInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/chats/overview`,
      params: params,
    });
  }

  @Tool('chats-overview-post', {
    title: 'Get chats overview (POST)',
    description:
      'Get chats overview via POST body — use this instead of chats-overview when filtering by many chat ids',
    inputSchema: ChatsOverviewBodyInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async overviewPost({
    session,
    ...body
  }: z.infer<typeof ChatsOverviewBodyInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/chats/overview`,
      data: body,
    });
  }

  @Tool('chats-delete', {
    title: 'Delete chat',
    description: 'Delete a chat',
    inputSchema: ChatInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
    },
  })
  async deleteChat({ session, chatId }: z.infer<typeof ChatInput>) {
    return this.textRequest({
      method: 'DELETE',
      url: `/api/${session}/chats/${chatId}`,
    });
  }

  @Tool('chats-get-picture', {
    title: 'Get chat picture',
    description: 'Get the profile picture URL for a chat',
    inputSchema: ChatPictureInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getPicture({
    session,
    chatId,
    refresh,
  }: z.infer<typeof ChatPictureInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/chats/${chatId}/picture`,
      params: { refresh: refresh },
    });
  }

  @Tool('chats-get-messages', {
    title: 'Get chat messages',
    description:
      'Get messages in a chat. ' +
      'To retrieve all messages, paginate by incrementing the offset by limit until the returned array is empty or shorter than the limit. ' +
      'To fetch media for a specific message, use chats-get-message with that message id and downloadMedia=true instead of fetching it here.',
    inputSchema: ChatMessagesInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getMessages({
    session,
    chatId,
    _data,
    ...query
  }: z.infer<typeof ChatMessagesInput>) {
    const response = await this.request({
      method: 'GET',
      url: `/api/${session}/chats/${chatId}/messages`,
      params: query,
    });
    let messages = response.data;
    if (!_data && Array.isArray(messages)) {
      messages = messages.map((msg: any) => {
        const result = { ...msg };
        delete result._data;
        if (result.replyTo) {
          result.replyTo = { ...result.replyTo };
          delete result.replyTo._data;
        }
        return result;
      });
    }
    const responseText =
      typeof messages === 'string' ? messages : JSON.stringify(messages);
    const result = TextMcpResponse(
      JSON.stringify({ status: response.status, response: responseText }),
    );
    if (query.downloadMedia) {
      result.content.push(FetchMediaUsingApiKeyContent(this.api.key));
    }
    return result;
  }

  @Tool('chats-read-messages', {
    title: 'Read chat messages',
    description: 'Mark messages as read in a chat',
    inputSchema: ReadChatMessagesInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async readMessages({
    session,
    chatId,
    ...query
  }: z.infer<typeof ReadChatMessagesInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/chats/${chatId}/messages/read`,
      params: query,
    });
  }

  @Tool('chats-get-message', {
    title: 'Get message by ID',
    description: 'Get a specific message by its ID',
    inputSchema: ChatMessageInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getMessage({
    session,
    chatId,
    messageId,
    ...query
  }: z.infer<typeof ChatMessageInput>) {
    const result = await this.textRequest({
      method: 'GET',
      url: `/api/${session}/chats/${chatId}/messages/${messageId}`,
      params: query,
    });
    if (query.downloadMedia) {
      result.content.push(FetchMediaUsingApiKeyContent(this.api.key));
    }
    return result;
  }

  @Tool('chats-pin-message', {
    title: 'Pin message',
    description: 'Pin a message in a chat',
    inputSchema: PinMessageInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async pinMessage({
    session,
    chatId,
    messageId,
    duration,
  }: z.infer<typeof PinMessageInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/chats/${chatId}/messages/${messageId}/pin`,
      data: { duration: duration },
    });
  }

  @Tool('chats-unpin-message', {
    title: 'Unpin message',
    description: 'Unpin a message in a chat',
    inputSchema: UnpinMessageInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async unpinMessage({
    session,
    chatId,
    messageId,
  }: z.infer<typeof UnpinMessageInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/chats/${chatId}/messages/${messageId}/unpin`,
    });
  }

  @Tool('chats-clear-messages', {
    title: 'Clear chat messages',
    description: 'Delete all messages from a chat',
    inputSchema: ChatInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
    },
  })
  async clearMessages({ session, chatId }: z.infer<typeof ChatInput>) {
    return this.textRequest({
      method: 'DELETE',
      url: `/api/${session}/chats/${chatId}/messages`,
    });
  }

  @Tool('chats-delete-message', {
    title: 'Delete message',
    description: 'Delete a specific message from a chat',
    inputSchema: DeleteMessageInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
    },
  })
  async deleteMessage({
    session,
    chatId,
    messageId,
  }: z.infer<typeof DeleteMessageInput>) {
    return this.textRequest({
      method: 'DELETE',
      url: `/api/${session}/chats/${chatId}/messages/${messageId}`,
    });
  }

  @Tool('chats-edit-message', {
    title: 'Edit message',
    description: 'Edit the text of a sent message',
    inputSchema: EditMessageInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async editMessage({
    session,
    chatId,
    messageId,
    ...body
  }: z.infer<typeof EditMessageInput>) {
    return this.textRequest({
      method: 'PUT',
      url: `/api/${session}/chats/${chatId}/messages/${messageId}`,
      data: body,
    });
  }

  @Tool('chats-archive', {
    title: 'Archive chat',
    description: 'Archive a chat',
    inputSchema: ChatInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async archiveChat({ session, chatId }: z.infer<typeof ChatInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/chats/${chatId}/archive`,
    });
  }

  @Tool('chats-unarchive', {
    title: 'Unarchive chat',
    description: 'Unarchive a chat',
    inputSchema: ChatInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async unarchiveChat({ session, chatId }: z.infer<typeof ChatInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/chats/${chatId}/unarchive`,
    });
  }

  @Tool('chats-unread', {
    title: 'Mark chat as unread',
    description: 'Mark a chat as unread',
    inputSchema: ChatInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async unreadChat({ session, chatId }: z.infer<typeof ChatInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/chats/${chatId}/unread`,
    });
  }
}
