import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Action } from '@waha/core/auth/casl.types';
import { CanSession } from '@waha/core/auth/policies';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { ProxyService } from '@waha/core/proxy/proxy.service';
import { WAHAValidationPipe } from '@waha/nestjs/pipes/WAHAValidationPipe';
import {
  ProxyConnectRequest,
  ProxyConnectResult,
  ProxyExitIpRequest,
  ProxyExitIpResult,
  ProxyHttpRequest,
  ProxyHttpResult,
  ProxyInfo,
  ProxyRequest,
  ProxySource,
  ProxyWebSocketRequest,
  ProxyWebSocketResult,
} from '@waha/structures/proxy.dto';

@ApiSecurity('api_key')
@Controller('api/proxy')
@ApiTags('🌐 Proxy')
@UseGuards(PoliciesGuard)
@CheckPolicies(CanSession(Action.Setting))
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post('info')
  @ApiOperation({
    summary: 'Get the proxy URL',
    description: 'Shows the proxy URL, without credentials.',
  })
  @ApiOkResponse({ type: ProxyInfo })
  @UsePipes(new WAHAValidationPipe())
  info(@Body() request: ProxyRequest): ProxyInfo {
    return this.proxyService.info(request.proxy, ProxySource.REQUEST);
  }

  @Post('probe/connect')
  @ApiOperation({
    summary: 'Check the proxy is reachable',
    description: 'Connects to the proxy server to confirm it is reachable.',
  })
  @ApiOkResponse({ type: ProxyConnectResult })
  @UsePipes(new WAHAValidationPipe())
  connect(@Body() request: ProxyConnectRequest): Promise<ProxyConnectResult> {
    return this.proxyService.connect(request.proxy, request);
  }

  @Post('probe/http')
  @ApiOperation({
    summary: 'Check a website is reachable through the proxy',
    description:
      'Sends a request to a website through the proxy. ' +
      'Confirms the proxy accepts the credentials and reaches the internet.',
  })
  @ApiOkResponse({ type: ProxyHttpResult })
  @UsePipes(new WAHAValidationPipe())
  http(@Body() request: ProxyHttpRequest): Promise<ProxyHttpResult> {
    return this.proxyService.http(request.proxy, request);
  }

  @Post('probe/exit-ip')
  @ApiOperation({
    summary: 'Check the exit IP of the proxy',
    description: 'Reads the IP address the internet sees behind the proxy.',
  })
  @ApiOkResponse({ type: ProxyExitIpResult })
  @UsePipes(new WAHAValidationPipe())
  exitIp(@Body() request: ProxyExitIpRequest): Promise<ProxyExitIpResult> {
    return this.proxyService.exitIp(request.proxy, request);
  }

  @Post('probe/websocket')
  @ApiOperation({
    summary: 'Check the proxy keeps a WebSocket connection open',
    description:
      'Holds a WebSocket connection through the proxy for the duration, idle or with periodic messages. ' +
      'Catches proxies that drop long-lived connections.',
  })
  @ApiOkResponse({ type: ProxyWebSocketResult })
  @UsePipes(new WAHAValidationPipe())
  websocket(
    @Body() request: ProxyWebSocketRequest,
  ): Promise<ProxyWebSocketResult> {
    return this.proxyService.websocket(request.proxy, request);
  }
}
