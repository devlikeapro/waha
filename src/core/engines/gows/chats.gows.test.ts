import * as grpc from '@grpc/grpc-js';
import {
  ArgumentMetadata,
  BadRequestException,
  NotImplementedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  assertDeletableChatId,
  DeletedChats,
  toChatDeletedEvent,
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

describe('toChatDeletedEvent', () => {
  const event = {
    Timestamp: '2026-10-13T16:28:17.123Z',
    DeletedBefore: '2026-10-13T16:20:01Z',
    DeleteMedia: true,
    MessageIDs: ['A', 'B'],
  };

  it('gives both ids of a direct chat deleted by phone number', () => {
    const payload = toChatDeletedEvent({
      ...event,
      JID: '22670000000@s.whatsapp.net',
      AltJID: '123456789012345@lid',
    });

    expect(payload).toEqual({
      id: '22670000000@c.us',
      pn: '22670000000@c.us',
      lid: '123456789012345@lid',
      timestamp: 1791908897,
      deletedBefore: 1791908401,
      deleteMedia: true,
      purged: false,
    });
  });

  it('gives both ids of a direct chat deleted by LID', () => {
    const payload = toChatDeletedEvent({
      ...event,
      JID: '123456789012345@lid',
      AltJID: '22670000000@s.whatsapp.net',
    });

    expect(payload.id).toBe('123456789012345@lid');
    expect(payload.pn).toBe('22670000000@c.us');
    expect(payload.lid).toBe('123456789012345@lid');
  });

  it('has no other id for a group or an unknown pair', () => {
    const group = toChatDeletedEvent({
      ...event,
      JID: '120363000000000000@g.us',
      AltJID: '',
      DeleteMedia: false,
    });
    const unknown = toChatDeletedEvent({
      ...event,
      JID: '123456789012345@lid',
      AltJID: '',
    });

    expect(group).toMatchObject({
      id: '120363000000000000@g.us',
      pn: null,
      lid: null,
      deleteMedia: false,
    });
    expect(unknown).toMatchObject({ pn: null, lid: '123456789012345@lid' });
  });

  it('gives a LID without its device', () => {
    const payload = toChatDeletedEvent({
      ...event,
      JID: '22670000000@s.whatsapp.net',
      AltJID: '123456789012345:7@lid',
    });

    expect(payload.lid).toBe('123456789012345@lid');
  });

  it('gives null for a missing time', () => {
    const payload = toChatDeletedEvent({
      ...event,
      JID: '22670000000@s.whatsapp.net',
      Timestamp: '0001-01-01T00:00:00Z',
    });

    expect(payload.timestamp).toBeNull();
  });
});

describe('DeletedChats', () => {
  const deleted = {
    JID: '22670000000@s.whatsapp.net',
    AltJID: '123456789012345@lid',
    Timestamp: '2026-10-13T16:28:17.123Z',
    DeletedBefore: '2026-10-13T16:20:01Z',
    DeleteMedia: true,
    FromFullSync: false,
    Purged: true,
    MessageIDs: ['A', 'B'],
  };

  function setup(confirm: jest.Mock = jest.fn().mockResolvedValue(undefined)) {
    const logger: any = { info: jest.fn(), error: jest.fn(), warn: jest.fn() };
    const notify = jest.fn();
    const include = jest.fn().mockReturnValue(true);
    const chats = new DeletedChats(logger, notify, include, confirm);
    return {
      chats: chats,
      logger: logger,
      notify: notify,
      include: include,
      confirm: confirm,
    };
  }

  it('notifies the deletion', async () => {
    const { chats, notify } = setup();

    await chats.handle(deleted);

    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify.mock.calls[0][0]).toMatchObject({
      id: '22670000000@c.us',
      deleteMedia: true,
      purged: true,
    });
  });

  it('tells a chat the server keeps (not purged)', async () => {
    const { chats, notify } = setup();

    await chats.handle({ ...deleted, Purged: false, MessageIDs: [] });

    expect(notify.mock.calls[0][0]).toMatchObject({
      deleteMedia: true,
      purged: false,
    });
  });

  it('does not notify a deletion GOWS failed to clear', async () => {
    const { chats, notify, logger, confirm } = setup();

    await chats.handle({
      ...deleted,
      ID: 'failed',
      Error: 'messages of x: database is locked',
    });

    expect(notify).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalled();
    expect(confirm).toHaveBeenCalledWith('failed');
  });

  it('does not notify a full sync replay or an ignored chat', async () => {
    const { chats, notify, include } = setup();

    await chats.handle({ ...deleted, FromFullSync: true });
    include.mockReturnValue(false);
    await chats.handle(deleted);

    expect(notify).not.toHaveBeenCalled();
  });

  it('confirms a deletion to GOWS once handled, and handles it once', async () => {
    const { chats, notify, confirm } = setup();
    const event = { ...deleted, ID: 'deletion-1' };

    await chats.handle(event);
    await chats.handle(event);

    expect(notify).toHaveBeenCalledTimes(1);
    expect(confirm).toHaveBeenCalledWith('deletion-1');
    expect(confirm).toHaveBeenCalledTimes(1);
  });

  it('handles a deletion sent twice at once only once', async () => {
    let finish: () => void;
    const confirm = jest.fn(
      () => new Promise<void>((resolve) => (finish = resolve)),
    );
    const { chats, notify } = setup(confirm);
    const event = { ...deleted, ID: 'deletion-1' };

    const first = chats.handle(event);
    await chats.handle(event);
    finish();
    await first;

    expect(notify).toHaveBeenCalledTimes(1);
    expect(confirm).toHaveBeenCalledTimes(1);
  });

  it('sends a deletion again to GOWS when confirming it failed', async () => {
    const confirm = jest
      .fn()
      .mockRejectedValueOnce(new Error('UNAVAILABLE'))
      .mockResolvedValueOnce(undefined);
    const { chats, notify, logger } = setup(confirm);
    const event = { ...deleted, ID: 'deletion-1' };

    await chats.handle(event);
    // GOWS sends it again (stream reconnected, session restarted)
    await chats.handle(event);

    expect(logger.warn).toHaveBeenCalled();
    expect(confirm).toHaveBeenCalledTimes(2);
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it('does not confirm a deletion without ID', async () => {
    const { chats, confirm, notify } = setup();

    await chats.handle(deleted);
    await chats.handle(deleted);

    expect(confirm).not.toHaveBeenCalled();
    expect(notify).toHaveBeenCalledTimes(2);
  });

  // The API refuses to delete a broadcast list, the phone can
  it('notifies a broadcast list deleted on the phone', async () => {
    const { chats, notify } = setup();

    await chats.handle({
      ...deleted,
      JID: '1760000000@broadcast',
      AltJID: '',
      MessageIDs: ['LIST-1'],
    });

    expect(notify.mock.calls[0][0]).toMatchObject({
      id: '1760000000@broadcast',
      pn: null,
      lid: null,
    });
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
