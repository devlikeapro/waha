import { MessageSource } from '@waha/structures/responses.dto';

export interface SeenByAgentPayload {
  fromMe?: boolean;
  source?: MessageSource;
}

/**
 * Whether a message synced from WhatsApp means the agent has seen the
 * conversation in Chatwoot.
 *
 * Only a live message typed on the phone (or another linked device) of the
 * account counts: replying there means the conversation was read. Messages sent
 * through the API (Chatwoot itself, the bot, the back end) and history imports
 * do not.
 */
export function ShouldMarkAsSeenByAgent(
  payload: SeenByAgentPayload,
  history: boolean,
): boolean {
  if (history) {
    return false;
  }
  if (!payload.fromMe) {
    return false;
  }
  return payload.source === MessageSource.APP;
}
