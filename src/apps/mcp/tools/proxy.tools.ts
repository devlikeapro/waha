import { z } from 'zod';
import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { McpController } from '@waha/apps/mcp/decorators/controller';
import { Tool } from '@waha/apps/mcp/decorators/tool';
import {
  ProxyConnectInput,
  ProxyExitIpInput,
  ProxyHttpInput,
  ProxyInfoInput,
  ProxyWebSocketInput,
} from '@waha/apps/mcp/tools/proxy.zod';
import { ProxyConfig } from '@waha/structures/sessions.dto';

interface Target {
  session?: string;
  proxy?: ProxyConfig;
}

/**
 * The session endpoint when a session is given (its proxy, no proxy in the body), the /api/proxy one otherwise
 */
function proxyRequest(
  path: string,
  { session, proxy, ...body }: Target & Record<string, unknown>,
) {
  if (session) {
    return {
      method: 'POST',
      url: `/api/sessions/${session}/proxy/${path}`,
      data: body,
    };
  }
  return {
    method: 'POST',
    url: `/api/proxy/${path}`,
    data: { proxy: proxy, ...body },
  };
}

export class ProxyTools extends McpController {
  constructor(api: WAHASelf) {
    super(api);
  }

  @Tool('proxy-info', {
    title: 'Get proxy',
    description: 'Show the proxy URL, without credentials',
    inputSchema: ProxyInfoInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async info(input: z.infer<typeof ProxyInfoInput>) {
    return this.textRequest(proxyRequest('info', input));
  }

  @Tool('proxy-check-connect', {
    title: 'Check the proxy is reachable',
    description: 'Connect to the proxy server to confirm it is reachable',
    inputSchema: ProxyConnectInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async connect(input: z.infer<typeof ProxyConnectInput>) {
    return this.textRequest(proxyRequest('probe/connect', input));
  }

  @Tool('proxy-check-http', {
    title: 'Check a website is reachable through the proxy',
    description:
      'Send a request to a website through the proxy. ' +
      'Confirms the proxy accepts the credentials and reaches the internet',
    inputSchema: ProxyHttpInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async http(input: z.infer<typeof ProxyHttpInput>) {
    return this.textRequest(proxyRequest('probe/http', input));
  }

  @Tool('proxy-check-exit-ip', {
    title: 'Check the exit IP of the proxy',
    description: 'Read the IP address the internet sees behind the proxy',
    inputSchema: ProxyExitIpInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async exitIp(input: z.infer<typeof ProxyExitIpInput>) {
    return this.textRequest(proxyRequest('probe/exit-ip', input));
  }

  @Tool('proxy-check-websocket', {
    title: 'Check the proxy keeps a WebSocket connection open',
    description:
      'Hold a WebSocket connection through the proxy for the duration, idle or with periodic messages. ' +
      'Catches proxies that drop long-lived connections. The call lasts as long as the duration',
    inputSchema: ProxyWebSocketInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async websocket(input: z.infer<typeof ProxyWebSocketInput>) {
    return this.textRequest(proxyRequest('probe/websocket', input));
  }
}
