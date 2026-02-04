import { Agent } from 'https';

export interface Agents {
  socket: Agent;
  fetch: Agent;
}
