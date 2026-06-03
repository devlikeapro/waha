import { z } from 'zod';
import { DtoToZod } from '@waha/apps/mcp/schemas/DtoToZod';
import {
  ProfileNameRequest,
  ProfilePictureRequest,
  ProfileStatusRequest,
} from '@waha/structures/profile.dto';

const SessionField = z.string().describe('Session name');

export const ProfileSessionInput = z.object({ session: SessionField });

export const ProfileNameInput = DtoToZod(ProfileNameRequest).extend({
  session: SessionField,
});

export const ProfileStatusInput = DtoToZod(ProfileStatusRequest).extend({
  session: SessionField,
});

export const ProfilePictureInput = DtoToZod(ProfilePictureRequest).extend({
  session: SessionField,
});
