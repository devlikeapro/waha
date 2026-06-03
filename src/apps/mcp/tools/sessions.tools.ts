import { z } from 'zod';
import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { McpController } from '@waha/apps/mcp/decorators/controller';
import { Tool } from '@waha/apps/mcp/decorators/tool';
import {
  SessionCreateInput,
  SessionListInput,
  SessionNameInput,
  SessionUpdateInput,
} from '@waha/apps/mcp/tools/sessions.zod';

export class SessionTools extends McpController {
  constructor(api: WAHASelf) {
    super(api);
  }

  @Tool('sessions-list', {
    title: 'List sessions',
    description: 'List all WhatsApp sessions',
    inputSchema: SessionListInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async list(params: z.infer<typeof SessionListInput>) {
    // Send back all sessions
    params.all = true;
    return this.textRequest({
      method: 'GET',
      url: '/api/sessions',
      params: params,
    });
  }

  @Tool('sessions-get', {
    title: 'Get session',
    description: 'Get information about a WhatsApp session',
    inputSchema: SessionNameInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async get({ session }: z.infer<typeof SessionNameInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/sessions/${session}`,
    });
  }

  @Tool('sessions-create', {
    title: 'Create session',
    description: 'Create a new WhatsApp session',
    inputSchema: SessionCreateInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async create(body: z.infer<typeof SessionCreateInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/sessions',
      data: body,
    });
  }

  @Tool('sessions-update', {
    title: 'Update session',
    description: 'Update config of an existing WhatsApp session',
    inputSchema: SessionUpdateInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async update({ session, ...body }: z.infer<typeof SessionUpdateInput>) {
    return this.textRequest({
      method: 'PUT',
      url: `/api/sessions/${session}`,
      data: body,
    });
  }

  @Tool('sessions-delete', {
    title: 'Delete session',
    description: 'Delete a WhatsApp session (stops and logs out)',
    inputSchema: SessionNameInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
    },
  })
  async delete({ session }: z.infer<typeof SessionNameInput>) {
    return this.textRequest({
      method: 'DELETE',
      url: `/api/sessions/${session}`,
    });
  }

  @Tool('sessions-start', {
    title: 'Start session',
    description: 'Start an existing WhatsApp session',
    inputSchema: SessionNameInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async start({ session }: z.infer<typeof SessionNameInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/sessions/${session}/start`,
    });
  }

  @Tool('sessions-stop', {
    title: 'Stop session',
    description: 'Stop a running WhatsApp session',
    inputSchema: SessionNameInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async stop({ session }: z.infer<typeof SessionNameInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/sessions/${session}/stop`,
    });
  }

  @Tool('sessions-logout', {
    title: 'Logout session',
    description: 'Logout from a WhatsApp session',
    inputSchema: SessionNameInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
    },
  })
  async logout({ session }: z.infer<typeof SessionNameInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/sessions/${session}/logout`,
    });
  }

  @Tool('sessions-restart', {
    title: 'Restart session',
    description: 'Restart a WhatsApp session',
    inputSchema: SessionNameInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async restart({ session }: z.infer<typeof SessionNameInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/sessions/${session}/restart`,
    });
  }
}
