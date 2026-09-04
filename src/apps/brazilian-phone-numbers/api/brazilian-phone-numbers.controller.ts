import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UnprocessableEntityException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity } from '@nestjs/swagger';
import {
  BrazilianPhoneCachePurgeResponse,
  BrazilianPhoneCacheStatsResponse,
  BrazilianPhoneDbCacheEntry,
  BrazilianPhoneMemoryCacheEntry,
} from '@waha/apps/brazilian-phone-numbers/dto/cache.dto';
import {
  BrazilianPhoneNumbersAppConfig,
  DEFAULT_PERSISTENT_TTL,
} from '@waha/apps/brazilian-phone-numbers/dto/config.dto';
import { BrazilianPhoneCorePlugin } from '@waha/apps/brazilian-phone-numbers/plugins/BrazilianPhoneCorePlugin';
import { BrazilianPhoneNumbersAppService } from '@waha/apps/brazilian-phone-numbers/services/BrazilianPhoneNumbersAppService';
import { BrazilianPhoneCacheRepository } from '@waha/apps/brazilian-phone-numbers/storage/BrazilianPhoneCacheRepository';
import { AppName } from '@waha/apps/app_sdk/apps/apps';
import { UniqueAppResolver } from '@waha/apps/app_sdk/services/UniqueAppResolver';
import { AppDB } from '@waha/apps/app_sdk/storage/types';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { Action } from '@waha/core/auth/casl.types';
import { CanSession, FromParam } from '@waha/core/auth/policies';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { SessionApiParam } from '@waha/nestjs/params/SessionApiParam';
import { WAHAValidationPipe } from '@waha/nestjs/pipes/WAHAValidationPipe';
import { parseDurationMs } from '@waha/nestjs/validation/IsDuration';
import { LimitOffsetParams } from '@waha/structures/pagination.dto';
import * as ms from 'ms';

const DEFAULT_LIMIT = 100;

@ApiSecurity('api_key')
@Controller('api/apps/brazilian-phone-numbers/:session')
@UseGuards(PoliciesGuard)
export class BrazilianPhoneNumbersController {
  constructor(
    private manager: SessionManager,
    private resolver: UniqueAppResolver,
    private appService: BrazilianPhoneNumbersAppService,
  ) {}

  @Get('cache/memory')
  @SessionApiParam
  @ApiOperation({
    summary: 'List in-memory cache entries',
    description:
      'Entries from the in-memory cache tier of the running session, ' +
      'sorted by key. The session must be running.',
  })
  @CheckPolicies(CanSession(Action.Control, FromParam('session')))
  @UsePipes(new WAHAValidationPipe())
  async memory(
    @Param('session') session: string,
    @Query(new WAHAValidationPipe()) query: LimitOffsetParams,
  ): Promise<BrazilianPhoneMemoryCacheEntry[]> {
    const app = await this.getApp(session);
    const plugin = this.resolver.getPlugin(app, BrazilianPhoneCorePlugin);
    if (!plugin) {
      throw new UnprocessableEntityException(
        `Session '${session}' is not running - the in-memory cache is not available.`,
      );
    }
    const offset = query.offset ?? 0;
    const limit = query.limit ?? DEFAULT_LIMIT;
    return plugin.getMemoryCacheEntries().slice(offset, offset + limit);
  }

  @Get('cache/db')
  @SessionApiParam
  @ApiOperation({
    summary: 'List persistent cache entries',
    description:
      'Entries from the persistent (database) cache tier, sorted by id. ' +
      'Works even when the session is stopped.',
  })
  @CheckPolicies(CanSession(Action.Control, FromParam('session')))
  @UsePipes(new WAHAValidationPipe())
  async db(
    @Param('session') session: string,
    @Query(new WAHAValidationPipe()) query: LimitOffsetParams,
  ): Promise<BrazilianPhoneDbCacheEntry[]> {
    const app = await this.getApp(session);
    if (!this.persistentEnabled(app)) {
      throw new UnprocessableEntityException(
        `Persistent cache is disabled for the app in session '${session}'.`,
      );
    }
    const offset = query.offset ?? 0;
    const limit = query.limit ?? DEFAULT_LIMIT;
    return await this.repository(app).list(limit, offset);
  }

  @Get('cache/stats')
  @SessionApiParam
  @ApiOperation({
    summary: 'Get cache stats',
    description:
      'Stats for both cache tiers. "memory" is null when the session is not running, ' +
      '"db" is null when the persistent cache is disabled.',
  })
  @CheckPolicies(CanSession(Action.Control, FromParam('session')))
  @UsePipes(new WAHAValidationPipe())
  async stats(
    @Param('session') session: string,
  ): Promise<BrazilianPhoneCacheStatsResponse> {
    const app = await this.getApp(session);
    const plugin = this.resolver.getPlugin(app, BrazilianPhoneCorePlugin);
    const memory = plugin ? plugin.getMemoryCacheStats() : null;
    let db = null;
    if (this.persistentEnabled(app)) {
      db = await this.repository(app).stats();
    }
    return { memory: memory, db: db };
  }

  @Delete('cache/purge')
  @SessionApiParam
  @ApiOperation({
    summary: 'Purge the resolved-numbers cache',
    description:
      'Removes ALL persistent cache entries and clears the in-memory tier ' +
      '(the in-memory tier only when the session is running).',
  })
  @CheckPolicies(CanSession(Action.Control, FromParam('session')))
  @UsePipes(new WAHAValidationPipe())
  async purge(
    @Param('session') session: string,
  ): Promise<BrazilianPhoneCachePurgeResponse> {
    const app = await this.getApp(session);
    const deleted = await this.appService.purgeCache(this.manager, app);
    return { deleted: deleted };
  }

  private async getApp(session: string): Promise<AppDB> {
    return await this.resolver.getEnabledApp(
      session,
      AppName.brazilianPhoneNumbers,
    );
  }

  private persistentEnabled(app: AppDB): boolean {
    const config = app.config as BrazilianPhoneNumbersAppConfig;
    return config?.cache?.persistent ?? true;
  }

  private repository(app: AppDB): BrazilianPhoneCacheRepository {
    const knex = this.manager.store.getWAHADatabase();
    const config = app.config as BrazilianPhoneNumbersAppConfig;
    const ttlMs =
      parseDurationMs(config?.cache?.persistentTtl) ??
      ms(DEFAULT_PERSISTENT_TTL);
    return new BrazilianPhoneCacheRepository(knex, app.pk, ttlMs);
  }
}
