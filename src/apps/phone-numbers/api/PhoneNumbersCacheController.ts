import {
  Delete,
  Get,
  Param,
  Query,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppName } from '@waha/apps/app_sdk/apps/apps';
import { UniqueAppResolver } from '@waha/apps/app_sdk/services/UniqueAppResolver';
import { AppDB } from '@waha/apps/app_sdk/storage/types';
import {
  PhoneNumbersCachePurgeResponse,
  PhoneNumbersCacheStatsResponse,
  PhoneNumbersDbCacheEntry,
  PhoneNumbersMemoryCacheEntry,
} from '@waha/apps/phone-numbers/dto/cache.dto';
import { PhoneNumbersCorePlugin } from '@waha/apps/phone-numbers/plugins/PhoneNumbersCorePlugin';
import { PhoneNumbersAppServiceBase } from '@waha/apps/phone-numbers/services/PhoneNumbersAppServiceBase';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { Action } from '@waha/core/auth/casl.types';
import { CanSession, FromParam } from '@waha/core/auth/policies';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { SessionApiParam } from '@waha/nestjs/params/SessionApiParam';
import { WAHAValidationPipe } from '@waha/nestjs/pipes/WAHAValidationPipe';
import { LimitOffsetParams } from '@waha/structures/pagination.dto';

const DEFAULT_LIMIT = 100;

/**
 * Cache endpoints shared by every phone numbers app, the app sets the route
 */
export abstract class PhoneNumbersCacheController {
  protected constructor(
    protected readonly manager: SessionManager,
    protected readonly resolver: UniqueAppResolver,
    protected readonly appService: PhoneNumbersAppServiceBase<any>,
    protected readonly appName: AppName,
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
  ): Promise<PhoneNumbersMemoryCacheEntry[]> {
    const app = await this.getApp(session);
    const plugin = this.resolver.getPlugin(app, PhoneNumbersCorePlugin);
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
  ): Promise<PhoneNumbersDbCacheEntry[]> {
    const app = await this.getApp(session);
    if (!this.appService.persistentEnabled(app)) {
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
  ): Promise<PhoneNumbersCacheStatsResponse> {
    const app = await this.getApp(session);
    const plugin = this.resolver.getPlugin(app, PhoneNumbersCorePlugin);
    const memory = plugin ? plugin.getMemoryCacheStats() : null;
    let db = null;
    if (this.appService.persistentEnabled(app)) {
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
  ): Promise<PhoneNumbersCachePurgeResponse> {
    const app = await this.getApp(session);
    const deleted = await this.appService.purgeCache(this.manager, app);
    return { deleted: deleted };
  }

  private async getApp(session: string): Promise<AppDB> {
    return await this.resolver.getEnabledApp(session, this.appName);
  }

  private repository(app: AppDB) {
    const knex = this.manager.store.getWAHADatabase();
    return this.appService.repository(knex, app);
  }
}
