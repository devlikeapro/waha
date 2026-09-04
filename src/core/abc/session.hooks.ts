import { MessageSource } from '@waha/structures/responses.dto';
import { SessionInfo } from '@waha/structures/sessions.dto';
import {
  AsyncSeriesBailHook,
  AsyncSeriesHook,
  AsyncSeriesWaterfallHook,
  SyncHook,
} from 'tapable';

/**
 * Well-known stages for hook taps. Lower stage runs earlier, taps without a stage run in between (default stage is 0).
 */
export const Stage = {
  FIRST: -100,
  LAST: 100,
};

export class SessionHooks {
  /**
   * Called before an engine method that makes a network call to WhatsApp.
   * method - the name of the method about to run.
   */
  readonly activity = new AsyncSeriesHook<[string]>(['method'], 'activity');

  readonly session = Object.freeze({
    /**
     * Builds the runtime session info (waterfall) - starts with an empty object, each tap merges its part in.
     * Called when the API reports session state, e.g. GET /api/sessions.
     */
    info: new AsyncSeriesWaterfallHook<[SessionInfo]>(['info'], 'session.info'),
  });

  /**
   * Converts a WhatsApp identifier (wid) supplied by the API caller into the form the engine addresses.
   * "wid.chat" converts the chat target, "wid.mention" converts a mention entry.
   * method - the engine method the wid is being converted for, e.g. 'sendText'.
   */
  readonly wid = Object.freeze({
    chat: new AsyncSeriesWaterfallHook<[string, string]>(
      ['wid', 'method'],
      'wid.chat',
    ),
    mention: new AsyncSeriesWaterfallHook<[string, string]>(
      ['wid', 'method'],
      'wid.mention',
    ),
  });

  readonly message = Object.freeze({
    /**
     * Called with the message id when the session sends a message via API.
     * Fire and forget - return values are ignored.
     */
    sent: new SyncHook<[string]>(['id'], 'message.sent'),
    /**
     * Resolves the MessageSource (api/app) for a message id. The first tap returning a non-undefined result wins,
     * if all return undefined - callers fall back to MessageSource.APP.
     */
    source: new AsyncSeriesBailHook<[string], MessageSource | undefined>(
      ['id'],
      'message.source',
    ),
  });
}
