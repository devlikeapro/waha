import * as grpc from '@grpc/grpc-js';
import { UnprocessableEntityException } from '@nestjs/common';
import { NotImplementedByEngineError } from '@waha/core/exceptions';
import { Logger } from 'pino';
import {
  isJidGroup,
  isLidUser,
  isPnUser,
  normalizeJid,
  toCusFormat,
} from '@waha/core/utils/jids';
import {
  ChatDeletedEvent,
  DeleteChatRange,
  DeleteChatResponse,
} from '@waha/structures/chats.dto';

// A direct chat: digits, then its phone number or LID server
const DELETABLE_DIRECT_CHAT = /^\d+@(c\.us|s\.whatsapp\.net|lid)$/;
// A group: digits, or "creator-timestamp" for old groups
const DELETABLE_GROUP = /^\d+(-\d+)?@g\.us$/;

/**
 * Direct chats and groups only. A deletion stays in the app state for good,
 * so "abc" or "x@bot" are refused rather than turned into a phone number.
 */
export function assertDeletableChatId(chatId: string) {
  if (
    typeof chatId === 'string' &&
    (DELETABLE_DIRECT_CHAT.test(chatId) || DELETABLE_GROUP.test(chatId))
  ) {
    return;
  }
  throw new UnprocessableEntityException(
    `Chat '${chatId}' can not be deleted: only direct chats ` +
      `('123@c.us', '123@lid') and groups ('123@g.us') can be deleted`,
  );
}

/**
 * GOWS DeleteChat errors: refused id or group still joined => 422, no DeleteChat => 501
 */
export function toDeleteChatError(error: any): any {
  switch (error?.code) {
    case grpc.status.INVALID_ARGUMENT:
    case grpc.status.FAILED_PRECONDITION:
      return new UnprocessableEntityException(error.details ?? error.message);
    case grpc.status.UNIMPLEMENTED:
      return new NotImplementedByEngineError(
        'This GOWS can not delete chats (no DeleteChat method), update it.',
      );
    default:
      return error;
  }
}

/**
 * Converts the GOWS DeleteChatResponse to what DELETE /chats/{chatId} returns
 */
export function toDeleteChatResponse(
  chatId: string,
  deleteMedia: boolean,
  response: any,
): DeleteChatResponse {
  const ranges: any[] = response?.ranges ?? [];
  return {
    success: true,
    id: chatId,
    deleteMedia: deleteMedia,
    purge: Boolean(response?.purge),
    confirmed: Boolean(response?.confirmed),
    ranges: ranges.map(toDeleteChatRange),
  };
}

function toDeleteChatRange(range: any): DeleteChatRange {
  let lastMessage = null;
  if (range.lastMessageId) {
    lastMessage = {
      id: toMessageId(
        range.jid,
        range.lastMessageSender,
        range.lastMessageId,
        Boolean(range.lastMessageFromMe),
      ),
      timestamp: Number(range.lastMessageSentAt),
    };
  }
  return {
    chatId: toCusFormat(range.jid),
    lastMessageTimestamp: Number(range.lastMessageTimestamp),
    lastMessage: lastMessage,
  };
}

// The WAHA id of a GOWS message: "{fromMe}_{chat}_{id}", then "_{sender}" in a group
function toMessageId(
  chat: string,
  sender: string,
  id: string,
  fromMe: boolean,
): string {
  const messageId = `${fromMe}_${toCusFormat(chat)}_${id}`;
  if (isJidGroup(chat)) {
    return `${messageId}_${toCusFormat(sender)}`;
  }
  return messageId;
}

// How long the state of a deleted chat is remembered, to skip its repeats
const DELETED_CHAT_STATE_TTL_MS = 60 * 60 * 1000;

interface DeletedChatState {
  busy: boolean;
  notified: boolean;
  confirmed: boolean;
  at: number;
}

/**
 * Sends chat.deleted for a gows.ChatDeletedEvent, then confirms it to GOWS.
 * GOWS resends unconfirmed deletions; each ID is handled once per run.
 */
export class DeletedChats {
  private states = new Map<string, DeletedChatState>();

  constructor(
    private readonly logger: Logger,
    private readonly notify: (payload: ChatDeletedEvent) => void,
    private readonly include: (jid: string) => boolean,
    private readonly confirm: (id: string) => Promise<void>,
  ) {}

  async handle(event: any): Promise<void> {
    const id: string = event?.ID || '';
    let state: DeletedChatState = null;
    if (id) {
      state = this.states.get(id) ?? null;
      if (state?.busy || state?.confirmed) {
        return;
      }
      if (!state) {
        state = { busy: false, notified: false, confirmed: false, at: 0 };
        this.remember(id, state);
      }
      state.busy = true;
    }
    try {
      if (!state?.notified) {
        this.notifyOnce(event);
        if (state) {
          state.notified = true;
        }
      }
      if (id) {
        state.confirmed = await this.confirmed(event, id);
      }
    } finally {
      if (state) {
        state.busy = false;
      }
    }
  }

  private notifyOnce(event: any) {
    if (event?.Error) {
      // Messages may still be stored: no chat.deleted
      this.logger.error(
        `GOWS failed to clear the deleted chat '${event.JID}' from its storage, chat.deleted is not sent: ${event.Error}`,
      );
      return;
    }
    // Like the label events, deletions replayed by a full sync are not sent
    if (event?.FromFullSync || !this.include(event?.JID)) {
      return;
    }
    this.notify(toChatDeletedEvent(event));
  }

  private async confirmed(event: any, id: string): Promise<boolean> {
    try {
      await this.confirm(id);
      return true;
    } catch (err) {
      this.logger.warn(
        err,
        `Failed to confirm the deleted chat '${event.JID}' to GOWS, it will be sent again`,
      );
      return false;
    }
  }

  private remember(id: string, state: DeletedChatState) {
    const now = Date.now();
    for (const [key, value] of this.states) {
      if (now - value.at > DELETED_CHAT_STATE_TTL_MS && !value.busy) {
        this.states.delete(key);
      }
    }
    state.at = now;
    this.states.set(id, state);
  }
}

/**
 * Converts a GOWS ChatDeletedEvent to the chat.deleted payload
 */
export function toChatDeletedEvent(event: any): ChatDeletedEvent {
  const jids: string[] = [event.JID, event.AltJID].filter(Boolean);
  const pn = jids.find((jid) => isPnUser(jid));
  const lid = jids.find((jid) => isLidUser(jid));
  return {
    id: toCusFormat(event.JID),
    pn: pn ? toCusFormat(pn) : null,
    lid: lid ? normalizeJid(lid) : null,
    timestamp: toSeconds(event.Timestamp),
    deletedBefore: toSeconds(event.DeletedBefore),
    deleteMedia: Boolean(event.DeleteMedia),
    purged: Boolean(event.Purged),
  };
}

// "2024-12-25T14:28:42+03:00" => 1735126122, null for the Go zero time
function toSeconds(timestamp: string): number | null {
  if (!timestamp || timestamp.startsWith('0001')) {
    return null;
  }
  return Math.floor(new Date(timestamp).getTime() / 1000);
}
