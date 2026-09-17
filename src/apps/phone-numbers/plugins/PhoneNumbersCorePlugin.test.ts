import { PhoneNumbersRuleConfig } from '@waha/apps/phone-numbers/dto/config.dto';
import {
  buildPlugin as buildPhoneNumbersPlugin,
  resolveChat,
  stubLookup,
} from '@waha/apps/phone-numbers/plugins/testing';
import { RulesFromConfig } from '@waha/apps/phone-numbers/services/PhoneNumbersAppService';

function buildPlugin(rules?: PhoneNumbersRuleConfig[]) {
  return buildPhoneNumbersPlugin({ rules: RulesFromConfig(rules) });
}

describe('PhoneNumbers - rules', () => {
  it('handles every number via lookup when no rules are set', async () => {
    const { session } = buildPlugin();
    stubLookup(session, { numberExists: true, pn: '12132132130@c.us' });

    const resolved = await resolveChat(session, '+12132132130');

    expect(resolved).toBe('12132132130@c.us');
    expect(session.checkNumberStatus).toHaveBeenCalledWith({
      phone: '12132132130',
      session: 'test',
    });
    // Cached now
    const again = await resolveChat(session, '12132132130@c.us');
    expect(again).toBe('12132132130@c.us');
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(1);
  });

  it('regexp rule handles only matching numbers', async () => {
    const { session } = buildPlugin([{ regexp: '^52' }]);
    stubLookup(session, { numberExists: true, chatId: '5212345678901@c.us' });

    expect(await resolveChat(session, '12132132130@c.us')).toBe(
      '12132132130@c.us',
    );
    expect(session.checkNumberStatus).not.toHaveBeenCalled();
    expect(await resolveChat(session, '5212345678901@c.us')).toBe(
      '5212345678901@c.us',
    );
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(1);
  });

  it('regexp rule with replace checks the replaced form too', async () => {
    const { session } = buildPlugin([
      { regexp: '^52(\\d{10})$', replace: '521$1' },
    ]);
    session.checkNumberStatus = jest.fn(async ({ phone }) => ({
      numberExists: phone === '5211234567890',
      chatId: `${phone}@c.us`,
    }));

    const resolved = await resolveChat(session, '521234567890@c.us');

    expect(resolved).toBe('5211234567890@c.us');
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(2);
    // Both forms share the cache entry
    expect(await resolveChat(session, '5211234567890@c.us')).toBe(
      '5211234567890@c.us',
    );
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(2);
  });

  it('first matching rule wins', async () => {
    const { session } = buildPlugin([
      { regexp: '^55', replace: '55' },
      { regexp: '.*', replace: '1$&' },
    ]);
    stubLookup(session, { numberExists: false });

    await resolveChat(session, '5511991203123@c.us');

    // Only the first rule's candidate was tried
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(1);
    expect(session.checkNumberStatus).toHaveBeenCalledWith({
      phone: '5511991203123',
      session: 'test',
    });
  });

  it('groups, lids and other non-phone chats are never touched', async () => {
    const { session } = buildPlugin();
    stubLookup(session, { numberExists: false });

    expect(await resolveChat(session, '123@g.us')).toBe('123@g.us');
    expect(await resolveChat(session, '123@lid')).toBe('123@lid');
    expect(session.checkNumberStatus).not.toHaveBeenCalled();
  });
});
