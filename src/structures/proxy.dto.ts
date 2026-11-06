import { applyDecorators } from '@nestjs/common';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { ProxyConfig } from '@waha/structures/sessions.dto';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export enum ProxySource {
  SESSION = 'session',
  ENVIRONMENT = 'environment',
  REQUEST = 'request',
}

export enum ProxyHttpMethod {
  GET = 'GET',
  HEAD = 'HEAD',
}

export enum ProxyErrorCode {
  AUTH_FAILED = 'PROXY_AUTH_FAILED',
  CONNECTION_REFUSED = 'PROXY_CONNECTION_REFUSED',
  HOST_NOT_FOUND = 'PROXY_HOST_NOT_FOUND',
  TIMEOUT = 'PROXY_TIMEOUT',
  REJECTED = 'PROXY_REJECTED',
  DISCONNECTED = 'PROXY_DISCONNECTED',
  INVALID = 'PROXY_INVALID',
  FAILED = 'PROXY_FAILED',
}

export class ProxyProbeError {
  @ApiProperty({ enum: ProxyErrorCode, example: ProxyErrorCode.AUTH_FAILED })
  code: ProxyErrorCode;

  @ApiProperty({ example: 'The proxy refused the username or password (407)' })
  message: string;
}

/**
 * Requests
 */
export function ProxyProbeTimeout() {
  return applyDecorators(
    ApiProperty({
      description: 'How long to wait, in milliseconds.',
      default: 10_000,
      required: false,
    }),
    IsOptional(),
    IsInt(),
    Min(1_000),
    Max(60_000),
  );
}

export class ProxyRequest {
  @ApiProperty({ description: 'The proxy to check.', type: ProxyConfig })
  @IsDefined()
  @ValidateNested()
  @Type(() => ProxyConfig)
  proxy: ProxyConfig;
}

export class SessionProxyConnectRequest {
  @ProxyProbeTimeout()
  timeout: number = 10_000;
}

export class SessionProxyHttpRequest extends SessionProxyConnectRequest {
  @ApiProperty({
    description:
      'The server to reach through the proxy with one request. ' +
      'Any HTTP answer counts as reachable.',
    default: 'https://web.whatsapp.com/',
    required: false,
  })
  @IsOptional()
  @IsUrl({ require_tld: false, protocols: ['http', 'https'] })
  url: string = 'https://web.whatsapp.com/';

  @ApiProperty({
    description: 'The request method.',
    enum: ProxyHttpMethod,
    default: ProxyHttpMethod.HEAD,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProxyHttpMethod)
  method: ProxyHttpMethod = ProxyHttpMethod.HEAD;
}

export class SessionProxyExitIpRequest extends SessionProxyConnectRequest {
  @ApiProperty({
    description:
      'Where to read the exit IP from, through the proxy. ' +
      'The answer can be the plain IP, an "ip={ip}" line or JSON with "ip".',
    default: 'https://ifconfig.me/ip',
    required: false,
  })
  @IsOptional()
  @IsUrl({ require_tld: false })
  url: string = 'https://ifconfig.me/ip';
}

export class SessionProxyWebSocketRequest extends SessionProxyConnectRequest {
  @ApiProperty({
    description:
      'The WebSocket server to hold a connection to, through the proxy.',
    default: 'wss://echo.websocket.org',
    required: false,
  })
  @IsOptional()
  @IsUrl({ require_tld: false, protocols: ['ws', 'wss'] })
  url: string = 'wss://echo.websocket.org';

  @ApiProperty({
    description: 'How long to keep the connection open, in milliseconds.',
    default: 40_000,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1_000)
  @Max(600_000)
  duration: number = 40_000;

  @ApiProperty({
    description:
      'Send a message every N milliseconds while connected, like the WhatsApp keepalive. 0 = keep it idle.',
    default: 0,
    example: 30_000,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(600_000)
  pingInterval: number = 0;
}

export class ProxyConnectRequest extends IntersectionType(
  ProxyRequest,
  SessionProxyConnectRequest,
) {}
export class ProxyHttpRequest extends IntersectionType(
  ProxyRequest,
  SessionProxyHttpRequest,
) {}
export class ProxyExitIpRequest extends IntersectionType(
  ProxyRequest,
  SessionProxyExitIpRequest,
) {}
export class ProxyWebSocketRequest extends IntersectionType(
  ProxyRequest,
  SessionProxyWebSocketRequest,
) {}

/**
 * Responses
 */
export class ProxyInfo {
  @ApiProperty({
    description:
      'Where the proxy comes from - the session config, the WHATSAPP_PROXY_SERVER environment ' +
      'or the request body.',
    enum: ProxySource,
    example: ProxySource.SESSION,
  })
  source: ProxySource;

  @ApiProperty({
    description: 'The proxy URL, without credentials.',
    example: 'http://proxy.example.com:3128',
  })
  url: string;

  @ApiProperty({ example: null, nullable: true })
  username: string | null;
}

export class ProxyProbeResult {
  @ApiProperty({ description: 'The probe passed.' })
  ok: boolean;

  @ApiProperty({ type: ProxyProbeError, nullable: true })
  error: ProxyProbeError | null;
}

export class ProxyConnectResult extends ProxyProbeResult {
  @ApiProperty({
    description: 'Time to open the connection to the proxy, in milliseconds.',
    example: 45,
    nullable: true,
  })
  latency: number | null;

  @ApiProperty({
    description: 'The IP address the connection was opened to.',
    example: '203.0.113.5',
    nullable: true,
  })
  address: string | null;

  @ApiProperty({
    description: 'The port the connection was opened to.',
    example: 3128,
    nullable: true,
  })
  port: number | null;
}

export class ProxyExitIpResult extends ProxyProbeResult {
  @ApiProperty({
    description: 'The address the internet sees behind the proxy.',
    example: '203.0.113.10',
    nullable: true,
  })
  ip: string | null;

  @ApiProperty({ example: 'https://ifconfig.me/ip' })
  url: string;
}

export class ProxyHttpResult extends ProxyProbeResult {
  @ApiProperty({ example: 'https://web.whatsapp.com/' })
  url: string;

  @ApiProperty({ enum: ProxyHttpMethod, example: ProxyHttpMethod.HEAD })
  method: ProxyHttpMethod;

  @ApiProperty({
    description: 'The HTTP status the server answered with.',
    example: 200,
    nullable: true,
  })
  status: number | null;

  @ApiProperty({
    description: 'Round trip to the server through the proxy, in milliseconds.',
    example: 230,
    nullable: true,
  })
  latency: number | null;

  @ApiProperty({
    description:
      'What the server answered, up to 16 KB - to see a block page. Empty for HEAD.',
    example: '',
    nullable: true,
  })
  body: string | null;
}

export class ProxyWebSocketResult extends ProxyProbeResult {
  @ApiProperty({ example: 'wss://echo.websocket.org' })
  url: string;

  @ApiProperty({
    description:
      'How long the connection stayed open, in milliseconds. ' +
      'Equals the requested duration when ok, shorter when the proxy dropped it.',
    example: 40_000,
    nullable: true,
  })
  duration: number | null;

  @ApiProperty({ description: 'Messages sent while connected.', example: 10 })
  sent: number;

  @ApiProperty({ description: 'Messages echoed back.', example: 10 })
  received: number;
}
