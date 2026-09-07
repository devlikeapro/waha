import { UnprocessableEntityException } from '@nestjs/common';
import {
  BrazilianPhoneMemoryCacheEntry,
  BrazilianPhoneMemoryCacheStats,
} from '@waha/apps/brazilian-phone-numbers/dto/cache.dto';
import {
  BrazilianPhoneNumbersAppConfig,
  DEFAULT_MEMORY_TTL,
} from '@waha/apps/brazilian-phone-numbers/dto/config.dto';
import { BrazilianPhoneCacheRepository } from '@waha/apps/brazilian-phone-numbers/storage/BrazilianPhoneCacheRepository';
import {
  BR_PHONE_NEGATIVE_CACHE_TTL_SECONDS,
  extractPhoneDigits,
  generateBrazilMobileLookupCandidates,
  getBrazilPhoneCacheKeys,
  isBrazilCountryCode,
  isBrazilMobile,
  isMalformedBrazilPhone,
  needsBrazilWhatsAppLookup,
  normalizeBrazilMobileForSendDigits,
  normalizeBrazilTollFreeDigits,
  shouldSkipBrazilPhoneNormalization,
} from '@waha/apps/brazilian-phone-numbers/utils/brPhone';
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

export interface BrazilianPhoneCorePluginDeps {
  repository: BrazilianPhoneCacheRepository | null;
}

/**
 * Resolves Brazilian phone numbers into the chat id the account is actually
 * registered under (9th-digit ambiguity for DDD 31-99, static rule for
 * DDD < 31, 0800 toll-free rewrite), tiered cheapest-first:
 *
 * 1. in-memory cache, keyed by both forms of the number
 * 2. static 9th-digit rule for DDD < 31 - no network
 * 3. persistent database cache (verified resolutions only)
 * 4. local contact / LID store (engine-specific subclasses) - no network
 * 5. WhatsApp lookup, single-flight so concurrent sends share one query
 */
export class BrazilianPhoneCorePlugin extends SessionPlugin<
  BrazilianPhoneNumbersAppConfig,
  BrazilianPhoneCorePluginDeps
> {
  protected memory: NodeCache;
  // Single-flight guard: concurrent first-time resolutions of the same number
  // share one in-flight WhatsApp lookup instead of each firing its own query.
  private inflight: Map<string, Promise<string>> = new Map();

  constructor(
    session: WhatsappSession,
    logger: Logger,
    config: BrazilianPhoneNumbersAppConfig,
    deps: BrazilianPhoneCorePluginDeps,
  ) {
    super(session, logger, config, deps);
    const memoryTtlMs =
      parseDurationMs(config?.cache?.memoryTtl) ?? ms(DEFAULT_MEMORY_TTL);
    this.memory = new NodeCache({
      stdTTL: Math.floor(memoryTtlMs / 1000),
    });
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

  public getMemoryCacheStats(): BrazilianPhoneMemoryCacheStats {
    return { total: this.memory.keys().length };
  }

  // Entries sorted by key, so API pagination over them is stable.
  public getMemoryCacheEntries(): BrazilianPhoneMemoryCacheEntry[] {
    const entries: BrazilianPhoneMemoryCacheEntry[] = [];
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
    if (shouldSkipBrazilPhoneNormalization(withSuffix)) {
      return withSuffix;
    }

    const digits = extractPhoneDigits(withSuffix);
    // Brazilian toll-free (0800): deterministic rewrite to the stored form, no
    // lookup. Handled before the country-code gate because the dialed form
    // ('0800...') has no 55 prefix.
    const tollFree = normalizeBrazilTollFreeDigits(digits);
    if (tollFree) {
      return ensureSuffix(tollFree);
    }
    if (!isBrazilCountryCode(digits)) {
      return withSuffix;
    }
    // Malformed Brazilian numbers (e.g. 55859912): hard error only on the send
    // path; local-only ops just pass it through untouched.
    if (isMalformedBrazilPhone(digits)) {
      if (validate) {
        throw new UnprocessableEntityException(
          `Invalid Brazilian phone number '${withSuffix}'.`,
        );
      }
      return withSuffix;
    }
    // Landlines and already-valid non-mobile numbers are left untouched.
    if (!isBrazilMobile(digits)) {
      return withSuffix;
    }

    // Tier 1: in-memory cache. undefined = miss, '' = confirmed-negative
    // (strict mode), otherwise the resolved/best-guess chat id.
    const cached = this.memory.get<string>(digits);
    if (cached !== undefined) {
      if (cached === NOT_FOUND) {
        if (validate) {
          throw new UnprocessableEntityException(
            `Brazilian mobile phone number '${withSuffix}' does not exist on WhatsApp.`,
          );
        }
        return withSuffix;
      }
      return cached;
    }

    // DDD below the lookup range: static 9th-digit rule, no network needed.
    if (!needsBrazilWhatsAppLookup(digits)) {
      const normalized = ensureSuffix(
        normalizeBrazilMobileForSendDigits(digits),
      );
      this.cacheInMemory(digits, normalized);
      return normalized;
    }

    // Tier 2: database cache (verified resolutions only).
    const fromDb = await this.getFromDb(digits);
    if (fromDb) {
      this.cacheInMemory(digits, fromDb);
      return fromDb;
    }

    const candidates = generateBrazilMobileLookupCandidates(digits);

    // Tier 3: local contact/LID store (engine-specific), no network.
    const fromStore = await this.lookupKnownChatId(candidates);
    if (fromStore) {
      await this.cacheResolved(digits, fromStore);
      this.logger.debug(
        `BR mobile '${withSuffix}' resolved locally to '${fromStore}' (no WhatsApp lookup).`,
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
    return await this.resolveViaWhatsApp(digits, withSuffix, candidates);
  }

  private resolveViaWhatsApp(
    digits: string,
    withSuffix: string,
    candidates: string[],
  ): Promise<string> {
    const key = getBrazilPhoneCacheKeys(digits).sort().join('|');
    const inflight = this.inflight.get(key);
    if (inflight) {
      return inflight;
    }
    const promise = this.lookupOnWhatsApp(
      digits,
      withSuffix,
      candidates,
    ).finally(() => this.inflight.delete(key));
    this.inflight.set(key, promise);
    return promise;
  }

  private async lookupOnWhatsApp(
    digits: string,
    withSuffix: string,
    candidates: string[],
  ): Promise<string> {
    this.logger.debug(
      `BR mobile '${withSuffix}' not found locally, performing WhatsApp lookup for: ${candidates.join(
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
          `Failed to verify Brazilian mobile candidate '${candidate}': ${error}`,
        );
        continue;
      }
      // Prefer the phone-number chat id when the engine knows it; fall back to
      // whatever chat id was answered (a LID for accounts with no phone form -
      // routable, and it must not be reduced to digits).
      const chatId = result?.pn || result?.chatId;
      if (result?.numberExists && chatId) {
        await this.cacheResolved(digits, chatId);
        return chatId;
      }
    }

    // Could not validate due to network/engine error: send as-is, do not cache.
    if (lookupFailed) {
      this.logger.warn(
        `Could not validate Brazilian mobile number '${withSuffix}', sending as-is. Tried: ${candidates.join(
          ', ',
        )}`,
      );
      return withSuffix;
    }

    // Verified not to exist in any form.
    if (this.config.strict) {
      this.cacheInMemory(
        digits,
        NOT_FOUND,
        BR_PHONE_NEGATIVE_CACHE_TTL_SECONDS,
      );
      throw new UnprocessableEntityException(
        `Brazilian mobile phone number '${withSuffix}' does not exist on WhatsApp. Tried: ${candidates.join(
          ', ',
        )}`,
      );
    }
    // Soft (default): warn and send the best-guess anyway, so a lookup
    // false-negative never blocks a valid send. Short TTL - the number may
    // get registered later.
    const bestGuess = ensureSuffix(normalizeBrazilMobileForSendDigits(digits));
    this.cacheInMemory(digits, bestGuess, BR_PHONE_NEGATIVE_CACHE_TTL_SECONDS);
    this.logger.warn(
      `Brazilian mobile number '${withSuffix}' not found on WhatsApp, sending best-guess '${bestGuess}'. Tried: ${candidates.join(
        ', ',
      )}`,
    );
    return bestGuess;
  }

  // Cache under every form of the number, so both '5585...' and '55859...'
  // hit the same entry. Default TTL for resolutions, the short negative TTL
  // for best-guesses and confirmed-negatives.
  private cacheInMemory(digits: string, chatId: string, ttl?: number): void {
    for (const key of getBrazilPhoneCacheKeys(digits)) {
      this.memory.set(key, chatId, ttl);
    }
  }

  // Verified resolution: memory plus the database tier (when enabled).
  private async cacheResolved(digits: string, chatId: string): Promise<void> {
    this.cacheInMemory(digits, chatId);
    if (!this.deps.repository) {
      return;
    }
    try {
      const keys = getBrazilPhoneCacheKeys(digits);
      await this.deps.repository.setMany(keys, chatId, true, new Date());
    } catch (error) {
      this.logger.warn(
        `Failed to persist BR phone resolution for '${digits}': ${error}`,
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
        `Failed to read BR phone cache for '${digits}': ${error}`,
      );
      return null;
    }
  }
}
