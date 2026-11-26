import { ShouldMarkAsSeenByAgent } from '@waha/apps/chatwoot/consumers/waha/seen.utils';
import { MessageSource } from '@waha/structures/responses.dto';

describe('ShouldMarkAsSeenByAgent', () => {
  it('marks as seen a live reply typed on the phone', () => {
    expect(
      ShouldMarkAsSeenByAgent(
        { fromMe: true, source: MessageSource.APP },
        false,
      ),
    ).toBe(true);
  });

  it('ignores messages sent through the API (Chatwoot, bot, back end)', () => {
    expect(
      ShouldMarkAsSeenByAgent(
        { fromMe: true, source: MessageSource.API },
        false,
      ),
    ).toBe(false);
  });

  it('ignores messages from the contact', () => {
    expect(
      ShouldMarkAsSeenByAgent(
        { fromMe: false, source: MessageSource.APP },
        false,
      ),
    ).toBe(false);
  });

  it('ignores messages with an unknown source', () => {
    expect(ShouldMarkAsSeenByAgent({ fromMe: true }, false)).toBe(false);
  });

  it('ignores history imports', () => {
    expect(
      ShouldMarkAsSeenByAgent({ fromMe: true, source: MessageSource.APP }, true),
    ).toBe(false);
  });
});
