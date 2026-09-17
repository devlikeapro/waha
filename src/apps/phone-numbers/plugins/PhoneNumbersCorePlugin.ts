import { UnprocessableEntityException } from '@nestjs/common';
import {
  PhoneNumbersMemoryCacheEntry,
  PhoneNumbersMemoryCacheStats,
} from '@waha/apps/phone-numbers/dto/cache.dto';
import {
  DEFAULT_MEMORY_TTL,
  PhoneNumbersBaseConfig,
} from '@waha/apps/phone-numbers/dto/config.dto';
import { PhoneNumberRule } from '@waha/apps/phone-numbers/rules/PhoneNumberRule';
import { PhoneNumbersCacheRepository } from '@waha/apps/phone-numbers/storage/PhoneNumbersCacheRepository';
import {
  extractPhoneDigits,
  shouldSkipPhoneNormalization,
} from '@waha/apps/phone-numbers/utils/phone';
import { ensureSuffix, WhatsappSession } from '@waha/core/abc/session.abc';
import { SessionPlugin } from '@waha/core/abc/session.plugin';
import { PluginHook } from '@waha/core/abc/session.plugin.hooks';
import { parseDurationMs } from '@waha/nestjs/validation/IsDuration';
import { WANumberExistResult } from '@waha/structures/chatting.dto';
import * as ms from 'ms';
import * as NodeCache from 'node-cache';
import { Logger } from 'pino';

// Engine methods that call these hooks from inside the resolution tiers
// (WPP 'checkNumberStatus', NOWEB/GOWS/WPP 'findLIDByPhoneNumber' route the
// phone through 'wid.chat' themselves) - resolving here again would recurse.
const SKIP_METHODS = new Set(['checkNumberStatus', 'findLIDByPhoneNumber']);

// Message-send paths get the full resolution, including the WhatsApp lookup,
// and may reject with 422 (malformed number, strict mode). Every other method
// (typing, seen, read, delete, group ops, ...) resolves locally only - cache
// and static rule - and never reaches the network or throws.
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

// Confirmed-negative marker in the memory cache ('' is not a valid chat id).
const NOT_FOUND = '';

// Unverified best-guesses and confirmed-negatives live only in the in-memory
// cache with this short TTL, so a number registered later is re-checked soon.
export const NEGATIVE_CACHE_TTL_SECONDS = 10 * 60;

export interface PhoneNumbersCorePluginDeps {
  repository: PhoneNumbersCacheRepository | null;
  rules: PhoneNumberRule[];
}

/**
 * Resolves phone numbers into the chat id the account is actually registered
 * under. Which numbers and which forms to try come from the injected rules,
 * the tiers are shared, cheapest-first:
 *
 * 1. in-memory cache, keyed by every form of the number
 * 2. deterministic rewrite from the rule - no network
 * 3. persistent database cache (verified resolutions only)
 * 4. local contact / LID store (engine-specific subclasses) - no network
 * 5. WhatsApp lookup, single-flight so concurrent sends share one query
 */
export class PhoneNumbersCorePlugin extends SessionPlugin<
  PhoneNumbersBaseConfig,
  PhoneNumbersCorePluginDeps
> {
  protected memory: NodeCache;
  protected rules: PhoneNumberRule[];
  // Single-flight guard: concurrent first-time resolutions of the same number
  // share one in-flight WhatsApp lookup instead of each firing its own query.
  private inflight: Map<string, Promise<string>> = new Map();

  constructor(
    session: WhatsappSession,
    logger: Logger,
    config: PhoneNumbersBaseConfig,
    deps: PhoneNumbersCorePluginDeps,
  ) {
    super(session, logger, config, deps);
    const memoryTtlMs =
      parseDurationMs(config?.cache?.memoryTtl) ?? ms(DEFAULT_MEMORY_TTL);
    this.memory = new NodeCache({
      stdTTL: Math.floor(memoryTtlMs / 1000),
    });
    this.rules = deps.rules;
  }

  @PluginHook((hooks) => hooks.wid.chat)
  async resolveChatWid(wid: string, method: string): Promise<string> {
    if (SKIP_METHODS.has(method)) {
      return wid;
    }
    return await this.resolve(wid, SEND_METHODS.has(method));
  }

  // Mentions are best-effort: a non-existent mention must never break the send.
  @PluginHook((hooks) => hooks.wid.mention)
  async resolveMentionWid(wid: string, method: string): Promise<string> {
    if (SKIP_METHODS.has(method)) {
      return wid;
    }
    try {
      return await this.resolve(wid, SEND_METHODS.has(method));
    } catch (error) {
      this.logger.warn(
        `Could not resolve mention '${wid}', using as-is: ${error}`,
      );
      return wid;
    }
  }

  public clearMemoryCache(): void {
    this.memory.flushAll();
  }

  public getMemoryCacheStats(): PhoneNumbersMemoryCacheStats {
    return { total: this.memory.keys().length };
  }

  // Entries sorted by key, so API pagination over them is stable.
  public getMemoryCacheEntries(): PhoneNumbersMemoryCacheEntry[] {
    const entries: PhoneNumbersMemoryCacheEntry[] = [];
    for (const key of this.memory.keys().sort()) {
      const chatId = this.memory.get<string>(key);
      if (chatId === undefined) {
        continue;
      }
      // getTtl(): expiration timestamp in ms, 0 = no TTL
      const expiresAtMs = this.memory.getTtl(key);
      entries.push({
        key: key,
        chatId: chatId,
        expiresAt: expiresAtMs ? new Date(expiresAtMs) : null,
      });
    }
    return entries;
  }

  // Optional per-engine tier: resolve a candidate against the local contact /
  // LID store without hitting WhatsApp servers. Default: no local store.
  protected async lookupKnownChatId(
    candidates: string[],
  ): Promise<string | null> {
    void candidates;
    return null;
  }

  // Cached values are full chat ids ('5511...@c.us' or '123@lid'), never bare
  // digits: stripping the suffix loses which addressing form was resolved, and
  // re-adding '@c.us' to LID digits builds an id that addresses nobody.
  protected async resolve(wid: string, validate: boolean): Promise<string> {
    const withSuffix = ensureSuffix(wid);
    if (shouldSkipPhoneNormalization(withSuffix)) {
      return withSuffix;
    }

    const digits = extractPhoneDigits(withSuffix);
    const rule = this.rules.find((r) => r.matches(digits));
    if (!rule) {
      return withSuffix;
    }
    const resolution = rule.resolve(digits);
    // Malformed: hard error only on the send path, local-only ops pass it through
    if (!resolution) {
      if (validate) {
        throw new UnprocessableEntityException(
          `Invalid phone number '${withSuffix}'.`,
        );
      }
      return withSuffix;
    }
    const candidates = resolution.candidates;
    const fallback = ensureSuffix(resolution.fallback);
    // Nothing to check - the rule already knows the form
    if (candidates.length === 0) {
      if (fallback !== withSuffix) {
        this.cacheInMemory(digits, [], fallback);
      }
      return fallback;
    }

    // Tier 1: in-memory cache. undefined = miss, '' = confirmed-negative
    // (strict mode), otherwise the resolved/best-guess chat id.
    const cached = this.memory.get<string>(digits);
    if (cached !== undefined) {
      if (cached === NOT_FOUND) {
        if (validate) {
          throw new UnprocessableEntityException(
            `Phone number '${withSuffix}' does not exist on WhatsApp.`,
          );
        }
        return withSuffix;
      }
      return cached;
    }

    // Tier 2: database cache (verified resolutions only).
    const fromDb = await this.getFromDb(digits);
    if (fromDb) {
      this.cacheInMemory(digits, candidates, fromDb);
      return fromDb;
    }

    // Tier 3: local contact/LID store (engine-specific), no network.
    const fromStore = await this.lookupKnownChatId(candidates);
    if (fromStore) {
      await this.cacheResolved(digits, candidates, fromStore);
      this.logger.debug(
        `'${withSuffix}' resolved locally to '${fromStore}' (no WhatsApp lookup).`,
      );
      return fromStore;
    }

    // Local-only ops never reach the network: return the input as-is.
    if (!validate) {
      return withSuffix;
    }
    // The WhatsApp lookup tier is disabled by config: send as provided.
    if (this.config.lookup === false) {
      return withSuffix;
    }

    // Tier 4: WhatsApp lookup as last resort, de-duplicated via single-flight.
    return await this.resolveViaWhatsApp(
      digits,
      withSuffix,
      candidates,
      fallback,
    );
  }

  private resolveViaWhatsApp(
    digits: string,
    withSuffix: string,
    candidates: string[],
    fallback: string,
  ): Promise<string> {
    const key = cacheKeys(digits, candidates).sort().join('|');
    const inflight = this.inflight.get(key);
    if (inflight) {
      return inflight;
    }
    const promise = this.lookupOnWhatsApp(
      digits,
      withSuffix,
      candidates,
      fallback,
    ).finally(() => this.inflight.delete(key));
    this.inflight.set(key, promise);
    return promise;
  }

  private async lookupOnWhatsApp(
    digits: string,
    withSuffix: string,
    candidates: string[],
    fallback: string,
  ): Promise<string> {
    this.logger.debug(
      `'${withSuffix}' not found locally, performing WhatsApp lookup for: ${candidates.join(
        ', ',
      )}`,
    );
    let lookupFailed = false;
    for (const candidate of candidates) {
      let result: WANumberExistResult;
      try {
        result = await this.session.checkNumberStatus({
          phone: candidate,
          session: this.session.name,
        });
      } catch (error) {
        lookupFailed = true;
        this.logger.warn(
          `Failed to verify phone number candidate '${candidate}': ${error}`,
        );
        continue;
      }
      // Prefer the phone-number chat id when the engine knows it; fall back to
      // whatever chat id was answered (a LID for accounts with no phone form -
      // routable, and it must not be reduced to digits).
      const chatId = result?.pn || result?.chatId;
      if (result?.numberExists && chatId) {
        await this.cacheResolved(digits, candidates, chatId);
        return chatId;
      }
    }

    // Could not validate due to network/engine error: send as-is, do not cache.
    if (lookupFailed) {
      this.logger.warn(
        `Could not validate phone number '${withSuffix}', sending as-is. Tried: ${candidates.join(
          ', ',
        )}`,
      );
      return withSuffix;
    }

    // Verified not to exist in any form.
    if (this.config.strict) {
      this.cacheInMemory(
        digits,
        candidates,
        NOT_FOUND,
        NEGATIVE_CACHE_TTL_SECONDS,
      );
      throw new UnprocessableEntityException(
        `Phone number '${withSuffix}' does not exist on WhatsApp. Tried: ${candidates.join(
          ', ',
        )}`,
      );
    }
    // Soft (default): warn and send the best-guess anyway, so a lookup
    // false-negative never blocks a valid send. Short TTL - the number may
    // get registered later.
    this.cacheInMemory(
      digits,
      candidates,
      fallback,
      NEGATIVE_CACHE_TTL_SECONDS,
    );
    this.logger.warn(
      `Phone number '${withSuffix}' not found on WhatsApp, sending '${fallback}'. Tried: ${candidates.join(
        ', ',
      )}`,
    );
    return fallback;
  }

  // Cache under every form of the number, so both '5585...' and '55859...'
  // hit the same entry. Default TTL for resolutions, the short negative TTL
  // for best-guesses and confirmed-negatives.
  private cacheInMemory(
    digits: string,
    candidates: string[],
    chatId: string,
    ttl?: number,
  ): void {
    for (const key of cacheKeys(digits, candidates)) {
      this.memory.set(key, chatId, ttl);
    }
  }

  // Verified resolution: memory plus the database tier (when enabled).
  private async cacheResolved(
    digits: string,
    candidates: string[],
    chatId: string,
  ): Promise<void> {
    this.cacheInMemory(digits, candidates, chatId);
    if (!this.deps.repository) {
      return;
    }
    try {
      const keys = cacheKeys(digits, candidates);
      await this.deps.repository.setMany(keys, chatId, true, new Date());
    } catch (error) {
      this.logger.warn(
        `Failed to persist phone number resolution for '${digits}': ${error}`,
      );
    }
  }

  private async getFromDb(digits: string): Promise<string | null> {
    if (!this.deps.repository) {
      return null;
    }
    try {
      const entry = await this.deps.repository.get(digits);
      return entry?.chatId ?? null;
    } catch (error) {
      this.logger.warn(
        `Failed to read phone number cache for '${digits}': ${error}`,
      );
      return null;
    }
  }
}

function cacheKeys(digits: string, candidates: string[]): string[] {
  return [...new Set([digits, ...candidates])];
}
