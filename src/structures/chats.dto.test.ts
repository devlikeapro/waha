import { DeleteMessagesForMeRequest } from '@waha/structures/chats.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

function ids(count: number): string[] {
  return Array.from({ length: count }, (value, index) => `message-${index}`);
}

describe('DeleteMessagesForMeRequest', () => {
  it('accepts 1 to 100 message ids and does not delete media by default', async () => {
    for (const count of [1, 100]) {
      const request = plainToInstance(DeleteMessagesForMeRequest, {
        messageIds: ids(count),
      });
      expect(await validate(request)).toHaveLength(0);
      expect(request.deleteMedia).toBe(false);
    }
  });

  it.each([
    ['no message ids', {}],
    ['an empty list', { messageIds: [] }],
    ['more than 100 ids', { messageIds: ids(101) }],
    ['the same id twice', { messageIds: ['message-1', 'message-1'] }],
    ['an empty id', { messageIds: [''] }],
    ['a non boolean deleteMedia', { messageIds: ids(1), deleteMedia: 'yes' }],
  ])('rejects %s', async (name, body) => {
    const request = plainToInstance(DeleteMessagesForMeRequest, body);
    expect(await validate(request)).not.toHaveLength(0);
  });
});
