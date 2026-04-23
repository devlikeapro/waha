export interface WAHAWebhook<Payload = any> {
  id: string;
  timestamp: number;
  session: string;
  metadata?: Record<string, string>;
  event: string;
  payload: Payload;
}

export interface WAMessage {
    id: string;
    timestamp: number;
    from: string;
    to: string;
    body: string;
    hasMedia: boolean;
    // Add more fields as needed for the bot
}
