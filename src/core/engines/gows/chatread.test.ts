import { markChatsAsReadOnOwnDevices } from '@waha/core/engines/gows/chatread';
import { messages } from '@waha/core/engines/gows/grpc/gows';

function buildClient(failFor: string[] = []) {
  const requests: messages.ChatUnreadRequest[] = [];
  const client = {
    MarkChatUnread: jest.fn(
      (
        request: messages.ChatUnreadRequest,
        callback: (err: any, response?: any) => void,
      ) => {
        requests.push(request);
        if (failFor.includes(request.jid)) {
          callback(new Error('app state sync failed'));
          return;
        }
        callback(null, new messages.Empty());
      },
    ),
  };
  return { client: client, requests: requests };
}

function buildLogger() {
  return { debug: jest.fn(), warn: jest.fn() };
}

describe('markChatsAsReadOnOwnDevices', () => {
  const session = new messages.Session({ id: 'eld-test-01' });

  it('sends MarkChatUnread with read: true for the chat', async () => {
    const { client, requests } = buildClient();
    const logger = buildLogger();

    await markChatsAsReadOnOwnDevices(
      client,
      session,
      ['11111111111@s.whatsapp.net'],
      logger,
    );

    expect(requests).toHaveLength(1);
    expect(requests[0].jid).toBe('11111111111@s.whatsapp.net');
    expect(requests[0].read).toBe(true);
    expect(requests[0].session.id).toBe('eld-test-01');
  });

  it('sends one request per distinct chat', async () => {
    const { client, requests } = buildClient();
    const logger = buildLogger();

    await markChatsAsReadOnOwnDevices(
      client,
      session,
      [
        '11111111111@s.whatsapp.net',
        '11111111111@s.whatsapp.net',
        '22222222222@lid',
        '',
      ],
      logger,
    );

    expect(requests.map((r) => r.jid)).toEqual([
      '11111111111@s.whatsapp.net',
      '22222222222@lid',
    ]);
  });

  it('does nothing when no chat was read', async () => {
    const { client } = buildClient();
    const logger = buildLogger();

    await markChatsAsReadOnOwnDevices(client, session, [], logger);

    expect(client.MarkChatUnread).not.toHaveBeenCalled();
  });

  it('logs and swallows a failure, and keeps going with the next chat', async () => {
    const { client, requests } = buildClient(['11111111111@s.whatsapp.net']);
    const logger = buildLogger();

    await expect(
      markChatsAsReadOnOwnDevices(
        client,
        session,
        ['11111111111@s.whatsapp.net', '22222222222@lid'],
        logger,
      ),
    ).resolves.toBeUndefined();

    expect(requests).toHaveLength(2);
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn.mock.calls[0][0]).toContain('app state sync failed');
  });
});
