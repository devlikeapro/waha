import {
  BeforeApplicationShutdown,
  ConsoleLogger,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { sleep } from '@nestjs/terminus/dist/utils';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { WAHAEvents } from '@waha/structures/enums.dto';
import { WebsocketHeartbeatJob } from '@waha/utils/WebsocketHeartbeatJob';
import { WebSocket } from '@waha/utils/ws';
import { IncomingMessage } from 'http';
import * as lodash from 'lodash';
import * as url from 'url';
import { Server } from 'ws';

@WebSocketGateway({
  path: '/ws',
  cors: true,
})
export class WebsocketGatewayCore
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    BeforeApplicationShutdown
{
  HEARTBEAT_INTERVAL = 10_000;

  @WebSocketServer()
  server: Server;

  private listeners: Map<WebSocket, { session: string; events: string[] }> =
    new Map();

  private readonly logger: LoggerService;
  private heartbeat: WebsocketHeartbeatJob;

  constructor(private manager: SessionManager) {
    this.logger = new Logger('WebsocketGateway');
    this.heartbeat = new WebsocketHeartbeatJob(
      this.logger,
      this.HEARTBEAT_INTERVAL,
    );
  }

  handleConnection(socket: WebSocket, request: IncomingMessage, ...args): any {
    const random = Math.random().toString(36).substring(7);
    const id = `wsc_${random}`;
    socket.id = id;
    this.logger.debug(`New client connected: ${request.url}`);
    const params = this.getParams(id, request, socket);
    if (!params) {
      return;
    }
    const { session, events } = params;
    this.logger.debug(
      `Client connected to session: '${session}', events: ${events}, ${id}`,
    );
    this.listeners.set(socket, { session, events });
  }

  private getParams(id: string, request: IncomingMessage, socket: WebSocket) {
    const query = url.parse(request.url, true).query;
    const session = (query.session as string) || '*';
    if (session !== '*') {
      this.logger.warn(
        `Only connecting to all sessions is allowed for now, use session=*, ${id}`,
      );
      const error =
        'Only connecting to all sessions is allowed for now, use session=*';
      socket.close(4001, JSON.stringify({ error }));
      return null;
    }

    const events = ((query.events as string) || '*').split(',');
    if (
      !lodash.isEqual(events, ['*']) &&
      !lodash.isEqual(events, [WAHAEvents.SESSION_STATUS])
    ) {
      this.logger.warn(
        `Only \'session.status\' event is allowed for now, use events=session.status or events=*, ${id}`,
      );
      const error =
        "Only 'session.status' event is allowed for now, use events=session.status or events=*";
      socket.close(4001, JSON.stringify({ error }));
      return null;
    }
    return { session, events };
  }

  handleDisconnect(socket: WebSocket): any {
    this.logger.debug(`Client disconnected - ${socket.id}`);
    this.listeners.delete(socket);
  }

  async beforeApplicationShutdown(signal?: string) {
    this.logger.log('Shutting down websocket server');
    // Allow pending messages to be sent, it can be even 1ms, just to release the event loop
    await sleep(100);
    this.server.clients.forEach((options, client) => {
      client.close(1001, 'Server is shutting down');
    });
    // Do not turn off heartbeat service here,
    // it's responsible for terminating the connection that is not alive
    this.logger.log('Websocket server is down');
  }

  afterInit(server: Server) {
    this.logger.debug('Websocket server initialized');
    this.manager.events.on(
      WAHAEvents.SESSION_STATUS,
      this.sendToAll.bind(this),
    );
    this.logger.debug('Subscribed to manager events');

    this.logger.debug('Starting heartbeat service...');
    this.heartbeat.start(server);
    this.logger.debug('Heartbeat service started');
  }

  sendToAll(data: any) {
    this.listeners.forEach((options, client) => {
      if (options.events.length === 0) {
        return;
      }
      this.logger.debug('Sending data to client', data);
      client.send(JSON.stringify(data));
    });
  }
}
