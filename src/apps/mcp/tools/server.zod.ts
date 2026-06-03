import { z } from 'zod';

export const EnvironmentInput = z.object({
  all: z
    .boolean()
    .optional()
    .describe('Include all environment variables, not just WAHA_* ones'),
});

export const StopInput = z.object({
  force: z
    .boolean()
    .optional()
    .describe(
      'Force-terminate immediately instead of graceful shutdown (SIGKILL vs SIGTERM)',
    ),
});
