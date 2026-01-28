import * as grpc from '@grpc/grpc-js';
import { messages } from '@waha/core/engines/gows/grpc/gows';

export function BuildMessageServiceClient(
  address: string,
  credentials: grpc.ChannelCredentials,
): messages.MessageServiceClient {
  return new messages.MessageServiceClient(address, credentials, {
    'grpc.max_send_message_length': 128 * 1024 * 1024,
    'grpc.max_receive_message_length': 128 * 1024 * 1024,
  });
}

export function BuildEventStreamClient(
  address: string,
  credentials: grpc.ChannelCredentials,
): messages.EventStreamClient {
  return new messages.EventStreamClient(address, credentials, {
    'grpc.max_send_message_length': 128 * 1024 * 1024,
    'grpc.max_receive_message_length': 128 * 1024 * 1024,
  });
}
