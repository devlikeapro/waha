import { z } from 'zod';
import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { McpController } from '@waha/apps/mcp/decorators/controller';
import { Tool } from '@waha/apps/mcp/decorators/tool';
import {
  ChannelCreateInput,
  ChannelIdInput,
  ChannelPreviewMessagesInput,
  ChannelsListInput,
  ChannelSearchByTextInput,
  ChannelSearchByViewInput,
  ChannelSearchMetaInput,
} from '@waha/apps/mcp/tools/channels.zod';

export class ChannelTools extends McpController {
  constructor(api: WAHASelf) {
    super(api);
  }

  @Tool('channels-list', {
    title: 'List channels',
    description: 'Get list of known WhatsApp channels for a session',
    inputSchema: ChannelsListInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async list({ session, ...query }: z.infer<typeof ChannelsListInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/channels`,
      params: query,
    });
  }

  @Tool('channels-create', {
    title: 'Create channel',
    description: 'Create a new WhatsApp channel',
    inputSchema: ChannelCreateInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async create({ session, ...body }: z.infer<typeof ChannelCreateInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/channels`,
      data: body,
    });
  }

  @Tool('channels-delete', {
    title: 'Delete channel',
    description: 'Delete a WhatsApp channel',
    inputSchema: ChannelIdInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
    },
  })
  async delete({ session, id }: z.infer<typeof ChannelIdInput>) {
    return this.textRequest({
      method: 'DELETE',
      url: `/api/${session}/channels/${id}`,
    });
  }

  @Tool('channels-get', {
    title: 'Get channel info',
    description:
      'Get channel information by ID (123@newsletter) or invite code/link',
    inputSchema: ChannelIdInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async get({ session, id }: z.infer<typeof ChannelIdInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/channels/${id}`,
    });
  }

  @Tool('channels-messages-preview', {
    title: 'Preview channel messages',
    description:
      'Preview recent messages from a channel by ID (123@newsletter) or invite code/link',
    inputSchema: ChannelPreviewMessagesInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async previewMessages({
    session,
    id,
    ...query
  }: z.infer<typeof ChannelPreviewMessagesInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/channels/${id}/messages/preview`,
      params: query,
    });
  }

  @Tool('channels-follow', {
    title: 'Follow channel',
    description: 'Follow a WhatsApp channel',
    inputSchema: ChannelIdInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async follow({ session, id }: z.infer<typeof ChannelIdInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/channels/${id}/follow`,
    });
  }

  @Tool('channels-unfollow', {
    title: 'Unfollow channel',
    description: 'Unfollow a WhatsApp channel',
    inputSchema: ChannelIdInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async unfollow({ session, id }: z.infer<typeof ChannelIdInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/channels/${id}/unfollow`,
    });
  }

  @Tool('channels-mute', {
    title: 'Mute channel',
    description: 'Mute notifications for a WhatsApp channel',
    inputSchema: ChannelIdInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async mute({ session, id }: z.infer<typeof ChannelIdInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/channels/${id}/mute`,
    });
  }

  @Tool('channels-unmute', {
    title: 'Unmute channel',
    description: 'Unmute notifications for a WhatsApp channel',
    inputSchema: ChannelIdInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async unmute({ session, id }: z.infer<typeof ChannelIdInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/channels/${id}/unmute`,
    });
  }

  @Tool('channels-search-by-view', {
    title: 'Search channels by view',
    description:
      'Search for public WhatsApp channels by view, countries, and categories',
    inputSchema: ChannelSearchByViewInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async searchByView({
    session,
    ...body
  }: z.infer<typeof ChannelSearchByViewInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/channels/search/by-view`,
      data: body,
    });
  }

  @Tool('channels-search-by-text', {
    title: 'Search channels by text',
    description: 'Search for public WhatsApp channels by text query',
    inputSchema: ChannelSearchByTextInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async searchByText({
    session,
    ...body
  }: z.infer<typeof ChannelSearchByTextInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/channels/search/by-text`,
      data: body,
    });
  }

  @Tool('channels-search-views', {
    title: 'Get channel search views',
    description:
      'Get available view options for channel search (e.g. RECOMMENDED)',
    inputSchema: ChannelSearchMetaInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getSearchViews({ session }: z.infer<typeof ChannelSearchMetaInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/channels/search/views`,
    });
  }

  @Tool('channels-search-countries', {
    title: 'Get channel search countries',
    description: 'Get available country codes for channel search',
    inputSchema: ChannelSearchMetaInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getSearchCountries({
    session,
  }: z.infer<typeof ChannelSearchMetaInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/channels/search/countries`,
    });
  }

  @Tool('channels-search-categories', {
    title: 'Get channel search categories',
    description: 'Get available category options for channel search',
    inputSchema: ChannelSearchMetaInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getSearchCategories({
    session,
  }: z.infer<typeof ChannelSearchMetaInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/channels/search/categories`,
    });
  }
}
