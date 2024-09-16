import { LoggerService } from '@nestjs/common';
import { WebSocket } from '@waha/nestjs/ws/ws';
import { WebSocketServer } from 'ws';

export class WebsocketHeartbeatJob {
  private interval: ReturnType<typeof setInterval>;

  constructor(
    private logger: LoggerService,
    private intervalTime: number = 10_000,
  ) {}

  start(server: WebSocketServer) {
    server.on('connection', (ws: WebSocket) => {
      ws.isAlive = true;
      ws.on('pong', this.onPong(ws));
    });

    this.interval = setInterval(() => {
      server.clients.forEach((client: WebSocket) => {
        if (client.isAlive === false) {
          this.logger.debug(
            `Terminating client connection due to heartbeat timeout, ${client.id}`,
          );
          return client.terminate();
        }

        client.isAlive = false;
        this.logger.debug(`Sending heartbeat (ping) to ${client.id}`);
        client.ping();
      });
    }, this.intervalTime);
  }

  stop() {
    clearInterval(this.interval);
    this.interval = null;
  }

  private onPong(ws: WebSocket) {
    return (event: any) => {
      ws.isAlive = true;
      this.logger.debug(`Heartbeat (pong) received from ${ws.id}`);
    };
  }
}
