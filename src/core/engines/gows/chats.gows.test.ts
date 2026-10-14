import * as grpc from '@grpc/grpc-js';
import {
  ArgumentMetadata,
  BadRequestException,
  NotImplementedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  assertDeletableChatId,
  toDeleteChatError,
  toDeleteChatResponse,
} from '@waha/core/engines/gows/chats.gows';
import { messages } from '@waha/core/engines/gows/grpc/gows';
import { WAHAValidationPipe } from '@waha/nestjs/pipes/WAHAValidationPipe';
import { DeleteChatQuery } from '@waha/structures/chats.dto';

describe('toDeleteChatResponse', () => {
  it('gives each id the deletion was sent to and its last message', () => {
    const response = new messages.DeleteChatResponse({
      confirmed: true,
      purge: true,
      ranges: [
        new messages.DeleteChatRange({
          jid: '123456789012345@lid',
          lastMessageTimestamp: 1760000500,
          lastMessageId: 'NEW-LID',
          lastMessageFromMe: true,
          lastMessageSender: '22600000000@s.whatsapp.net',
          lastMessageSentAt: 1760000500,
        }),
        new messages.DeleteChatRange({
          jid: '22670000000@s.whatsapp.net',
          lastMessageTimestamp: 1760000500,
        }),
      ],
    });

    expect(toDeleteChatResponse('22670000000@c.us', false, response)).toEqual({
      success: true,
      id: '22670000000@c.us',
      deleteMedia: false,
      purge: true,
      confirmed: true,
      ranges: [
        {
          chatId: '123456789012345@lid',
          lastMessageTimestamp: 1760000500,
          lastMessage: {
            id: 'true_123456789012345@lid_NEW-LID',
            timestamp: 1760000500,
          },
        },
        {
          chatId: '22670000000@c.us',
          lastMessageTimestamp: 1760000500,
          lastMessage: null,
        },
      ],
    });
  });

  it('gives the sender in the id of a group message', () => {
    const response = new messages.DeleteChatResponse({
      confirmed: false,
      ranges: [
        new messages.DeleteChatRange({
          jid: '120363000000000000@g.us',
          lastMessageTimestamp: 1750000000,
          lastMessageId: 'GROUP-ID',
          lastMessageFromMe: false,
          lastMessageSender: '22222@lid',
          lastMessageSentAt: 1750000000,
        }),
      ],
    });

    const result = toDeleteChatResponse(
      '120363000000000000@g.us',
      true,
      response,
    );

    expect(result.confirmed).toBe(false);
    expect(result.deleteMedia).toBe(true);
    expect(result.ranges[0].lastMessage.id).toBe(
      'false_120363000000000000@g.us_GROUP-ID_22222@lid',
    );
  });
});

function grpcError(code: grpc.status, details: string): any {
  const error: any = new Error(`${code} ${grpc.status[code]}: ${details}`);
  error.code = code;
  error.details = details;
  return error;
}

describe('toDeleteChatError', () => {
  it('gives 422 for an id GOWS refuses', () => {
    const error = toDeleteChatError(
      grpcError(grpc.status.INVALID_ARGUMENT, 'invalid chat jid "abc"'),
    );

    expect(error).toBeInstanceOf(UnprocessableEntityException);
    expect(error.getStatus()).toBe(422);
    expect(error.message).toBe('invalid chat jid "abc"');
  });

  it('gives 422 for a group the account is still in', () => {
    const error = toDeleteChatError(
      grpcError(
        grpc.status.FAILED_PRECONDITION,
        'this account is still in group 1@g.us, leave the group before deleting it',
      ),
    );

    expect(error).toBeInstanceOf(UnprocessableEntityException);
    expect(error.message).toContain('leave the group');
  });

  it('gives 501 for a GOWS without DeleteChat', () => {
    const error = toDeleteChatError(
      grpcError(grpc.status.UNIMPLEMENTED, 'unknown method DeleteChat'),
    );

    expect(error).toBeInstanceOf(NotImplementedException);
    expect(error.getStatus()).toBe(501);
  });

  it('leaves other errors as they are', () => {
    const unavailable = grpcError(grpc.status.UNAVAILABLE, 'no connection');
    const plain = new Error('boom');

    expect(toDeleteChatError(unavailable)).toBe(unavailable);
    expect(toDeleteChatError(plain)).toBe(plain);
  });
});

describe('assertDeletableChatId', () => {
  it.each([
    '22670000000@c.us',
    '22670000000@s.whatsapp.net',
    '123456789012345@lid',
    '120363000000000000@g.us',
    '22670000000-1500000000@g.us',
  ])('accepts %s', (chatId) => {
    expect(() => assertDeletableChatId(chatId)).not.toThrow();
  });

  it.each([
    '',
    'abc',
    '22670000000',
    'abc@c.us',
    '+22670000000@c.us',
    '226 70 00 00 00@c.us',
    '22670000000:3@c.us',
    '22670000000@c.us@garbage',
    'x@bot',
    '22670000000@bot',
    '22670000000@hosted',
    '22670000000@hosted.lid',
    'abc@lid',
    'abc@g.us',
    '1-2-3@g.us',
    'status@broadcast',
    '123@broadcast',
    '120363000000000000@newsletter',
    null,
  ])('refuses %p with 422', (chatId) => {
    expect(() => assertDeletableChatId(chatId)).toThrow(
      UnprocessableEntityException,
    );
  });
});

describe('DeleteChatQuery', () => {
  const pipe = new WAHAValidationPipe();
  const metadata: ArgumentMetadata = {
    type: 'query',
    metatype: DeleteChatQuery,
  };

  it('reads purge only when given', async () => {
    const given = await pipe.transform(
      { deleteMedia: 'true', purge: 'false' },
      metadata,
    );
    const omitted = await pipe.transform({}, metadata);

    expect(given.deleteMedia).toBe(true);
    expect(given.purge).toBe(false);
    expect(omitted.deleteMedia).toBe(false);
    expect(omitted.purge).toBeUndefined();
  });

  it('refuses a value that is not a boolean', async () => {
    await expect(
      pipe.transform({ purge: 'maybe' }, metadata),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
