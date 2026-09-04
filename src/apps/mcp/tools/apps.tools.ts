import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { McpController } from '@waha/apps/mcp/decorators/controller';
import { Tool } from '@waha/apps/mcp/decorators/tool';
import { AppPurgeInput } from '@waha/apps/mcp/tools/apps.zod';
import { z } from 'zod';

export class AppsTools extends McpController {
  constructor(api: WAHASelf) {
    super(api);
  }

  @Tool('apps-purge', {
    title: 'Purge app storage',
    description:
      "Purge an app's stored data (messages, caches) for a session. " +
      'The app itself stays configured and keeps working.',
    inputSchema: AppPurgeInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
    },
  })
  async purge({ app, session }: z.infer<typeof AppPurgeInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/apps/${app}/${session}/purge`,
    });
  }
}
