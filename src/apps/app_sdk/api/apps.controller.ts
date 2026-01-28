import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  AppsService,
  IAppsService,
} from '@waha/apps/app_sdk/services/IAppsService';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { CanSession, FromBody, FromQuery } from '@waha/core/auth/policies';
import { Action, session as SessionName } from '@waha/core/auth/casl.types';
import { WAHAValidationPipe } from '@waha/nestjs/pipes/WAHAValidationPipe';

import { App } from '../dto/app.dto';
import { ListAppsQuery } from '../dto/query.dto';

@ApiSecurity('api_key')
@Controller('api/apps')
@ApiTags('🧩 Apps')
@UseGuards(PoliciesGuard)
export class AppsController {
  constructor(
    @Inject(AppsService)
    private appsService: IAppsService,
    private manager: SessionManager,
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'List all apps for a session' })
  @CheckPolicies(CanSession(Action.Use, FromQuery('session')))
  @UsePipes(new WAHAValidationPipe())
  async list(
    @Query(new WAHAValidationPipe()) query: ListAppsQuery,
  ): Promise<App[]> {
    return this.appsService.list(this.manager, query.session);
  }

  @Post('/')
  @ApiOperation({ summary: 'Create a new app' })
  @CheckPolicies(CanSession(Action.Use, FromBody('session')))
  @UsePipes(new WAHAValidationPipe())
  async create(@Body() app: App): Promise<App> {
    const result = await this.appsService.create(this.manager, app);
    const isRunning = this.manager.isRunning(app.session);
    if (isRunning && app.enabled) {
      await this.manager.restart(app.session);
    }
    return result;
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get app by ID' })
  @UsePipes(new WAHAValidationPipe())
  async get(@Param('id') id: string, @Req() req: any): Promise<App> {
    const app = await this.appsService.get(this.manager, id);
    if (!app) {
      throw new NotFoundException(`App '${id}' not found`);
    }
    if (!req.ability?.can(Action.Use, new SessionName(app.session))) {
      throw new ForbiddenException();
    }
    return app;
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update an existing app' })
  @UsePipes(new WAHAValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() app: App,
    @Req() req: any,
  ): Promise<App> {
    const existing = await this.appsService.get(this.manager, id);
    if (existing) {
      if (!req.ability?.can(Action.Use, new SessionName(existing.session))) {
        throw new ForbiddenException();
      }
    } else {
      if (!req.ability?.can(Action.Use, new SessionName(app.session))) {
        throw new ForbiddenException();
      }
    }

    if (!app.id) {
      app.id = id;
    } else if (app.id !== id) {
      throw new NotFoundException(
        `App ID in path (${id}) does not match ID in body (${app.id})`,
      );
    }

    const result = await this.appsService.upsert(this.manager, app);
    const isRunning = this.manager.isRunning(app.session);
    if (isRunning) {
      await this.manager.restart(app.session);
    }
    return result;
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete an app' })
  @UsePipes(new WAHAValidationPipe())
  async delete(@Param('id') id: string, @Req() req: any): Promise<void> {
    const existing = await this.appsService.get(this.manager, id);
    if (!existing) {
      throw new NotFoundException(`App '${id}' not found`);
    }
    if (!req.ability?.can(Action.Use, new SessionName(existing.session))) {
      throw new ForbiddenException();
    }
    const app = await this.appsService.delete(this.manager, id);
    const isRunning = this.manager.isRunning(app.session);
    if (isRunning) {
      await this.manager.restart(app.session);
    }
  }
}
