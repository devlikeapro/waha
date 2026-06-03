import { z } from 'zod';
import { DtoToZod } from '@waha/apps/mcp/schemas/DtoToZod';
import { WAHASessionPresence } from '@waha/structures/presence.dto';

const SessionField = z.string().describe('Session name');
const ChatIdField = z.string().describe('Chat ID (e.g. 11111@c.us)');

export const PresenceSessionInput = z.object({ session: SessionField });

export const PresenceSetInput = DtoToZod(WAHASessionPresence).extend({
  session: SessionField,
});

export const PresenceChatInput = z.object({
  session: SessionField,
  chatId: ChatIdField,
});
