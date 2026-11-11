import * as grpc from '@grpc/grpc-js';
import { UnprocessableEntityException } from '@nestjs/common';
import { parseMessageIdSerialized } from '@waha/core/utils/ids';

// Serialized or short ids; GOWS reads chat, sender and direction from its storage
export function toDeleteForMeMessageIds(messageIds: string[]): string[] {
  return messageIds.map(toDeleteForMeMessageId);
}

function toDeleteForMeMessageId(messageId: string): string {
  try {
    return parseMessageIdSerialized(messageId, true).id;
  } catch (error) {
    throw new UnprocessableEntityException(
      `Invalid message id '${messageId}': ${error.message}`,
    );
  }
}

const CLIENT_ERROR_CODES: Set<number> = new Set([
  grpc.status.NOT_FOUND,
  grpc.status.INVALID_ARGUMENT,
  grpc.status.FAILED_PRECONDITION,
]);

// Unknown message, message of another chat or storage disabled: 422, not 500
export function toDeleteForMeError(error: any): any {
  if (CLIENT_ERROR_CODES.has(error?.code)) {
    return new UnprocessableEntityException(error.details ?? error.message);
  }
  return error;
}
