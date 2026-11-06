import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
  UnprocessableEntityException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { Action } from '@waha/core/auth/casl.types';
import { CanSession, FromParam } from '@waha/core/auth/policies';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { ProxyService } from '@waha/core/proxy/proxy.service';
import { SessionApiParam } from '@waha/nestjs/params/SessionApiParam';
import { WAHAValidationPipe } from '@waha/nestjs/pipes/WAHAValidationPipe';
import {
  ProxyConnectResult,
  ProxyExitIpResult,
  ProxyHttpResult,
  ProxyInfo,
  ProxySource,
  ProxyWebSocketResult,
  SessionProxyConnectRequest,
  SessionProxyExitIpRequest,
  SessionProxyHttpRequest,
  SessionProxyWebSocketRequest,
} from '@waha/structures/proxy.dto';
import { ProxyConfig, SessionConfig } from '@waha/structures/sessions.dto';

@ApiSecurity('api_key')
@Controller('api/sessions')
@ApiTags('🖥️ Sessions')
@UseGuards(PoliciesGuard)
export class SessionsProxyController {
  constructor(
    private readonly manager: SessionManager,
    private readonly proxyService: ProxyService,
  ) {}

  @Post(':session/proxy/info')
  @SessionApiParam
  @ApiOperation({
    summary: 'Get the session proxy',
    description: 'Shows the proxy URL the session uses, without credentials.',
  })
  @ApiOkResponse({ type: ProxyInfo })
  @UsePipes(new WAHAValidationPipe())
  @CheckPolicies(CanSession(Action.Setting, FromParam('session')))
  async info(@Param('session') name: string): Promise<ProxyInfo> {
    const exists = await this.manager.exists(name);
    if (!exists) {
      throw new NotFoundException('Session not found');
    }
    const config = await this.manager.sessionConfigRepository.getConfig(name);
    if (config?.proxy?.server) {
      return this.proxyService.info(config.proxy, ProxySource.SESSION);
    }
    const proxy = this.sessionProxy(name, config);
    return this.proxyService.info(proxy, ProxySource.ENVIRONMENT);
  }

  @Post(':session/proxy/probe/connect')
  @SessionApiParam
  @ApiOperation({
    summary: 'Check the proxy is reachable',
    description: 'Connects to the proxy server to confirm it is reachable.',
  })
  @ApiOkResponse({ type: ProxyConnectResult })
  @UsePipes(new WAHAValidationPipe())
  @CheckPolicies(CanSession(Action.Setting, FromParam('session')))
  async connect(
    @Param('session') name: string,
    @Body() request: SessionProxyConnectRequest,
  ): Promise<ProxyConnectResult> {
    const proxy = await this.proxyOf(name);
    return this.proxyService.connect(proxy, request);
  }

  @Post(':session/proxy/probe/http')
  @SessionApiParam
  @ApiOperation({
    summary: 'Check a website is reachable through the proxy',
    description:
      'Sends a request to a website through the proxy. ' +
      'Confirms the proxy accepts the credentials and reaches the internet.',
  })
  @ApiOkResponse({ type: ProxyHttpResult })
  @UsePipes(new WAHAValidationPipe())
  @CheckPolicies(CanSession(Action.Setting, FromParam('session')))
  async http(
    @Param('session') name: string,
    @Body() request: SessionProxyHttpRequest,
  ): Promise<ProxyHttpResult> {
    const proxy = await this.proxyOf(name);
    return this.proxyService.http(proxy, request);
  }

  @Post(':session/proxy/probe/exit-ip')
  @SessionApiParam
  @ApiOperation({
    summary: 'Check the exit IP of the proxy',
    description: 'Reads the IP address the internet sees behind the proxy.',
  })
  @ApiOkResponse({ type: ProxyExitIpResult })
  @UsePipes(new WAHAValidationPipe())
  @CheckPolicies(CanSession(Action.Setting, FromParam('session')))
  async exitIp(
    @Param('session') name: string,
    @Body() request: SessionProxyExitIpRequest,
  ): Promise<ProxyExitIpResult> {
    const proxy = await this.proxyOf(name);
    return this.proxyService.exitIp(proxy, request);
  }

  @Post(':session/proxy/probe/websocket')
  @SessionApiParam
  @ApiOperation({
    summary: 'Check the proxy keeps a WebSocket connection open',
    description:
      'Holds a WebSocket connection through the proxy for the duration, idle or with periodic messages. ' +
      'Catches proxies that drop long-lived connections.',
  })
  @ApiOkResponse({ type: ProxyWebSocketResult })
  @UsePipes(new WAHAValidationPipe())
  @CheckPolicies(CanSession(Action.Setting, FromParam('session')))
  async websocket(
    @Param('session') name: string,
    @Body() request: SessionProxyWebSocketRequest,
  ): Promise<ProxyWebSocketResult> {
    const proxy = await this.proxyOf(name);
    return this.proxyService.websocket(proxy, request);
  }

  /**
   * The saved proxy, else the environment one - 422 when there is none
   */
  private sessionProxy(name: string, config: SessionConfig): ProxyConfig {
    const proxy = this.manager.resolveProxyConfig(name, config);
    if (!proxy?.server) {
      throw new UnprocessableEntityException(
        'The session does not use a proxy',
      );
    }
    return proxy;
  }

  /**
   * The proxy of an existing session
   */
  private async proxyOf(name: string): Promise<ProxyConfig> {
    const exists = await this.manager.exists(name);
    if (!exists) {
      throw new NotFoundException('Session not found');
    }
    const config = await this.manager.sessionConfigRepository.getConfig(name);
    return this.sessionProxy(name, config);
  }
}
