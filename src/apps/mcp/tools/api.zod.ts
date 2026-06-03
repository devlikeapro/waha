import { z } from 'zod';

export const APIInput = z.object({
  path: z
    .string()
    .describe(
      'API path to call, e.g: /api/sessions&query=here, include query in path, no host and protocol required.',
    ),
  method: z
    .enum(['GET', 'POST', 'DELETE', 'PATCH'])
    .describe('API method to call'),
  body: z.any().optional().describe('Body if required by openapi spec'),
});
