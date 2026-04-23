import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as crypto from 'crypto';

// WAHA uses X-Hub-Signature-256 header (GitHub webhook standard)
const SIGNATURE_HEADER = 'x-hub-signature-256';

@Injectable()
export class HmacGuard implements CanActivate {
  private readonly logger = new Logger(HmacGuard.name);

  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { rawBody: Buffer }>();
    const signature = request.headers[SIGNATURE_HEADER] as string;
    
    const secret = this.configService.get<string>('HMAC_SECRET');
    if (!secret) {
        this.logger.warn('No HMAC_SECRET configured, skipping HMAC check.');
        return true;
    }

    if (!signature) {
      this.logger.error(`Missing ${SIGNATURE_HEADER} header`);
      throw new UnauthorizedException('Missing Signature');
    }

    const payload = request.rawBody;
    if (!payload) {
        this.logger.error('No rawBody found on request. Ensure app is created with { rawBody: true }');
        throw new UnauthorizedException('Internal Error: Raw Body Missing');
    }

    // Signature format: sha256=<hex>
    const expectedSignature = 'sha256=' + crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // Use constant-time comparison to prevent timing attacks
    try {
      const signatureBuffer = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expectedSignature);
      
      if (signatureBuffer.length !== expectedBuffer.length || 
          !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
        this.logger.error('Invalid Signature');
        throw new UnauthorizedException('Invalid Signature');
      }
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      this.logger.error('Signature comparison failed', e);
      throw new UnauthorizedException('Invalid Signature');
    }

    // Replay Protection
    const body = request.body;
    if (body?.timestamp) {
        const now = Date.now();
        // Allow 5 minutes drift (clock skew + network delay)
        if (now - body.timestamp > 5 * 60 * 1000) {
             this.logger.error('Replay Attack Detected: Event is too old.');
             throw new UnauthorizedException('Replay Attack Detected');
        }
    }

    return true;
  }
}
