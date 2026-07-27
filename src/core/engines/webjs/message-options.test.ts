import { getWebjsMessageOptions } from './message-options';

describe('getWebjsMessageOptions', () => {
  it('waits for WhatsApp to accept the message for sending', () => {
    const options = getWebjsMessageOptions(
      {
        mentions: ['123'],
        reply_to: 'true_123@c.us_message-id',
        linkPreview: false,
      },
      (value) => `${value}@c.us`,
    );

    expect(options).toEqual({
      mentions: ['123@c.us'],
      quotedMessageId: 'true_123@c.us_message-id',
      linkPreview: false,
      waitUntilMsgSent: true,
    });
  });
});
