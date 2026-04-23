import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE } from '../db/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { eq, gte, and, count, or, desc, lte } from 'drizzle-orm';
import { WahaClientService } from './waha-client.service';

export interface DailyLogEntry {
  id: number;
  timestamp: Date | null;
  status: string | null;
  workerName: string | null;
  company: string | null;
  groupId: string;
  confidence: number | null;
}

/**
 * Parses month input like "January", "Jan", "1", "2026-01" into date range.
 * @returns { start, end, label } or null if invalid
 */
export function parseMonthInput(input: string, referenceDate = new Date()): { start: Date; end: Date; label: string } | null {
  if (!input || typeof input !== 'string') return null;
  
  const trimmed = input.trim().toLowerCase();
  if (trimmed.length === 0 || trimmed.length > 20) return null;
  
  const currentYear = referenceDate.getFullYear();
  
  const monthNames: Record<string, number> = {
    january: 0, jan: 0, '1': 0,
    february: 1, feb: 1, '2': 1,
    march: 2, mar: 2, '3': 2,
    april: 3, apr: 3, '4': 3,
    may: 4, '5': 4,
    june: 5, jun: 5, '6': 5,
    july: 6, jul: 6, '7': 6,
    august: 7, aug: 7, '8': 7,
    september: 8, sep: 8, sept: 8, '9': 8,
    october: 9, oct: 9, '10': 9,
    november: 10, nov: 10, '11': 10,
    december: 11, dec: 11, '12': 11,
  };

  // Try "YYYY-MM" format
  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10) - 1;
    if (month >= 0 && month <= 11 && year >= 1970 && year <= 9999) {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
      const label = start.toLocaleString('default', { month: 'long', year: 'numeric' });
      return { start, end, label };
    }
    return null;
  }

  // Try month name or number
  const monthIndex = monthNames[trimmed];
  if (monthIndex !== undefined) {
    const start = new Date(currentYear, monthIndex, 1);
    const end = new Date(currentYear, monthIndex + 1, 0, 23, 59, 59, 999);
    const label = start.toLocaleString('default', { month: 'long', year: 'numeric' });
    return { start, end, label };
  }

  return null;
}

/**
 * Generates CSV content from daily attendance logs.
 */
export function generateAttendanceCsv(logs: DailyLogEntry[], date: Date): string {
  const header = 'ID,Timestamp,Worker Name,Company,Group/Chat,Status,Confidence';
  const rows = logs.map(log => {
    const timestamp = log.timestamp ? log.timestamp.toISOString() : '';
    const name = escapeCsvField(log.workerName || 'Unknown');
    const company = escapeCsvField(log.company || '');
    const groupId = escapeCsvField(log.groupId);
    const confidence = log.confidence !== null ? `${Math.round((1 - log.confidence) * 100)}%` : '';
    return `${log.id},${timestamp},${name},${company},${groupId},${log.status || ''},${confidence}`;
  });
  return [header, ...rows].join('\n');
}

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

@Injectable()
export class EveningReviewService {
  private readonly logger = new Logger(EveningReviewService.name);

  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
    private readonly wahaClient: WahaClientService,
    private readonly configService: ConfigService,
  ) {}

  @Cron('0 20 * * *') // 8:00 PM daily
  async sendDailySummary() {
    const adminPhone = this.configService.get<string>('ADMIN_PHONE');
    const session = this.configService.get<string>('WAHA_SESSION', 'default');
    
    if (!adminPhone) {
      this.logger.warn('ADMIN_PHONE not configured, skipping evening review');
      return;
    }

    this.logger.log('Running evening review cron...');

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Get counts
    const [confirmed, pending] = await Promise.all([
      this.db.select({ value: count() })
        .from(schema.attendanceLogs)
        .where(and(
          or(eq(schema.attendanceLogs.status, 'confirmed'), eq(schema.attendanceLogs.status, 'auto')),
          gte(schema.attendanceLogs.timestamp, todayStart)
        )),
      this.db.select({ value: count() })
        .from(schema.attendanceLogs)
        .where(and(
          eq(schema.attendanceLogs.status, 'pending'),
          gte(schema.attendanceLogs.timestamp, todayStart)
        )),
    ]);

    const confirmedCount = confirmed[0].value;
    const pendingCount = pending[0].value;

    // Get detailed logs for CSV
    const dailyLogs = await this.db.select({
      id: schema.attendanceLogs.id,
      timestamp: schema.attendanceLogs.timestamp,
      status: schema.attendanceLogs.status,
      groupId: schema.attendanceLogs.groupId,
      workerName: schema.workers.name,
      company: schema.workers.company,
      metadata: schema.attendanceLogs.metadata,
    })
    .from(schema.attendanceLogs)
    .leftJoin(schema.workers, eq(schema.attendanceLogs.workerId, schema.workers.id))
    .where(gte(schema.attendanceLogs.timestamp, todayStart))
    .orderBy(desc(schema.attendanceLogs.timestamp));

    // Send text summary
    const message = `📊 *Daily Summary* (${todayStart.toLocaleDateString()})\n\n` +
      `✅ Logged: ${confirmedCount}\n` +
      `❓ Unknown: ${pendingCount}\n\n` +
      (pendingCount > 0 ? `Reply "Review" to identify unknown faces.` : `All faces identified today!`);

    await this.wahaClient.sendText(session, adminPhone, message);

    // Generate and send CSV if there are logs
    if (dailyLogs.length > 0) {
      const csvLogs: DailyLogEntry[] = dailyLogs.map(log => ({
        id: log.id,
        timestamp: log.timestamp,
        status: log.status,
        workerName: log.workerName,
        company: log.company,
        groupId: log.groupId,
        confidence: (log.metadata as { distance?: number })?.distance ?? null,
      }));

      const csvContent = generateAttendanceCsv(csvLogs, todayStart);
      const csvBuffer = Buffer.from(csvContent, 'utf-8');
      const filename = `attendance_${todayStart.toISOString().split('T')[0]}.csv`;

      await this.wahaClient.sendFile(session, adminPhone, csvBuffer, filename, 'text/csv', '📎 Daily attendance report');
    }

    this.logger.log(`Evening review sent: ${confirmedCount} confirmed, ${pendingCount} pending`);
  }

  /**
   * Generates CSV report for a specific date range.
   * @returns { buffer, filename, count } or null if no logs found
   */
  async generateCsvForRange(start: Date, end: Date, label: string): Promise<{ buffer: Buffer; filename: string; count: number } | null> {
    const logs = await this.db.select({
      id: schema.attendanceLogs.id,
      timestamp: schema.attendanceLogs.timestamp,
      status: schema.attendanceLogs.status,
      groupId: schema.attendanceLogs.groupId,
      workerName: schema.workers.name,
      company: schema.workers.company,
      metadata: schema.attendanceLogs.metadata,
    })
    .from(schema.attendanceLogs)
    .leftJoin(schema.workers, eq(schema.attendanceLogs.workerId, schema.workers.id))
    .where(and(
      gte(schema.attendanceLogs.timestamp, start),
      lte(schema.attendanceLogs.timestamp, end)
    ))
    .orderBy(desc(schema.attendanceLogs.timestamp));

    if (logs.length === 0) return null;

    const csvLogs: DailyLogEntry[] = logs.map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      status: log.status,
      workerName: log.workerName,
      company: log.company,
      groupId: log.groupId,
      confidence: (log.metadata as { distance?: number })?.distance ?? null,
    }));

    const csvContent = generateAttendanceCsv(csvLogs, start);
    const safeLabel = label.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `attendance_${safeLabel}.csv`;

    return {
      buffer: Buffer.from(csvContent, 'utf-8'),
      filename,
      count: logs.length,
    };
  }
}
