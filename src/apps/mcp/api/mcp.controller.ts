import { Controller, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { McpService } from '../mcp.service';

@Controller('mcp')
@ApiTags('🧩 Apps')
export class McpController {
  constructor(private readonly mcp: McpService) {}

  @Post()
  post(@Req() req: Request, @Res() res: Response) {
    return this.mcp.handlePost(req, res);
  }
}
