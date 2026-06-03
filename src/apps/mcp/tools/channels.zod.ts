import { z } from 'zod';
import { DtoToZod } from '@waha/apps/mcp/schemas/DtoToZod';
import {
  ChannelSearchByText,
  ChannelSearchByView,
  CreateChannelRequest,
  ListChannelsQuery,
  PreviewChannelMessages,
} from '@waha/structures/channels.dto';

const SessionField = z.string().describe('Session name');
const ChannelIdField = z
  .string()
  .describe('Channel ID (123@newsletter) or invite code');

export const ChannelsListInput = DtoToZod(ListChannelsQuery).extend({
  session: SessionField,
});

export const ChannelCreateInput = DtoToZod(CreateChannelRequest).extend({
  session: SessionField,
});

export const ChannelIdInput = z.object({
  session: SessionField,
  id: ChannelIdField,
});

export const ChannelPreviewMessagesInput = DtoToZod(
  PreviewChannelMessages,
).extend({
  session: SessionField,
  id: ChannelIdField,
});

export const ChannelSearchByViewInput = DtoToZod(ChannelSearchByView).extend({
  session: SessionField,
});

export const ChannelSearchByTextInput = DtoToZod(ChannelSearchByText).extend({
  session: SessionField,
});

export const ChannelSearchMetaInput = z.object({
  session: SessionField,
});
