import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UnprocessableEntityException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { Action } from '@waha/core/auth/casl.types';
import { CanServer } from '@waha/core/auth/policies';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { ApiKey, CheckInvariant } from '@waha/core/storage/IApiKeyRepository';
import { WAHAValidationPipe } from '@waha/nestjs/pipes/WAHAValidationPipe';
import { ApiKeyDTO, ApiKeyRequest } from '@waha/structures/apikeys.dto';
import { generatePrefixedId, generateSecret } from '@waha/utils/ids';

@ApiSecurity('api_key')
@Controller('api/keys')
@ApiTags('🔑 Api Keys')
@UseGuards(PoliciesGuard)
@CheckPolicies(CanServer(Action.Manage))
export class ApiKeysController {
  constructor(private manager: SessionManager) {}

  @Post('/')
  @ApiOperation({ summary: 'Create a new API key' })
  @UsePipes(new WAHAValidationPipe())
  async create(@Body() body: ApiKeyRequest): Promise<ApiKeyDTO> {
    CheckInvariant(body);
    if (body.session) {
      const exists = await this.manager.exists(body.session);
      if (!exists) {
        throw new UnprocessableEntityException(
          `Session "${body.session}" does not exist`,
        );
      }
    }
    let apikey: ApiKey | null = null;
    // Try 5 times to check there's no conflict on id and key
    for (let i = 0; i < 5; i++) {
      apikey = {
        id: generatePrefixedId('key_id'),
        key: `key_${generateSecret(32)}`,
        isActive: body.isActive,
        isAdmin: body.isAdmin,
        session: body.session,
        rules: null,
      };
      const idExists = await this.manager.apiKeyRepository.getById(apikey.id);
      if (idExists) {
        continue;
      }
      const keyExists = await this.manager.apiKeyRepository.getByKey(
        apikey.key,
      );
      if (keyExists) {
        continue;
      }
      break;
    }
    if (!apikey) {
      throw new UnprocessableEntityException(
        `Failed to generate API key, try again`,
      );
    }
    CheckInvariant(apikey);
    await this.manager.apiKeyRepository.upsert(apikey);
    return ApiKeyToDTO(apikey);
  }

  @Get('/')
  @ApiOperation({ summary: 'Get all API keys' })
  async list(): Promise<ApiKeyDTO[]> {
    const keys = await this.manager.apiKeyRepository.list();
    return keys.map((key) => ApiKeyToDTO(key));
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update an API key' })
  @UsePipes(new WAHAValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() body: ApiKeyRequest,
  ): Promise<ApiKeyDTO> {
    const existing = await this.manager.apiKeyRepository.getById(id);
    if (!existing) {
      throw new NotFoundException('API key not found');
    }

    const apikey: ApiKey = {
      ...existing,
      isActive: body.isActive,
      isAdmin: body.isAdmin,
      session: body.session,
    };
    CheckInvariant(apikey);
    if (apikey.session) {
      const exists = await this.manager.exists(apikey.session);
      if (!exists) {
        throw new UnprocessableEntityException(
          `Session "${apikey.session}" does not exist`,
        );
      }
    }

    CheckInvariant(apikey);
    await this.manager.apiKeyRepository.upsert(apikey);
    return ApiKeyToDTO(apikey);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete an API key' })
  async delete(@Param('id') id: string): Promise<{ result: true }> {
    const existing = await this.manager.apiKeyRepository.getById(id);
    if (!existing) {
      throw new NotFoundException('API key not found');
    }
    await this.manager.apiKeyRepository.deleteById(id);
    return { result: true };
  }
}

function ApiKeyToDTO(apikey: ApiKey): ApiKeyDTO {
  return {
    id: apikey.id,
    key: apikey.key,
    isActive: apikey.isActive,
    isAdmin: apikey.isAdmin,
    session: apikey.session,
  };
}
