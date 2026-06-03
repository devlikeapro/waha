import { z } from 'zod';
import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { McpController } from '@waha/apps/mcp/decorators/controller';
import { Tool } from '@waha/apps/mcp/decorators/tool';
import { RejectCallInput } from '@waha/apps/mcp/tools/calls.zod';

export class CallTools extends McpController {
  constructor(api: WAHASelf) {
    super(api);
  }

  @Tool('calls-reject', {
    title: 'Reject incoming call',
    description: 'Reject an incoming WhatsApp call',
    inputSchema: RejectCallInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async rejectCall({ session, ...body }: z.infer<typeof RejectCallInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/calls/reject`,
      data: body,
    });
  }
}
