import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DRIZZLE } from '../db/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { eq, and, lt } from 'drizzle-orm';

const PENDING_TTL_HOURS = 72;

@Injectable()
export class PendingCleanupService {
  private readonly logger = new Logger(PendingCleanupService.name);

  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
  ) {}

  @Cron('0 3 * * *') // 3:00 AM daily
  async cleanupOldPendingLogs() {
    const cutoff = new Date(Date.now() - PENDING_TTL_HOURS * 60 * 60 * 1000);
    
    this.logger.log(`Cleaning up pending logs older than ${cutoff.toISOString()}`);

    const result = await this.db.update(schema.attendanceLogs)
      .set({ status: 'rejected' })
      .where(and(
        eq(schema.attendanceLogs.status, 'pending'),
        lt(schema.attendanceLogs.timestamp, cutoff)
      ))
      .returning({ id: schema.attendanceLogs.id });

    this.logger.log(`Marked ${result.length} old pending logs as rejected`);
  }
}
