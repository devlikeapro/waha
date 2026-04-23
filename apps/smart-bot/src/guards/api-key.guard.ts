import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = this.configService.get<string>('DASHBOARD_API_KEY');
    
    // If no API key configured, allow access (dev mode)
    if (!apiKey) return true;

    const providedKey = request.headers['x-api-key'] as string;
    
    if (!providedKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    // Timing-safe comparison (hash both to ensure equal length)
    const expectedHash = crypto.createHash('sha256').update(apiKey).digest();
    const providedHash = crypto.createHash('sha256').update(providedKey).digest();
    
    if (!crypto.timingSafeEqual(expectedHash, providedHash)) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
