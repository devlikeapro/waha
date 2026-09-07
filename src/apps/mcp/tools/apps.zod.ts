import { AppName } from '@waha/apps/app_sdk/apps/apps';
import { z } from 'zod';

export const AppPurgeInput = z.object({
  app: z.nativeEnum(AppName).describe('App name'),
  session: z.string().describe('Session name'),
});
