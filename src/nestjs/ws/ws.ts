import { WebSocket as WSWebSocket } from 'ws';

export interface WebSocket extends WSWebSocket {
  id?: string;
  isAlive?: boolean;
}
