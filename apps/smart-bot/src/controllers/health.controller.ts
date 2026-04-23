import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { Inject } from '@nestjs/common';
import { DRIZZLE } from '../db/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { sql } from 'drizzle-orm';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../common/redis/redis.module';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
    @Inject(REDIS_CLIENT) private redis: Redis,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // 1. Check Heap Memory (Fail if used > 150MB - strict for microservice)
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      
      // 2. Check Database Connectivity
      async () => {
        try {
            await this.db.execute(sql`SELECT 1`);
            return { database: { status: 'up' } };
        } catch (e) {
            return { database: { status: 'down', message: e.message } };
        }
      },

      // 3. Check Redis Connectivity
      async () => {
          try {
              const status = await this.redis.ping();
              if (status === 'PONG') return { redis: { status: 'up' } };
              throw new Error('Redis did not PONG');
          } catch (e) {
              return { redis: { status: 'down', message: e.message } };
          }
      }
    ]);
  }
}
