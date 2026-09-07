import { ArgentinePhonePlugin } from './ArgentinePhonePlugin';
import { ArgentinePhoneNumbersAppConfig } from '../dto/config.dto';
import { SessionHooks } from '@waha/core/abc/session.hooks';
import { RegisterPluginHooks } from '@waha/core/abc/session.plugin.hooks';

const original = '541112345678';
const alternate = '5491112345678';
const logger: any = { warn: jest.fn() };

function build(config: Partial<ArgentinePhoneNumbersAppConfig> = {}) {
  const session: any = {
    name: 'test',
    hooks: new SessionHooks(),
    checkNumberStatus: jest.fn(),
  };
  const plugin = new ArgentinePhonePlugin(
    session,
    logger,
    Object.assign(new ArgentinePhoneNumbersAppConfig(), config),
    null,
  );
  RegisterPluginHooks(plugin);
  return session;
}
function resolve(session: any, phone = original, method = 'sendText') {
  return session.hooks.wid.chat.promise(phone, method);
}

describe('Argentine phone resolution hooks', () => {
  afterEach(() => jest.useRealTimers());

  it('uses and caches the original result without looking up the alternate', async () => {
    const session = build();
    session.checkNumberStatus.mockResolvedValue({
      numberExists: true,
      chatId: `${original}@c.us`,
    });
    expect(await resolve(session)).toBe(`${original}@c.us`);
    expect(await resolve(session, `+${original}@c.us`)).toBe(
      `${original}@c.us`,
    );
    expect(session.checkNumberStatus.mock.calls).toEqual([
      [{ phone: original, session: 'test' }],
    ]);
  });

  it('tries the alternate only after explicit absence, preserving the returned LID', async () => {
    const session = build();
    session.checkNumberStatus
      .mockResolvedValueOnce({ numberExists: false })
      .mockResolvedValueOnce({ numberExists: true, chatId: '123456@lid' });
    expect(await resolve(session)).toBe('123456@lid');
    expect(await resolve(session)).toBe('123456@lid');
    expect(session.checkNumberStatus.mock.calls).toEqual([
      [{ phone: original, session: 'test' }],
      [{ phone: alternate, session: 'test' }],
    ]);
  });

  it('prefers the returned PN when both identifiers are available', async () => {
    const session = build();
    session.checkNumberStatus.mockResolvedValue({
      numberExists: true,
      chatId: '123@lid',
      pn: `${alternate}@c.us`,
    });
    expect(await resolve(session)).toBe(`${alternate}@c.us`);
  });

  it('keeps both existing accounts distinct, including simultaneous first lookups', async () => {
    const session = build();
    session.checkNumberStatus.mockImplementation(async ({ phone }) => ({
      numberExists: true,
      chatId: `${phone}@c.us`,
    }));
    expect(
      await Promise.all([resolve(session), resolve(session, alternate)]),
    ).toEqual([`${original}@c.us`, `${alternate}@c.us`]);
    expect(await resolve(session)).toBe(`${original}@c.us`);
    expect(await resolve(session, alternate)).toBe(`${alternate}@c.us`);
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(2);
  });

  it('shares concurrent lookups for the same input', async () => {
    const session = build();
    session.checkNumberStatus.mockResolvedValue({
      numberExists: true,
      chatId: `${original}@c.us`,
    });
    await Promise.all([resolve(session), resolve(session), resolve(session)]);
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(1);
  });

  it('does not retarget or cache a timeout, even in strict mode', async () => {
    const session = build({ strict: true });
    session.checkNumberStatus.mockRejectedValue(new Error('timeout'));
    expect(await resolve(session)).toBe(original);
    expect(await resolve(session)).toBe(original);
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(2);
    expect(session.checkNumberStatus).toHaveBeenLastCalledWith({
      phone: original,
      session: 'test',
    });
  });

  it.each([
    undefined,
    {},
    { numberExists: true },
    { numberExists: true, chatId: '' },
  ])('does not treat an incomplete response as absence: %j', async (answer) => {
    const session = build({ strict: true });
    session.checkNumberStatus.mockResolvedValue(answer);
    expect(await resolve(session)).toBe(original);
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(1);
  });

  it('keeps the input if the alternate lookup fails after original absence', async () => {
    const session = build({ strict: true });
    session.checkNumberStatus
      .mockResolvedValueOnce({ numberExists: false })
      .mockRejectedValueOnce(new Error('timeout'));
    expect(await resolve(session)).toBe(original);
  });

  it('keeps unresolved input in soft mode and expires negative entries', async () => {
    jest.useFakeTimers();
    const session = build();
    session.checkNumberStatus.mockResolvedValue({ numberExists: false });
    expect(await resolve(session)).toBe(original);
    expect(await resolve(session, `+${original}@c.us`)).toBe(
      `+${original}@c.us`,
    );
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(61000);
    await resolve(session);
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(4);
  });

  it('rejects confirmed absence in strict mode, including cached absence', async () => {
    const session = build({ strict: true });
    session.checkNumberStatus.mockResolvedValue({ numberExists: false });
    await expect(resolve(session)).rejects.toMatchObject({ status: 422 });
    await expect(resolve(session)).rejects.toMatchObject({ status: 422 });
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(2);
  });

  it('expires positive cache entries', async () => {
    jest.useFakeTimers();
    const session = build({ memoryTtl: '1s' });
    session.checkNumberStatus.mockResolvedValue({
      numberExists: true,
      chatId: `${original}@c.us`,
    });
    await resolve(session);
    jest.advanceTimersByTime(1001);
    await resolve(session);
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(2);
  });

  it.each([
    'rejectCall',
    'deleteMessage',
    'sendSeen',
    'startTyping',
    'checkNumberStatus',
    'findLIDByPhoneNumber',
    'addParticipants',
  ])('leaves %s unchanged even after caching a rewrite', async (method) => {
    const session = build();
    session.checkNumberStatus.mockResolvedValue({
      numberExists: true,
      chatId: `${alternate}@c.us`,
    });
    await resolve(session);
    expect(await resolve(session, original, method)).toBe(original);
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(1);
  });

  it('leaves mentions, foreign numbers and LIDs untouched', async () => {
    const session = build();
    expect(await session.hooks.wid.mention.promise(original, 'sendText')).toBe(
      original,
    );
    expect(await resolve(session, '5511912345678')).toBe('5511912345678');
    expect(await resolve(session, `${alternate}@lid`)).toBe(`${alternate}@lid`);
    expect(session.checkNumberStatus).not.toHaveBeenCalled();
  });

  it('does not query when lookup is disabled', async () => {
    const session = build({ lookup: false, strict: true });
    expect(await resolve(session)).toBe(original);
    expect(session.checkNumberStatus).not.toHaveBeenCalled();
  });
});
