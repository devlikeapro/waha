import { z } from 'zod';
import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { McpController } from '@waha/apps/mcp/decorators/controller';
import { Tool } from '@waha/apps/mcp/decorators/tool';
import {
  DeleteStatusInput,
  ImageStatusInput,
  StatusSessionInput,
  TextStatusInput,
  VideoStatusInput,
  VoiceStatusInput,
} from '@waha/apps/mcp/tools/status.zod';

const FileNote =
  'Use file.url for remote HTTP/HTTPS URLs. ' +
  'For local file paths - encode as base64 and pass via file.data instead.';

export class StatusTools extends McpController {
  constructor(api: WAHASelf) {
    super(api);
  }

  @Tool('status-send-text', {
    title: 'Send text status',
    description: 'Post a text WhatsApp status update',
    inputSchema: TextStatusInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async sendText({ session, ...body }: z.infer<typeof TextStatusInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/status/text`,
      data: body,
    });
  }

  @Tool('status-send-image', {
    title: 'Send image status',
    description: 'Post an image WhatsApp status update. ' + FileNote,
    inputSchema: ImageStatusInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async sendImage({ session, ...body }: z.infer<typeof ImageStatusInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/status/image`,
      data: body,
    });
  }

  @Tool('status-send-voice', {
    title: 'Send voice status',
    description: 'Post a voice WhatsApp status update. ' + FileNote,
    inputSchema: VoiceStatusInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async sendVoice({ session, ...body }: z.infer<typeof VoiceStatusInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/status/voice`,
      data: body,
    });
  }

  @Tool('status-send-video', {
    title: 'Send video status',
    description: 'Post a video WhatsApp status update. ' + FileNote,
    inputSchema: VideoStatusInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async sendVideo({ session, ...body }: z.infer<typeof VideoStatusInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/status/video`,
      data: body,
    });
  }

  @Tool('status-delete', {
    title: 'Delete status',
    description: 'Delete a posted WhatsApp status update',
    inputSchema: DeleteStatusInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
    },
  })
  async delete({ session, ...body }: z.infer<typeof DeleteStatusInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/status/delete`,
      data: body,
    });
  }

  @Tool('status-new-message-id', {
    title: 'Generate status message ID',
    description:
      'Generate a new message ID to use when sending a status update',
    inputSchema: StatusSessionInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async newMessageId({ session }: z.infer<typeof StatusSessionInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/status/new-message-id`,
    });
  }
}
