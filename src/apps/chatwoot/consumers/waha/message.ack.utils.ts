import type { WAHAWebhookMessageAck } from '@waha/structures/webhooks.dto';
import { isJidCusFormat } from '@waha/utils/wa';
import { WAMessageAck } from '@waha/structures/enums.dto';
import { isLidUser } from '@waha/core/utils/jids';
import { EngineHelper } from '@waha/apps/chatwoot/waha';

const ACKS_TO_PROCESS = new Set([
  WAMessageAck.DEVICE,
  WAMessageAck.READ,
  WAMessageAck.PLAYED,
]);

/**
 * Acks for OUR messages in DMs - the ones that can change Chatwoot message status
 */
export function ShouldProcessAckInChatWoot(
  event: WAHAWebhookMessageAck,
): boolean {
  // Ignore groups and other multiple participants chats
  const chatId = EngineHelper.ChatID(event.payload);
  if (!isJidCusFormat(chatId) && !isLidUser(chatId)) {
    return false;
  }

  const payload = event.payload;
  if (!ACKS_TO_PROCESS.has(payload.ack)) {
    return false;
  }

  // Only process when OUR message (fromMe: true) was received or read by recipient
  if (!payload.fromMe) {
    return false;
  }
  return true;
}

/**
 * Mark ChatWoot conversation as read when recipient reads our message
 */
export function ShouldMarkAsReadInChatWoot(
  event: WAHAWebhookMessageAck,
): boolean {
  if (!ShouldProcessAckInChatWoot(event)) {
    return false;
  }
  // Only READ and PLAYED
  const ack = event.payload.ack;
  return ack === WAMessageAck.READ || ack === WAMessageAck.PLAYED;
}
