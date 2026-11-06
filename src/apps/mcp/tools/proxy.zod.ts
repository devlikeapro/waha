import { z } from 'zod';

import { DtoToZod } from '@waha/apps/mcp/schemas/DtoToZod';
import {
  SessionProxyConnectRequest,
  SessionProxyExitIpRequest,
  SessionProxyHttpRequest,
  SessionProxyWebSocketRequest,
} from '@waha/structures/proxy.dto';
import { ProxyConfig } from '@waha/structures/sessions.dto';

// Either the proxy of a session, or any proxy given right here
const Target = {
  session: z
    .string()
    .optional()
    .describe(
      "Session name - checks the proxy of the session. Leave it out to check 'proxy'.",
    ),
  proxy: DtoToZod(ProxyConfig)
    .optional()
    .describe('The proxy to check, when there is no session.'),
};

export const ProxyInfoInput = z.object(Target);

export const ProxyConnectInput = DtoToZod(SessionProxyConnectRequest).extend(
  Target,
);

export const ProxyHttpInput = DtoToZod(SessionProxyHttpRequest).extend(Target);

export const ProxyExitIpInput = DtoToZod(SessionProxyExitIpRequest).extend(
  Target,
);

export const ProxyWebSocketInput = DtoToZod(
  SessionProxyWebSocketRequest,
).extend(Target);
