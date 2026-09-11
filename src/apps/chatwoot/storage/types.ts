export interface WhatsAppMessage {
  id?: number;
  chat_id: string;
  message_id: string;
  from_me: boolean;
  participant: string | null;
  timestamp: Date;
}

export interface ChatWootCombinedKey {
  conversation_id: number;
  message_id: number;
}

export interface ChatwootMessage extends ChatWootCombinedKey {
  id?: number;
  timestamp: Date;
  expected_parts?: number;
}

export interface MessageMapping {
  id: number;
  chatwoot_message_id: number;
  whatsapp_message_id: number;
  part: number;
}
