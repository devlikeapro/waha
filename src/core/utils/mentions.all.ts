import { isJidGroup } from '@waha/core/utils/jids';
import { UnprocessableEntityException } from '@nestjs/common';

const ALL = 'all';

export function mentionsAll(request: { mentions?: string[] }) {
  return request.mentions && request.mentions.includes(ALL);
}

export function validateRequestMentions(request: {
  chatId: string;
  mentions?: string[];
}) {
  if (!isJidGroup(request.chatId)) {
    throw new UnprocessableEntityException(
      `"mentions":["all"] can be used only in group chats, not in '${request.chatId}'`,
    );
  }
}
