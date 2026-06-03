import { z } from 'zod';
import { DtoToZod } from '@waha/apps/mcp/schemas/DtoToZod';
import { LidsListQueryParams } from '@waha/structures/lids.dto';

const SessionField = z.string().describe('Session name');

export const LidsListInput = DtoToZod(LidsListQueryParams).extend({
  session: SessionField,
});

export const LidsSessionInput = z.object({ session: SessionField });

export const LidInput = z.object({
  session: SessionField,
  lid: z.string().describe('LID (e.g. 1111111@lid)'),
});

export const PhoneNumberInput = z.object({
  session: SessionField,
  phoneNumber: z
    .string()
    .describe('Phone number / chat ID (e.g. 3333333@c.us)'),
});
