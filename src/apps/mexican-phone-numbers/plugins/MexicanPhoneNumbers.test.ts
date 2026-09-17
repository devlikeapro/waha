import { UnprocessableEntityException } from '@nestjs/common';
import { MexicanPhoneNumberRules } from '@waha/apps/mexican-phone-numbers/rules/MexicanPhoneNumberRules';
import { PhoneNumbersBaseConfig } from '@waha/apps/phone-numbers/dto/config.dto';
import {
  buildPlugin as buildPhoneNumbersPlugin,
  resolveChat,
  stubLookup,
} from '@waha/apps/phone-numbers/plugins/testing';

function buildPlugin(config: Partial<PhoneNumbersBaseConfig> = {}) {
  return buildPhoneNumbersPlugin({
    config: config,
    rules: MexicanPhoneNumberRules(),
  });
}

describe('MexicanPhoneNumbers', () => {
  it('uses the supplied form when it exists, without checking the other one', async () => {
    const { session } = buildPlugin();
    stubLookup(session, { numberExists: true, chatId: '525512345678@c.us' });

    const resolved = await resolveChat(session, '+525512345678');

    expect(resolved).toBe('525512345678@c.us');
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(1);
    expect(session.checkNumberStatus).toHaveBeenCalledWith({
      phone: '525512345678',
      session: 'test',
    });
  });

  it('tries the form with 1 after the supplied one is absent, keeps a LID answer', async () => {
    const { session } = buildPlugin();
    session.checkNumberStatus = jest
      .fn()
      .mockResolvedValueOnce({ numberExists: false })
      .mockResolvedValueOnce({ numberExists: true, chatId: '123456@lid' });

    const resolved = await resolveChat(session, '525512345678@c.us');

    expect(resolved).toBe('123456@lid');
    expect(session.checkNumberStatus).toHaveBeenLastCalledWith({
      phone: '5215512345678',
      session: 'test',
    });
    // Both forms hit the cache now
    expect(await resolveChat(session, '5215512345678@c.us')).toBe('123456@lid');
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(2);
  });

  it('tries the form without 1 as the fallback', async () => {
    const { session } = buildPlugin();
    session.checkNumberStatus = jest
      .fn()
      .mockResolvedValueOnce({ numberExists: false })
      .mockResolvedValueOnce({
        numberExists: true,
        chatId: '523312345678@c.us',
      });

    const resolved = await resolveChat(session, '5213312345678@c.us');

    expect(resolved).toBe('523312345678@c.us');
  });

  it('prefers the pn when the engine answers with both pn and a LID', async () => {
    const { session } = buildPlugin();
    stubLookup(session, {
      numberExists: true,
      chatId: '123@lid',
      pn: '5215512345678@c.us',
    });

    expect(await resolveChat(session, '525512345678@c.us')).toBe(
      '5215512345678@c.us',
    );
  });

  it('soft mode keeps the supplied form when both are absent, strict rejects', async () => {
    const soft = buildPlugin();
    stubLookup(soft.session, { numberExists: false });
    expect(await resolveChat(soft.session, '525512345678@c.us')).toBe(
      '525512345678@c.us',
    );
    expect(soft.session.checkNumberStatus).toHaveBeenCalledTimes(2);

    const strict = buildPlugin({ strict: true });
    stubLookup(strict.session, { numberExists: false });
    await expect(
      resolveChat(strict.session, '525512345678@c.us'),
    ).rejects.toThrow(UnprocessableEntityException);
  });

  it('leaves numbers without the country code and other countries untouched', async () => {
    const { session } = buildPlugin();
    stubLookup(session, { numberExists: false });

    expect(await resolveChat(session, '5512345678@c.us')).toBe(
      '5512345678@c.us',
    );
    expect(await resolveChat(session, '5511912345678@c.us')).toBe(
      '5511912345678@c.us',
    );
    expect(session.checkNumberStatus).not.toHaveBeenCalled();
  });
});
