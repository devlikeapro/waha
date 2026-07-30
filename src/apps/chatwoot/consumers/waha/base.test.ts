jest.mock('@adiwajshing/baileys', () => ({}));

import {
  ChatWootMessagePartial,
  MessageBaseHandler,
  MessageBaseHandlerPayload,
} from './base';
import { SendAttachment } from '@waha/apps/chatwoot/client/types';

class TestableMessageBaseHandler extends MessageBaseHandler<MessageBaseHandlerPayload> {
  public mockAttachments: SendAttachment[] = [];

  protected async getMessage(
    payload: MessageBaseHandlerPayload,
  ): Promise<ChatWootMessagePartial> {
    return {
      content: 'Sample media caption',
      attachments: this.mockAttachments,
      private: false,
    };
  }

  getReplyToWhatsAppID(
    payload: MessageBaseHandlerPayload,
  ): string | undefined {
    return undefined;
  }
}

describe('MessageBaseHandler', () => {
  it('should sanitize attachment content to empty string on handle return', async () => {
    const heavyBase64Payload = 'A'.repeat(1024 * 1024);

    const mockJob: any = {
      id: 'job-1',
      data: {},
    };
    const mockMappingService: any = {
      getChatWootMessage: jest.fn().mockResolvedValue(null),
      map: jest.fn().mockResolvedValue(undefined),
    };
    const mockConversation: any = {
      conversationId: 101,
      send: jest.fn().mockResolvedValue({
        id: 555,
        conversation_id: 101,
        created_at: 1700000000,
      }),
    };
    const mockRepo: any = {
      ConversationByContact: jest.fn().mockResolvedValue(mockConversation),
    };
    const mockLogger: any = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
    const mockInfo: any = {
      onConversationId: jest.fn(),
      onMessageType: jest.fn(),
    };
    const mockSession: any = {
      getContact: jest.fn().mockResolvedValue({ name: 'User' }),
    };
    const mockLocale: any = {
      key: jest.fn().mockReturnValue({ render: jest.fn().mockReturnValue('') }),
      r: jest.fn().mockReturnValue(''),
      ParseTimestamp: jest.fn().mockReturnValue(new Date()),
      FormatHumanDate: jest.fn().mockReturnValue('2026-07-30'),
    };
    const mockWaha: any = {};

    const handler = new TestableMessageBaseHandler(
      mockJob,
      mockMappingService,
      mockRepo,
      mockLogger,
      mockInfo,
      mockSession,
      mockLocale,
      mockWaha,
    );

    handler.mockAttachments = [
      {
        content: heavyBase64Payload,
        filename: 'document.pdf',
        encoding: 'base64',
      },
    ];

    const payload: MessageBaseHandlerPayload = {
      id: 'false_555123456789@c.us_ABCDEF123456',
      timestamp: 1700000000,
      from: '555123456789@c.us',
      fromMe: false,
    };

    const result = await handler.handle(payload);

    expect(mockConversation.send).toHaveBeenCalledTimes(1);
    const sentData = mockConversation.send.mock.calls[0][0];
    expect(sentData.attachments[0].content).toBe(heavyBase64Payload);

    expect(result).not.toBeNull();
    expect(result?.attachments).toBeDefined();
    expect(result?.attachments?.[0].content).toBe('');
    expect(result?.attachments?.[0].filename).toBe('document.pdf');
    expect(result?.attachments?.[0].encoding).toBe('base64');
  });
});
