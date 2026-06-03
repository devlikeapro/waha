import { Injectable } from '@nestjs/common';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Request, Response } from 'express';
import { WMcpServer } from './mcp.server';
import { SendTools } from './tools/send.tools';
import { AuthTools } from '@waha/apps/mcp/tools/auth.tools';
import { SessionTools } from '@waha/apps/mcp/tools/sessions.tools';
import { ChatTools } from '@waha/apps/mcp/tools/chats.tools';
import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { ApiTools } from '@waha/apps/mcp/tools/api.tools';
import { CallTools } from '@waha/apps/mcp/tools/calls.tools';
import { ChannelTools } from '@waha/apps/mcp/tools/channels.tools';
import { ContactTools } from '@waha/apps/mcp/tools/contacts.tools';
import { GroupTools } from '@waha/apps/mcp/tools/groups.tools';
import { LabelTools } from '@waha/apps/mcp/tools/labels.tools';
import { LidTools } from '@waha/apps/mcp/tools/lids.tools';
import { PingTools } from '@waha/apps/mcp/tools/ping.tools';
import { PresenceTools } from '@waha/apps/mcp/tools/presence.tools';
import { ProfileTools } from '@waha/apps/mcp/tools/profile.tools';
import { StatusTools } from '@waha/apps/mcp/tools/status.tools';
import { ServerTools } from '@waha/apps/mcp/tools/server.tools';

@Injectable()
export class McpService {
  async handlePost(req: Request, res: Response) {
    const apiKey = req.headers['x-api-key'] as string | undefined;
    const api = new WAHASelf(apiKey);
    const server = new WMcpServer([
      new PingTools(api),
      new SendTools(api),
      new AuthTools(api),
      new SessionTools(api),
      new ChatTools(api),
      new ApiTools(api),
      new CallTools(api),
      new ChannelTools(api),
      new ContactTools(api),
      new GroupTools(api),
      new LabelTools(api),
      new LidTools(api),
      new PresenceTools(api),
      new ProfileTools(api),
      new StatusTools(api),
      new ServerTools(api),
    ]);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless
    });

    res.on('close', () => {
      transport.close();
      server.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  }
}
