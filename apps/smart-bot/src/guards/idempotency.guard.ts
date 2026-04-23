import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../common/redis/redis.module';
import { Request } from 'express';

@Injectable()
export class IdempotencyGuard implements CanActivate {
  private readonly logger = new Logger(IdempotencyGuard.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    // WAHA sends a unique 'id' in the webhook payload
    const body = request.body || {};
    const messageId = body.id || request.headers['x-waha-id'];

    if (!messageId) {
        // If there is no ID, we can't guarantee idempotency, but we shouldn't block it 
        // unless strict mode is required. For now, allow but log warning.
        this.logger.warn('Webhook received without ID. Idempotency check skipped.');
        return true;
    }

    const key = `processed:${messageId}`;
    const exists = await this.redis.get(key);

    if (exists) {
        this.logger.warn(`Duplicate webhook received: ${messageId}. Ignoring.`);
        return false; // Blocks the request
    }

    // Mark as processed for 24 hours (86400 seconds)
    await this.redis.set(key, '1', 'EX', 86400);
    return true;
  }
}
