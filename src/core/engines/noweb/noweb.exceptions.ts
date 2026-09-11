import { UnprocessableEntityException } from '@nestjs/common';

export class NoLastMessageInChatException extends UnprocessableEntityException {
  constructor(chatId: string) {
    super(
      `No recent message found in chat '${chatId}' to modify it. ` +
        'Enable NOWEB store with "config.noweb.store.full_sync=True" when starting a new session, ' +
        'or wait for a message in the chat and try again. ' +
        'Read more: https://waha.devlike.pro/docs/engines/noweb#store',
    );
  }
}
