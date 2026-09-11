import type { WAHAWebhookMessageAck } from '@waha/structures/webhooks.dto';
import { isJidCusFormat } from '@waha/utils/wa';
import { WAMessageAck } from '@waha/structures/enums.dto';
import { isLidUser } from '@waha/core/utils/jids';
import { EngineHelper } from '@waha/apps/chatwoot/waha';

export function ShouldMarkAsReadInChatWoot(
  event: WAHAWebhookMessageAck,
): boolean {
  return (
    ShouldUpdateMessageStatusInChatWoot(event) &&
    (event.payload.ack === WAMessageAck.READ ||
      event.payload.ack === WAMessageAck.PLAYED)
  );
}

export function ShouldUpdateMessageStatusInChatWoot(
  event: WAHAWebhookMessageAck,
): boolean {
  // Track individual delivery/read status only for direct messages.
  // Ignore groups and other multiple participants chats
  const chatId = EngineHelper.ChatID(event.payload);
  if (!isJidCusFormat(chatId) && !isLidUser(chatId)) {
    return false;
  }

  const payload = event.payload;
  if (
    ![WAMessageAck.DEVICE, WAMessageAck.READ, WAMessageAck.PLAYED].includes(
      payload.ack,
    )
  ) {
    return false;
  }

  // Only process acknowledgements of OUR outgoing messages.
  if (payload.fromMe !== true) {
    return false;
  }

  return true;
}
