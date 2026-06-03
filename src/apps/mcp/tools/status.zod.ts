import { z } from 'zod';
import { DtoToZod } from '@waha/apps/mcp/schemas/DtoToZod';
import {
  DeleteStatusRequest,
  ImageStatus,
  TextStatus,
  VideoStatus,
  VoiceStatus,
} from '@waha/structures/status.dto';

const SessionField = z.string().describe('Session name');

export const StatusSessionInput = z.object({ session: SessionField });

export const TextStatusInput = DtoToZod(TextStatus).extend({
  session: SessionField,
});

export const ImageStatusInput = DtoToZod(ImageStatus).extend({
  session: SessionField,
});

export const VoiceStatusInput = DtoToZod(VoiceStatus).extend({
  session: SessionField,
});

export const VideoStatusInput = DtoToZod(VideoStatus).extend({
  session: SessionField,
});

export const DeleteStatusInput = DtoToZod(DeleteStatusRequest).extend({
  session: SessionField,
});
