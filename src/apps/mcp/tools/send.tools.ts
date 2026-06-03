import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { z } from 'zod';
import { McpController } from '@waha/apps/mcp/decorators/controller';
import { Tool } from '@waha/apps/mcp/decorators/tool';
import {
  ForwardMessageInput,
  NewMessageIdInput,
  SendEventInput,
  SendButtonsInput,
  SendButtonsReplyInput,
  SendContactVcardInput,
  SendFileInput,
  SendImageInput,
  SendLinkCustomPreviewInput,
  SendListInput,
  SendLocationInput,
  SendPollInput,
  SendPollVoteInput,
  SendSeenInput,
  SendTextInput,
  SendVideoInput,
  SendVoiceInput,
  SetReactionInput,
  SetStarInput,
  TypingInput,
} from '@waha/apps/mcp/tools/send.zod';

const FileNote =
  'Use file.url for remote HTTP/HTTPS URLs. ' +
  'For local file paths (e.g. /tmp/file.ext) - upload it to S3 or other remote server first, or read the file, encode it as base64, and pass it via file.data instead.';

export class SendTools extends McpController {
  constructor(api: WAHASelf) {
    super(api);
  }

  @Tool('send-text', {
    title: 'Send a text message',
    description:
      'Send a text message to a number. ' +
      'Always call start-typing first, wait a few seconds, call stop-typing, then send the message.',
    inputSchema: SendTextInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async sendText(data: z.infer<typeof SendTextInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/sendText',
      data: data,
    });
  }

  @Tool('send-image', {
    title: 'Send an image',
    description: 'Send an image to a chat. ' + FileNote,
    inputSchema: SendImageInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async sendImage(data: z.infer<typeof SendImageInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/sendImage',
      data: data,
    });
  }

  @Tool('send-file', {
    title: 'Send a file',
    description: 'Send a file (document) to a chat. ' + FileNote,
    inputSchema: SendFileInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async sendFile(data: z.infer<typeof SendFileInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/sendFile',
      data: data,
    });
  }

  @Tool('send-voice', {
    title: 'Send a voice message',
    description: 'Send a voice message to a chat. ' + FileNote,
    inputSchema: SendVoiceInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async sendVoice(data: z.infer<typeof SendVoiceInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/sendVoice',
      data: data,
    });
  }

  @Tool('send-video', {
    title: 'Send a video',
    description: 'Send a video to a chat. ' + FileNote,
    inputSchema: SendVideoInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async sendVideo(data: z.infer<typeof SendVideoInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/sendVideo',
      data: data,
    });
  }

  @Tool('send-link-custom-preview', {
    title: 'Send a text message with a custom link preview',
    description:
      'Send a text message with a custom link preview (title, description, image)',
    inputSchema: SendLinkCustomPreviewInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async sendLinkCustomPreview(
    data: z.infer<typeof SendLinkCustomPreviewInput>,
  ) {
    return this.textRequest({
      method: 'POST',
      url: '/api/send/link-custom-preview',
      data: data,
    });
  }

  @Tool('send-buttons', {
    title: 'Send a buttons message',
    description: 'Send an interactive buttons message',
    inputSchema: SendButtonsInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async sendButtons(data: z.infer<typeof SendButtonsInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/sendButtons',
      data: data,
    });
  }

  @Tool('send-list', {
    title: 'Send a list message',
    description: 'Send an interactive list message with sections and rows',
    inputSchema: SendListInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async sendList(data: z.infer<typeof SendListInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/sendList',
      data: data,
    });
  }

  @Tool('send-seen', {
    title: 'Mark messages as seen',
    description: 'Mark one or more messages as seen (read)',
    inputSchema: SendSeenInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async sendSeen(data: z.infer<typeof SendSeenInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/sendSeen',
      data: data,
    });
  }

  @Tool('send-poll', {
    title: 'Send a poll',
    description: 'Send a poll message with options',
    inputSchema: SendPollInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async sendPoll(data: z.infer<typeof SendPollInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/sendPoll',
      data: data,
    });
  }

  @Tool('send-poll-vote', {
    title: 'Vote on a poll',
    description: 'Cast vote(s) on an existing poll message',
    inputSchema: SendPollVoteInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async sendPollVote(data: z.infer<typeof SendPollVoteInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/sendPollVote',
      data: data,
    });
  }

  @Tool('send-location', {
    title: 'Send a location',
    description: 'Send a location with latitude, longitude, and title',
    inputSchema: SendLocationInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async sendLocation(data: z.infer<typeof SendLocationInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/sendLocation',
      data: data,
    });
  }

  @Tool('send-contact-vcard', {
    title: 'Send a contact vCard',
    description: 'Send one or more contacts as a vCard',
    inputSchema: SendContactVcardInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async sendContactVcard(data: z.infer<typeof SendContactVcardInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/sendContactVcard',
      data: data,
    });
  }

  @Tool('send-buttons-reply', {
    title: 'Reply to a buttons message',
    description: 'Send a reply to an interactive buttons message',
    inputSchema: SendButtonsReplyInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async sendButtonsReply(data: z.infer<typeof SendButtonsReplyInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/send/buttons/reply',
      data: data,
    });
  }

  @Tool('forward-message', {
    title: 'Forward a message',
    description: 'Forward an existing message to a chat',
    inputSchema: ForwardMessageInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async forwardMessage(data: z.infer<typeof ForwardMessageInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/forwardMessage',
      data: data,
    });
  }

  @Tool('start-typing', {
    title: 'Start typing indicator',
    description:
      'Show a typing indicator in a chat (runs until stop-typing is called)',
    inputSchema: TypingInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async startTyping(data: z.infer<typeof TypingInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/startTyping',
      data: data,
    });
  }

  @Tool('stop-typing', {
    title: 'Stop typing indicator',
    description: 'Stop the typing indicator in a chat',
    inputSchema: TypingInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async stopTyping(data: z.infer<typeof TypingInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/stopTyping',
      data: data,
    });
  }

  @Tool('set-reaction', {
    title: 'React to a message',
    description:
      'React to a message with an emoji. Send empty string to remove reaction',
    inputSchema: SetReactionInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async setReaction(data: z.infer<typeof SetReactionInput>) {
    return this.textRequest({
      method: 'PUT',
      url: '/api/reaction',
      data: data,
    });
  }

  @Tool('set-star', {
    title: 'Star or unstar a message',
    description: 'Star or unstar a message',
    inputSchema: SetStarInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async setStar(data: z.infer<typeof SetStarInput>) {
    return this.textRequest({
      method: 'PUT',
      url: '/api/star',
      data: data,
    });
  }

  @Tool('send-event-message', {
    title: 'Send an event message',
    description: 'Send an event/appointment message to a chat',
    inputSchema: SendEventInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async sendEvent({
    session,
    chatId,
    reply_to,
    ...event
  }: z.infer<typeof SendEventInput>) {
    return this.textRequest({
      method: 'POST',
      url: `/api/${session}/events`,
      data: { chatId: chatId, reply_to: reply_to, event: event },
    });
  }

  @Tool('new-message-id', {
    title: 'Generate a new message ID',
    description: 'Generate a new unique message ID for use in send requests',
    inputSchema: NewMessageIdInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async newMessageId({ session }: z.infer<typeof NewMessageIdInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/new-message-id`,
    });
  }
}
