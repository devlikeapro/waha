import * as grpc from '@grpc/grpc-js';
import { UnprocessableEntityException } from '@nestjs/common';
import {
  toDeleteForMeError,
  toDeleteForMeMessageIds,
} from '@waha/core/engines/gows/deleteForMe';

describe('toDeleteForMeMessageIds', () => {
  it('takes serialized and short message ids', () => {
    const ids = toDeleteForMeMessageIds([
      'false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA',
      'true_123123@g.us_BBBBBBBBBBBBBBBBBBBB_22222222222@c.us',
      'CCCCCCCCCCCCCCCCCCCC',
    ]);
    expect(ids).toEqual([
      'AAAAAAAAAAAAAAAAAAAA',
      'BBBBBBBBBBBBBBBBBBBB',
      'CCCCCCCCCCCCCCCCCCCC',
    ]);
  });

  it('refuses a malformed message id', () => {
    expect(() =>
      toDeleteForMeMessageIds(['false_AAAAAAAAAAAAAAAAAAAA']),
    ).toThrow(UnprocessableEntityException);
  });
});

describe('toDeleteForMeError', () => {
  it.each([
    grpc.status.NOT_FOUND,
    grpc.status.INVALID_ARGUMENT,
    grpc.status.FAILED_PRECONDITION,
  ])('answers 422 for gRPC status %s', (code) => {
    const error = toDeleteForMeError({
      code: code,
      details: "message not found: 'AAA'",
    });
    expect(error).toBeInstanceOf(UnprocessableEntityException);
    expect(error.message).toBe("message not found: 'AAA'");
  });

  it('keeps any other error', () => {
    const original = { code: grpc.status.UNAVAILABLE, details: 'unavailable' };
    expect(toDeleteForMeError(original)).toBe(original);
  });
});
