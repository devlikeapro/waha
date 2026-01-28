import {
  BeforeApplicationShutdown,
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
import { WebSocketAuth } from '@waha/core/auth/WebSocketAuth';
import { WebsocketHeartbeatJob } from '@waha/nestjs/ws/WebsocketHeartbeatJob';
import { WebSocket } from '@waha/nestjs/ws/ws';
import { WAHAEvents, WAHAEventsWild } from '@waha/structures/enums.dto';
import { EventWildUnmask } from '@waha/utils/events';
import { generatePrefixedId } from '@waha/utils/ids';
import { IncomingMessage } from 'http';
import { URL } from 'url';
import { Server } from 'ws';
import { CaslAbilityFactory } from '@waha/core/auth/casl.ability';
import { Action, session as SessionName } from '@waha/core/auth/casl.types';

export enum WebSocketCloseCode {
  NORMAL = 1000,
  GOING_AWAY = 1001,
  PROTOCOL_ERROR = 1002,
  UNSUPPORTED_DATA = 1003,
  POLICY_VIOLATION = 1008,
  INTERNAL_ERROR = 1011,
}

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
  HEARTBEAT_INTERVAL = 60_000;

  @WebSocketServer()
  server: Server;

  private readonly logger: LoggerService;
  private heartbeat: WebsocketHeartbeatJob;
  private eventUnmask = new EventWildUnmask(WAHAEvents, WAHAEventsWild);

  constructor(
    private manager: SessionManager,
    private auth: WebSocketAuth,
    private readonly casl: CaslAbilityFactory,
  ) {
    this.logger = new Logger('WebsocketGateway');
    this.heartbeat = new WebsocketHeartbeatJob(
      this.logger,
      this.HEARTBEAT_INTERVAL,
    );
  }

  async handleConnection(
    socket: WebSocket,
    request: IncomingMessage,
    ...args
  ): Promise<any> {
    // wsc - websocket client
    socket.id = generatePrefixedId('wsc');

    const user = await this.auth.validateRequest(request);
    if (!user) {
      // Not authorized - close connection
      socket.close(WebSocketCloseCode.POLICY_VIOLATION, 'Unauthorized');
      this.logger.debug(
        `Unauthorized websocket connection attempt: ${request.url} - ${socket.id}`,
      );
      return;
    }

    const params = this.getParams(request);
    let session: string = params.session;
    const ability = this.casl.createForUser(user);
    if (session == '*' && !ability.can(Action.Use, 'all')) {
      // Limit user to listen only the session events
      session = user.session;
    }

    if (!ability.can(Action.Use, new SessionName(session))) {
      socket.close(WebSocketCloseCode.POLICY_VIOLATION, 'Forbidden');
    }

    this.logger.debug(`New client connected: ${request.url} - ${socket.id}`);
    const events: WAHAEvents[] = params.events;
    this.logger.debug(
      `Client connected to session: '${session}', events: ${events}, ${socket.id}`,
    );

    const sub = this.manager
      .getSessionEvents(session, events)
      .subscribe((data) => {
        setImmediate(() => {
          this.logger.debug(
            `Sending data to client, event.id: ${data.id}`,
            data,
          );
          socket.send(JSON.stringify(data), (err) => {
            if (!err) {
              return;
            }
            this.logger.error(`Error sending data to client: ${err}`);
          });
        });
      });
    socket.on('close', () => {
      this.logger.debug(`Client disconnected - ${socket.id}`);
      sub.unsubscribe();
    });
  }

  private getParams(request: IncomingMessage) {
    // We need only search params, so localhost is fine here
    const query = new URL(request.url, 'http://localhost').searchParams;
    const session = query.get('session') || '*';
    const paramsEvents = query.getAll('events');
    const eventsRaw = paramsEvents.length > 0 ? paramsEvents : ['*'];
    const eventsList = eventsRaw.flatMap((value) => value.split(','));
    const events = this.eventUnmask.unmask(eventsList);
    return { session, events };
  }

  handleDisconnect(socket: WebSocket): any {
    this.logger.debug(`Client disconnected - ${socket.id}`);
  }

  async beforeApplicationShutdown(signal?: string) {
    this.logger.log('Shutting down websocket server');
    this.heartbeat?.stop();
    // Allow pending messages to be sent, it can be even 1ms, just to release the event loop
    await sleep(100);
    this.logger.log('Websocket server is down');
  }

  afterInit(server: Server) {
    this.logger.debug('Websocket server initialized');

    this.logger.debug('Starting heartbeat service...');
    this.heartbeat.start(server);
    this.logger.debug('Heartbeat service started');
  }
}
