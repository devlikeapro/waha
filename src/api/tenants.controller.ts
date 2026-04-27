import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { CanServer } from '@waha/core/auth/policies';
import { Action } from '@waha/core/auth/casl.types';

@ApiSecurity('api_key')
@Controller('api/tenants')
@ApiTags('🏢 Tenants')
@UseGuards(PoliciesGuard)
@CheckPolicies(CanServer(Action.Manage))
export class TenantsController {
  constructor() {}

  @Post('/')
  @ApiOperation({ summary: 'Create a new tenant' })
  async create(
    @Body()
    request: {
      name: string;
      quota?: {
        maxSessions?: number;
        maxApiKeys?: number;
        maxMediaStorageMb?: number;
        maxConcurrentSessions?: number;
      };
    },
  ): Promise<{ id: string; name: string; message: string }> {
    // TODO: Implement with ITenantRepository
    void request;
    return {
      id: 'tenant_' + Date.now(),
      name: request.name,
      message: 'Tenant creation not yet implemented - requires database schema update',
    };
  }

  @Get('/')
  @ApiOperation({ summary: 'List all tenants' })
  async list(): Promise<{ tenants: any[]; message: string }> {
    // TODO: Implement with ITenantRepository
    return {
      tenants: [],
      message: 'Tenant list not yet implemented - requires database schema update',
    };
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get tenant details' })
  async get(
    @Param('id') id: string,
  ): Promise<{ tenant: any | null; message: string }> {
    // TODO: Implement with ITenantRepository
    void id;
    return {
      tenant: null,
      message: 'Tenant retrieval not yet implemented - requires database schema update',
    };
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update tenant' })
  async update(
    @Param('id') id: string,
    @Body() request: any,
  ): Promise<{ success: boolean; message: string }> {
    // TODO: Implement with ITenantRepository
    void id;
    void request;
    return {
      success: false,
      message: 'Tenant update not yet implemented - requires database schema update',
    };
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete tenant' })
  async delete(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    // TODO: Implement with ITenantRepository
    void id;
    return {
      success: false,
      message: 'Tenant deletion not yet implemented - requires database schema update',
    };
  }

  @Get('/:id/quota')
  @ApiOperation({ summary: 'Get tenant quota usage' })
  async getQuota(
    @Param('id') id: string,
  ): Promise<{ usage: any; message: string }> {
    // TODO: Implement with ITenantRepository
    void id;
    return {
      usage: {
        sessionsCount: 0,
        apiKeysCount: 0,
        mediaStorageMb: 0,
        concurrentSessions: 0,
      },
      message: 'Quota check not yet implemented - requires database schema update',
    };
  }

  @Put('/:id/quota')
  @ApiOperation({ summary: 'Update tenant quota' })
  async updateQuota(
    @Param('id') id: string,
    @Body()
    quota: {
      maxSessions?: number;
      maxApiKeys?: number;
      maxMediaStorageMb?: number;
      maxConcurrentSessions?: number;
    },
  ): Promise<{ success: boolean; message: string }> {
    // TODO: Implement with ITenantRepository
    void id;
    void quota;
    return {
      success: false,
      message: 'Quota update not yet implemented - requires database schema update',
    };
  }
}
