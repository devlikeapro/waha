import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';
import { promisify } from 'util';

const PROTO_PATH = path.join(__dirname, 'proto', 'gows.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition) as {
  messages: {
    MessageService: grpc.ServiceClientConstructor;
  };
};

type SessionRef = { id: string };

export interface StartCallResult {
  call_id: string;
}

export interface ExchangeCallWebRTCResult {
  sdp_answer: string;
}

export interface CallStateResult {
  active: boolean;
  call_id: string;
  from: string;
  direction: string;
  status: string;
  event: string;
}

export class GowsCallsClient {
  private client: any;

  constructor(address: string, credentials: grpc.ChannelCredentials) {
    const Service = proto.messages.MessageService;
    this.client = new Service(address, credentials, {
      'grpc.max_send_message_length': 128 * 1024 * 1024,
      'grpc.max_receive_message_length': 128 * 1024 * 1024,
    }) as any;
  }

  close() {
    this.client.close();
  }

  private session(sessionId: string): SessionRef {
    return { id: sessionId };
  }

  async startCall(
    sessionId: string,
    jid: string,
    video: boolean,
  ): Promise<StartCallResult> {
    const fn = promisify(this.client.StartCall.bind(this.client));
    return fn({
      session: this.session(sessionId),
      jid,
      video,
    }) as Promise<StartCallResult>;
  }

  async acceptCall(
    sessionId: string,
    callId: string,
    ownerId?: string,
  ): Promise<void> {
    const fn = promisify(this.client.AcceptCall.bind(this.client));
    await fn({
      session: this.session(sessionId),
      call_id: callId,
      owner_id: ownerId,
    });
  }

  async endCall(sessionId: string, callId: string): Promise<void> {
    const fn = promisify(this.client.EndCall.bind(this.client));
    await fn({
      session: this.session(sessionId),
      call_id: callId,
    });
  }

  async exchangeCallWebRTC(
    sessionId: string,
    callId: string,
    sdpOffer: string,
  ): Promise<ExchangeCallWebRTCResult> {
    const fn = promisify(this.client.ExchangeCallWebRTC.bind(this.client));
    return fn({
      session: this.session(sessionId),
      call_id: callId,
      sdp_offer: sdpOffer,
    }) as Promise<ExchangeCallWebRTCResult>;
  }

  async getCallState(sessionId: string): Promise<CallStateResult> {
    const fn = promisify(this.client.GetCallState.bind(this.client));
    return fn({
      id: sessionId,
    }) as Promise<CallStateResult>;
  }
}
