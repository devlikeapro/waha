import { parseMessageIdSerialized } from '@waha/core/utils/ids';
import { WAMessage } from '@waha/structures/responses.dto';
import { WAMessageAckBody } from '@waha/structures/webhooks.dto';
import { distinct, interval } from 'rxjs';

export function DistinctAck(flushEvery: number = 60_000) {
  // only if we haven't seen this key since the last flush
  return distinct(
    (msg: WAMessageAckBody) => `${msg.id}-${msg.ack}-${msg.participant}`,
    interval(flushEvery),
  );
}

/**
 * Extracts the unique WhatsApp message ID from a serialized WAHA message ID.
 * Message IDs have format: {fromMe}_{chatId}_{uniqueId}[_{participant}]
 *
 * The uniqueId part is what WhatsApp generates and remains constant even when
 * the same message is delivered with different chat identifiers (LID vs JID).
 *
 * @example
 * "false_13649439626@lid_ABC123" => "ABC123"
 * "false_2010XXXXXXX@c.us_ABC123" => "ABC123"
 */
function extractUniqueMessageId(messageId: string): string {
  const key = parseMessageIdSerialized(messageId, true);
  return key.id;
}

/**
 * Deduplicates messages by their unique WhatsApp message ID.
 * This is needed to prevent duplicate webhooks for the same message,
 * which can happen in GOWS when receiving the first message from a new sender.
 *
 * When a new contact sends their first message, WhatsApp may deliver:
 * 1. Two events with the same full ID but different internal structures
 * 2. Two events with different chat identifiers (LID vs JID) but same unique message ID
 *
 * This function extracts the unique message ID part and deduplicates based on that,
 * along with fromMe flag to avoid conflicts between sent and received messages.
 *
 * @see https://github.com/devlikeapro/waha/issues/1564
 */
export function DistinctMessages(flushEvery: number = 60_000) {
  return distinct((msg: WAMessage) => {
    const uniqueId = extractUniqueMessageId(msg.id);
    // Include fromMe to distinguish sent vs received with same ID
    return `${msg.fromMe}_${uniqueId}`;
  }, interval(flushEvery));
}
