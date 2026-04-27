import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { SessionManagerCore } from '@waha/core/manager.core';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { CanServer } from '@waha/core/auth/policies';

import { Action } from '@waha/core/auth/casl.types';

@ApiSecurity('api_key')
@Controller('api/admin')
@ApiTags('🔧 Admin')
@UseGuards(PoliciesGuard)
@CheckPolicies(CanServer(Action.Manage))
export class AdminController {
  constructor(private manager: SessionManagerCore) {}

  @Post('clear-storage')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Clear all media storage',
    description:
      'Permanently deletes all media files from all sessions. ' +
      'Use with caution - this action cannot be undone.',
  })
  async clearStorage(): Promise<{ success: boolean; message: string }> {
    try {
      await this.manager.clearStorage();
      return {
        success: true,
        message: 'Storage cleared successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to clear storage: ${error}`,
      };
    }
  }
}
