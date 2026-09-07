import { UnprocessableEntityException } from '@nestjs/common';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { SessionPlugin } from '@waha/core/abc/session.plugin';
import { PluginHook } from '@waha/core/abc/session.plugin.hooks';
import { parseDurationMs } from '@waha/nestjs/validation/IsDuration';
import { ArgentinePhoneNumbersAppConfig } from '../dto/config.dto';
import { argentinePhoneCandidates } from '../utils/arPhone';
import * as NodeCache from 'node-cache';
import { Logger } from 'pino';

// Identity-sensitive operations (e.g. rejectCall, deleteMessage) must pass through.
// This allowlist also prevents recursion from WPP's checkNumberStatus hook.
const SEND_METHODS = new Set([
  'sendText',
  'sendImage',
  'sendFile',
  'sendVideo',
  'sendVoice',
  'sendMedia',
  'sendPoll',
  'sendList',
  'sendButtons',
  'sendButtonsReply',
  'sendContactVCard',
  'sendLocation',
  'sendLinkPreview',
  'sendLinkCustomPreview',
  'sendEvent',
  'reply',
  'forwardMessage',
]);
const NOT_FOUND = '';
const NEGATIVE_TTL_SECONDS = 60;

export class ArgentinePhonePlugin extends SessionPlugin<
  ArgentinePhoneNumbersAppConfig
> {
  private memory: NodeCache;
  private lastSweep = 0;
  private inflight = new Map<string, Promise<string | null>>();

  constructor(
    session: WhatsappSession,
    logger: Logger,
    config: ArgentinePhoneNumbersAppConfig,
    deps: null,
  ) {
    super(
      session,
      logger,
      config ?? new ArgentinePhoneNumbersAppConfig(),
      deps,
    );
    this.memory = new NodeCache({
      stdTTL: Math.max(
        1,
        Math.ceil((parseDurationMs(this.config.memoryTtl) ?? 86400000) / 1000),
      ),
      checkperiod: 0,
    });
  }

  @PluginHook((hooks) => hooks.wid.chat)
  async resolveChatWid(wid: string, method: string): Promise<string> {
    if (!SEND_METHODS.has(method)) {
      return wid;
    }
    const candidates = argentinePhoneCandidates(wid);
    if (!candidates) {
      return wid;
    }
    // Key by the supplied phone, not by the pair: both variants may resolve
    // independently. Never overwrite the alternate's cache entry.
    const key = candidates[0];
    // Sweep on activity instead of creating a timer that outlives the plugin.
    // Expired destinations that are never queried again must also be removed.
    const now = Date.now();
    if (now - this.lastSweep >= 60000) {
      for (const cachedKey of this.memory.keys()) {
        this.memory.get(cachedKey);
      }
      this.lastSweep = now;
    }
    const cached = this.memory.get<string>(key);
    if (cached !== undefined) {
      return this.fromCache(cached, wid);
    }
    if (this.config.lookup === false) {
      return wid;
    }
    let pending = this.inflight.get(key);
    if (!pending) {
      pending = this.lookup(candidates).finally(() =>
        this.inflight.delete(key),
      );
      this.inflight.set(key, pending);
    }
    const resolved = await pending;
    return this.fromCache(resolved, wid);
  }

  private fromCache(resolved: string | null, wid: string): string {
    if (resolved === NOT_FOUND) {
      if (this.config.strict) {
        throw new UnprocessableEntityException(
          'Neither Argentine phone number variant exists on WhatsApp.',
        );
      }
      return wid;
    }
    return resolved ?? wid;
  }

  private async lookup(candidates: string[]): Promise<string | null> {
    const key = candidates[0];
    for (const phone of candidates) {
      try {
        const result = await this.session.checkNumberStatus({
          phone: phone,
          session: this.session.name,
        });
        if (result?.numberExists) {
          const chatId = result.pn || result.chatId;
          if (!chatId) {
            // A positive result without an address is not evidence of absence.
            return null;
          }
          this.memory.set(key, chatId);
          return chatId;
        }
        if (result?.numberExists !== false) {
          return null;
        }
      } catch {
        // A timeout for the original must not retarget a possibly valid account.
        this.logger.warn(
          'Argentine phone lookup failed; keeping the original destination.',
        );
        return null;
      }
    }
    this.memory.set(key, NOT_FOUND, NEGATIVE_TTL_SECONDS);
    this.logger.warn('Neither Argentine phone variant was found on WhatsApp.');
    return NOT_FOUND;
  }
}
