import { messages } from '@waha/core/engines/gows/grpc/gows';
import { promisify } from 'util';

export interface ChatReadClient {
  MarkChatUnread: (
    request: messages.ChatUnreadRequest,
    callback: (err: any, response?: any) => void,
  ) => any;
}

export interface ChatReadLogger {
  debug(msg: string): void;
  warn(msg: string): void;
}

/**
 * Marks chats as read on every device of the account itself.
 *
 * Read receipts (MarkRead) only tell the sender that we read the messages;
 * the unread badge on our own phone is driven by the MarkChatAsRead app-state
 * action. GOWS exposes it through MarkChatUnread with read: true.
 *
 * Best effort: a failure is logged and never thrown, so the read receipts that
 * already went out are still reported as a success to the caller.
 */
export async function markChatsAsReadOnOwnDevices(
  client: ChatReadClient,
  session: messages.Session,
  jids: string[],
  logger: ChatReadLogger,
): Promise<void> {
  const unique = Array.from(new Set(jids.filter(Boolean)));
  for (const jid of unique) {
    const request = new messages.ChatUnreadRequest({
      session: session,
      jid: jid,
      read: true,
    });
    try {
      await promisify(client.MarkChatUnread.bind(client))(request);
      logger.debug(`Marked chat '${jid}' as read on own devices`);
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      logger.warn(
        `Failed to mark chat '${jid}' as read on own devices: ${reason}`,
      );
    }
  }
}
