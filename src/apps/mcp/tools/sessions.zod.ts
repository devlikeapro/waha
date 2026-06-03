import { z } from 'zod';

import { DtoToZod } from '@waha/apps/mcp/schemas/DtoToZod';
import {
  ListSessionsQuery,
  SessionCreateRequest,
  SessionUpdateRequest,
} from '@waha/structures/sessions.dto';

export const SessionNameInput = z.object({
  session: z.string().describe('Session name'),
});

export const SessionListInput = DtoToZod(ListSessionsQuery);

export const SessionCreateInput = DtoToZod(SessionCreateRequest);

export const SessionUpdateInput = DtoToZod(SessionUpdateRequest).extend({
  session: z.string().describe('Session name'),
});
