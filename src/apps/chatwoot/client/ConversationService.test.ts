import axios from 'axios';
import { ConversationService } from '@waha/apps/chatwoot/client/ConversationService';

jest.mock('axios');

function buildService() {
  const logger: any = {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
  const config = {
    url: 'https://chat.example.com',
    accountId: 7,
    accountToken: 'account-token',
    inboxId: 3,
    inboxIdentifier: 'inbox-identifier',
  };
  const service = new ConversationService(
    config,
    {} as any,
    {} as any,
    {} as any,
    logger,
  );
  return { service: service, logger: logger };
}

describe('ConversationService.markAsSeenByAgent', () => {
  const post = axios.post as jest.Mock;

  beforeEach(() => {
    post.mockReset();
  });

  it('calls the Account API update_last_seen with the account token', async () => {
    post.mockResolvedValue({ status: 200 });
    const { service } = buildService();

    await service.markAsSeenByAgent(42);

    expect(post).toHaveBeenCalledTimes(1);
    const [url, body, options] = post.mock.calls[0];
    expect(url).toBe(
      'https://chat.example.com/api/v1/accounts/7/conversations/42/update_last_seen',
    );
    expect(body).toEqual({});
    expect(options.headers.api_access_token).toBe('account-token');
  });

  it('does not use the public inbox endpoint', async () => {
    post.mockResolvedValue({ status: 200 });
    const { service } = buildService();

    await service.markAsSeenByAgent(42);

    const [url, , options] = post.mock.calls[0];
    expect(url).not.toContain('/public/');
    expect(options.headers.api_access_token).not.toBe('inbox-identifier');
  });

  it('propagates the error so the caller decides', async () => {
    post.mockRejectedValue(new Error('401 Unauthorized'));
    const { service } = buildService();

    await expect(service.markAsSeenByAgent(42)).rejects.toThrow(
      '401 Unauthorized',
    );
  });
});
