import { z } from 'zod';
import { DtoToZod } from '@waha/apps/mcp/schemas/DtoToZod';
import { RejectCallRequest } from '@waha/structures/calls.dto';

export const RejectCallInput = DtoToZod(RejectCallRequest).extend({
  session: z.string().describe('Session name'),
});
