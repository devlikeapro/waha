import { z } from 'zod';
import { DtoToZod } from '@waha/apps/mcp/schemas/DtoToZod';
import { LabelBody, SetLabelsRequest } from '@waha/structures/labels.dto';

const SessionField = z.string().describe('Session name');
const LabelIdField = z.string().describe('Label ID');
const ChatIdField = z.string().describe('Chat ID (e.g. 111111111111111@lid)');

export const LabelsSessionInput = z.object({ session: SessionField });

export const LabelIdInput = z.object({
  session: SessionField,
  labelId: LabelIdField,
});

export const LabelBodyInput = DtoToZod(LabelBody).extend({
  session: SessionField,
});

export const LabelUpdateInput = DtoToZod(LabelBody).extend({
  session: SessionField,
  labelId: LabelIdField,
});

export const LabelChatInput = z.object({
  session: SessionField,
  chatId: ChatIdField,
});

export const SetChatLabelsInput = DtoToZod(SetLabelsRequest).extend({
  session: SessionField,
  chatId: ChatIdField,
});
