import { conversation_message_create } from '@figuro/chatwoot-sdk';

/**
 * Mark a message WAHA creates from a WhatsApp message, so the webhook does not send it back
 */
export function SetExternalEcho(body: conversation_message_create) {
  body.content_attributes = { ...body.content_attributes, external_echo: true };
}

/**
 * Message was created by WAHA from a WhatsApp message, not by an agent
 */
export function IsExternalEcho(body: any): boolean {
  return Boolean(body?.content_attributes?.external_echo);
}
