import { NowebInMemoryStore } from '@waha/core/engines/noweb/store/NowebInMemoryStore';

describe('NowebInMemoryStore', () => {
  it('keeps public message history disabled', () => {
    const store = new NowebInMemoryStore();

    expect(() => store.getMessagesByJid('123@s.whatsapp.net', {}, {})).toThrow(
      'Enable NOWEB store',
    );
  });

  it('allows chat modifications to read from in-memory history', async () => {
    const store = new NowebInMemoryStore();

    await expect(store.getMessageForChatModify('123@s.whatsapp.net')).resolves
      .toBeNull();
  });
});
