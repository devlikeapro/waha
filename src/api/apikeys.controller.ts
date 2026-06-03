import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { Action } from '@waha/core/auth/casl.types';
import { CanServer } from '@waha/core/auth/policies';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { ApiKeyService } from '@waha/core/services/ApiKeyService';
import { WAHAValidationPipe } from '@waha/nestjs/pipes/WAHAValidationPipe';
import { ApiKeyDTO, ApiKeyRequest } from '@waha/structures/apikeys.dto';

@ApiSecurity('api_key')
@Controller('api/keys')
@ApiTags('🔑 Api Keys')
@UseGuards(PoliciesGuard)
@CheckPolicies(CanServer(Action.Manage))
export class ApiKeysController {
  constructor(private manager: SessionManager) {}

  private get service(): ApiKeyService {
    return new ApiKeyService(this.manager);
  }

  @Post('/')
  @ApiOperation({ summary: 'Create a new API key' })
  @UsePipes(new WAHAValidationPipe())
  async create(@Body() body: ApiKeyRequest): Promise<ApiKeyDTO> {
    return this.service.create(body);
  }

  @Get('/')
  @ApiOperation({ summary: 'Get all API keys' })
  async list(): Promise<ApiKeyDTO[]> {
    return this.service.list();
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update an API key' })
  @UsePipes(new WAHAValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() body: ApiKeyRequest,
  ): Promise<ApiKeyDTO> {
    return this.service.update(id, body);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete an API key' })
  async delete(@Param('id') id: string): Promise<{ result: true }> {
    return this.service.delete(id);
  }
}
