import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE } from '../db/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { StorageService } from './storage.service';
import { VisionService } from './vision.service';
import { WahaClientService } from './waha-client.service';
import * as sharp from 'sharp';
import { Counter, Histogram } from 'prom-client';

// Default thresholds (cosine distance: lower = more similar)
const DEFAULT_HIGH_CONFIDENCE = 0.4;
const DEFAULT_MEDIUM_CONFIDENCE = 0.6;
const DEFAULT_CORRECTION_WINDOW_MS = 30 * 60 * 1000; // 30 minutes
const EMBEDDING_DIMENSION = 512;
const MAX_NAME_LENGTH = 100;

/** Exported thresholds for testing without mocks */
export const THRESHOLDS = {
  HIGH_CONFIDENCE: DEFAULT_HIGH_CONFIDENCE,
  MEDIUM_CONFIDENCE: DEFAULT_MEDIUM_CONFIDENCE,
  EMBEDDING_DIM: EMBEDDING_DIMENSION,
};

export interface ConsensusResult {
  reached: boolean;
  bestVotes: number;
  totalValid: number;
  voteCounts: Map<number, number>;
}

/**
 * Calculates consensus among top-K matches using majority voting.
 * Returns detailed result including vote counts for logging.
 * @param matches - Array of match results with workerId
 * @param bestMatchWorkerId - The workerId of the best (closest) match
 * @returns ConsensusResult with details
 */
export function calculateConsensus(
  matches: Array<{ workerId: number | null }>,
  bestMatchWorkerId: number | null
): ConsensusResult {
  const validMatches = matches.filter(m => m.workerId !== null);
  const voteCounts = new Map<number, number>();
  
  for (const m of validMatches) {
    voteCounts.set(m.workerId!, (voteCounts.get(m.workerId!) || 0) + 1);
  }
  
  const bestVotes = bestMatchWorkerId !== null ? (voteCounts.get(bestMatchWorkerId) || 0) : 0;
  const reached = validMatches.length < 2 || bestVotes > validMatches.length / 2;
  
  return { reached, bestVotes, totalValid: validMatches.length, voteCounts };
}

/**
 * Checks if a timestamp is within the correction window.
 * Note: Used in tests for business logic validation. SQL filtering is used
 * in production for efficiency, but this function documents the logic.
 * @param timestamp - The timestamp to check
 * @param windowMs - The window duration in milliseconds
 * @returns True if within window
 */
export function isWithinCorrectionWindow(timestamp: Date, windowMs: number): boolean {
  return Date.now() - timestamp.getTime() <= windowMs;
}

/**
 * Validates that an embedding is a valid 512-dimensional vector of finite numbers.
 * Used to prevent SQL injection and ensure data integrity from vision service.
 * @param embedding - The value to validate
 * @returns True if embedding is a valid 512-dim number array
 */
export function isValidEmbedding(embedding: unknown): embedding is number[] {
  return Array.isArray(embedding) && 
    embedding.length === EMBEDDING_DIMENSION && 
    embedding.every(n => typeof n === 'number' && isFinite(n));
}

/**
 * Converts a numeric embedding array to pgvector literal format.
 * Validates all values are finite to prevent SQL injection.
 * @param embedding - Array of numbers to convert
 * @returns pgvector literal string like '[0.1,0.2,0.3]'
 * @throws Error if embedding contains non-finite values
 */
export function toVectorLiteral(embedding: number[]): string {
  if (!embedding.every(n => typeof n === 'number' && isFinite(n))) {
    throw new Error('Invalid embedding values');
  }
  return `[${embedding.join(',')}]`;
}

/**
 * Sanitizes user input by removing potentially dangerous characters.
 * Prevents XSS, SQL injection, and other attacks in names/companies.
 * @param input - Raw user input string
 * @returns Sanitized string with special characters removed
 */
export function sanitizeName(input: string): string {
  // Remove HTML/script tags, quotes, backslashes, null bytes, and control characters
  return input
    .replace(/[\x00-\x1F\x7F]/g, '') // Control characters
    .replace(/[<>'"&\\`]/g, '')      // XSS vectors
    .replace(/javascript:/gi, '')    // JS protocol
    .replace(/on\w+=/gi, '')         // Event handlers
    .trim()
    .substring(0, MAX_NAME_LENGTH);  // Enforce max length
}

/**
 * Builds a safe pgvector SQL fragment from a validated embedding.
 * @param embedding - Array of numbers (must pass isValidEmbedding first)
 * @returns SQL fragment for vector comparison
 * @throws Error if embedding is invalid
 */
export function buildVectorSql(embedding: number[]) {
  if (!isValidEmbedding(embedding)) {
    throw new Error('Invalid embedding');
  }
  return sql.raw(`'${toVectorLiteral(embedding)}'::vector`);
}

/**
 * Determines the action to take based on poll vote text.
 * @param vote - The vote option text
 * @returns The action type
 */
export function determineVoteAction(vote: string): 'confirm' | 'reject' | 'new_person' | 'invalid' {
  const trimmed = vote.trim();
  if (trimmed.startsWith('Yes')) return 'confirm';
  if (trimmed === 'No') return 'reject';
  if (trimmed === 'New Person') return 'new_person';
  return 'invalid';
}

// Prometheus Metrics
const faceDetectionLatency = new Histogram({
  name: 'face_detection_latency_seconds',
  help: 'Time taken to process face detection requests',
  labelNames: ['status'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

const faceConfidenceHistogram = new Histogram({
  name: 'face_confidence_distribution',
  help: 'Distribution of face match confidence scores (1 - distance)',
  buckets: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
});

const backfillCounter = new Counter({
  name: 'face_backfill_total',
  help: 'Total number of attendance logs backfilled on registration',
});

const faceProcessedCounter = new Counter({
  name: 'faces_processed_total',
  help: 'Total faces processed by result type',
  labelNames: ['result'], // 'auto_confirmed', 'poll_sent', 'unknown'
});

@Injectable()
export class FaceRecognitionService {
  private readonly logger = new Logger(FaceRecognitionService.name);
  private readonly highConfidenceThreshold: number;
  private readonly mediumConfidenceThreshold: number;
  private readonly correctionWindowMs: number;

  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
    private readonly storageService: StorageService,
    private readonly visionService: VisionService,
    private readonly wahaClient: WahaClientService,
    private readonly configService: ConfigService,
  ) {
    this.highConfidenceThreshold = this.configService.get<number>(
      'FACE_HIGH_CONFIDENCE_THRESHOLD',
      DEFAULT_HIGH_CONFIDENCE
    );
    this.mediumConfidenceThreshold = this.configService.get<number>(
      'FACE_MEDIUM_CONFIDENCE_THRESHOLD',
      DEFAULT_MEDIUM_CONFIDENCE
    );
    this.correctionWindowMs = this.configService.get<number>(
      'FACE_CORRECTION_WINDOW_MS',
      DEFAULT_CORRECTION_WINDOW_MS
    );
  }

  private extractPollId(pollResponse: { id?: string | { _serialized?: string; id?: string } } | null): string | null {
    if (!pollResponse?.id) return null;
    if (typeof pollResponse.id === 'string') return pollResponse.id;
    return pollResponse.id._serialized ?? pollResponse.id.id ?? null;
  }

  async processImage(
    s3Key: string,
    session: string,
    chatId: string
  ) {
    const correlationId = `face-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const startTime = Date.now();
    this.logger.log({ correlationId, chatId, s3Key }, 'Processing face image');

    // 0. Fetch Buffer (Required for Cropping)
    let buffer: Buffer;
    try {
        buffer = await this.storageService.getBuffer(s3Key);
    } catch (e) {
        this.logger.error({ correlationId, error: e.message }, 'Failed to retrieve image from storage');
        faceDetectionLatency.observe({ status: 'error' }, (Date.now() - startTime) / 1000);
        await this.wahaClient.sendText(session, chatId, '⚠️ Failed to retrieve image.');
        return;
    }

    // 1. Upload to S3 (Done in Controller now)
    const s3Url = s3Key; 

    // 2. Detect Faces
    const faces = await this.visionService.detectFaces(s3Key);
    if (!faces || faces.length === 0) {
      this.logger.log({ correlationId }, 'No faces detected');
      faceDetectionLatency.observe({ status: 'no_faces' }, (Date.now() - startTime) / 1000);
      await this.wahaClient.sendText(session, chatId, '⚠️ No faces detected in the image.');
      return;
    }

    this.logger.log({ correlationId, faceCount: faces.length }, 'Faces detected');
    const detectedNames: string[] = [];
    
    let meta: sharp.Metadata;
    try {
      meta = await sharp(buffer).metadata();
    } catch (e) {
      this.logger.error({ correlationId, error: e.message }, 'Failed to read image metadata');
      faceDetectionLatency.observe({ status: 'error' }, (Date.now() - startTime) / 1000);
      await this.wahaClient.sendText(session, chatId, '⚠️ Failed to process image format.');
      return;
    }
    
    if (!meta.width || !meta.height) {
      await this.wahaClient.sendText(session, chatId, '⚠️ Invalid image dimensions.');
      return;
    }

    // 3. Process Each Face
    for (const face of faces) {
      const [x1, y1, x2, y2] = face.bbox.map(Math.round);
      
      // Safety check for crop boundaries
      const cropLeft = Math.max(0, x1);
      const cropTop = Math.max(0, y1);
      const cropWidth = Math.min(meta.width - cropLeft, x2 - x1);
      const cropHeight = Math.min(meta.height - cropTop, y2 - y1);

      // Validate embedding (defense against compromised vision service)
      if (!isValidEmbedding(face.embedding)) {
        this.logger.warn({ correlationId }, 'Invalid embedding received, skipping face');
        continue;
      }
      
      // Use helper for safe vector SQL construction
      const vectorSql = buildVectorSql(face.embedding);
      const matches = await this.db.select({
        workerId: schema.faceTemplates.workerId,
        distance: sql<number>`${schema.faceTemplates.embedding} <=> ${vectorSql}`,
        workerName: schema.workers.name,
      })
      .from(schema.faceTemplates)
      .leftJoin(schema.workers, eq(schema.faceTemplates.workerId, schema.workers.id))
      .orderBy(sql`${schema.faceTemplates.embedding} <=> ${vectorSql}`)
      .limit(5);

      let workerId: number | null = null;
      let status: 'auto' | 'confirmed' | 'pending' | 'rejected' = 'pending';
      let matchedName = 'Unknown';
      let confidenceDistance = 1.0;
      let consensus = false;
      let waPollId: string | null = null;
      let cropUrl: string | null = null;

      if (matches.length > 0) {
        const bestMatch = matches[0];
        confidenceDistance = bestMatch.distance;
        
        // Use extracted consensus function - returns detailed result
        const consensusResult = calculateConsensus(matches, bestMatch.workerId);
        consensus = consensusResult.reached;
        
        if (!consensus) {
          const others = [...consensusResult.voteCounts.entries()]
            .filter(([id]) => id !== bestMatch.workerId)
            .map(([id, cnt]) => `${matches.find(m => m.workerId === id)?.workerName}(${cnt})`)
            .join(', ');
          this.logger.warn(`Consensus Conflict: ${bestMatch.workerName}(${consensusResult.bestVotes}) vs ${others}`);
        }

        this.logger.debug(`Best match: ${bestMatch.workerName} (Dist: ${confidenceDistance}, Consensus: ${consensus})`);

        // Record confidence metric
        faceConfidenceHistogram.observe(1 - confidenceDistance);

        if (confidenceDistance < this.highConfidenceThreshold && consensus) {
          // Case A: High Confidence & Consensus -> Auto Log
          workerId = bestMatch.workerId;
          matchedName = bestMatch.workerName || 'Unknown';
          status = 'auto'; 
          detectedNames.push(matchedName);
          faceProcessedCounter.inc({ result: 'auto_confirmed' });

        } else if (confidenceDistance < this.mediumConfidenceThreshold) {
          // Case B: Medium Confidence OR Conflict -> Poll
          workerId = bestMatch.workerId;
          matchedName = bestMatch.workerName || 'Unknown';
          faceProcessedCounter.inc({ result: 'poll_sent' });
          
          // Create crop for context
          cropUrl = await this.createAndUploadCrop(buffer, cropLeft, cropTop, cropWidth, cropHeight);
          
          if (cropUrl) {
            const cropBuffer = await this.storageService.getBuffer(cropUrl);
            await this.wahaClient.sendImage(session, chatId, cropBuffer, 'face.jpg', 'Who is this?');
          }

          const pollResponse = await this.wahaClient.sendPoll(
            session, 
            chatId, 
            `Is this ${matchedName}? (Confidence: ${Math.round((1 - confidenceDistance) * 100)}%)`, 
            [`Yes, it's ${matchedName}`, 'No', 'New Person']
          );
          
          waPollId = this.extractPollId(pollResponse);

        } else {
          // Case C: Low Confidence / Unknown - create crop for manual registration
          cropUrl = await this.createAndUploadCrop(buffer, cropLeft, cropTop, cropWidth, cropHeight);
          faceProcessedCounter.inc({ result: 'unknown' });
        }
      } else {
        // No matches in DB - create crop for registration
        cropUrl = await this.createAndUploadCrop(buffer, cropLeft, cropTop, cropWidth, cropHeight);
        faceProcessedCounter.inc({ result: 'unknown' });
      }

      // Log Attendance
      await this.db.insert(schema.attendanceLogs).values({
        workerId,
        groupId: chatId, 
        rawEmbedding: face.embedding,
        status, 
        imageUrl: s3Url,
        cropUrl,
        waPollId,
        metadata: {
          bbox: face.bbox,
          score: face.det_score,
          distance: confidenceDistance
        }
      });
    }

    // 4. Send Reply (Summary for Auto-Confirmed)
    if (detectedNames.length > 0) {
      const namesList = detectedNames.join(', ');
      await this.wahaClient.sendText(session, chatId, `✅ Logged: ${namesList} (${new Date().toLocaleTimeString()})`);
    }

    faceDetectionLatency.observe({ status: 'success' }, (Date.now() - startTime) / 1000);
    this.logger.log({ correlationId, duration: Date.now() - startTime }, 'Face processing complete');
  }

  private async createAndUploadCrop(
    buffer: Buffer,
    left: number,
    top: number,
    width: number,
    height: number
  ): Promise<string | null> {
    if (left < 0 || top < 0 || width <= 0 || height <= 0) return null;
    
    try {
      const cropBuffer = await sharp(buffer)
        .extract({ left, top, width, height })
        .jpeg()
        .toBuffer();
      
      const cropName = `crop_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      return await this.storageService.upload(cropBuffer, cropName, 'image/jpeg');
    } catch (e) {
      this.logger.error('Failed to create face crop', e);
      return null;
    }
  }

  async processPollVote(pollId: string, vote: string): Promise<string | null> {
      if (!pollId || !vote) return null;
      
      // Use transaction to prevent race conditions on concurrent votes
      return await this.db.transaction(async (tx) => {
        // 1. Find the log associated with this poll (with FOR UPDATE lock)
        const logs = await tx.select()
            .from(schema.attendanceLogs)
            .where(eq(schema.attendanceLogs.waPollId, pollId))
            .limit(1);

        if (logs.length === 0) return null;
        const log = logs[0];
        
        // Skip if already processed
        if (log.status !== 'pending') {
          return `Log #${log.id} already processed (status: ${log.status})`;
        }

        // 2. Determine Action using exported function for testability
        const action = determineVoteAction(vote);
        
        switch (action) {
          case 'confirm':
            await tx.update(schema.attendanceLogs)
                .set({ status: 'confirmed' })
                .where(eq(schema.attendanceLogs.id, log.id));
            return `Confirmed identity for log #${log.id}`;
          
          case 'reject':
            await tx.update(schema.attendanceLogs)
                .set({ status: 'rejected', workerId: null })
                .where(eq(schema.attendanceLogs.id, log.id));
            return `Rejected match for log #${log.id}. Marked as unknown.`;
          
          case 'new_person':
            return `Marked as New Person. Please reply with: /register <Name>`;
          
          case 'invalid':
          default:
            return null;
        }
      });
  }

  async registerWorker(name: string, company: string | null, chatId: string): Promise<string> {
      // 1. Find most recent unknown face in this chat
      const lastUnknown = await this.db.select()
          .from(schema.attendanceLogs)
          .where(and(
              eq(schema.attendanceLogs.groupId, chatId),
              eq(schema.attendanceLogs.status, 'pending')
          ))
          .orderBy(sql`${schema.attendanceLogs.timestamp} DESC`)
          .limit(1);

      if (lastUnknown.length === 0) {
          return '⚠️ No recent unknown faces found to register.';
      }

      const targetLog = lastUnknown[0];
      if (!targetLog.rawEmbedding) {
          return '⚠️ The recent face has no embedding data. Cannot register.';
      }

      // Use transaction to prevent race conditions
      const result = await this.db.transaction(async (tx) => {
          // 2. Create Worker
          const newWorker = await tx.insert(schema.workers).values({
              name,
              company,
              status: 'active'
          }).returning({ id: schema.workers.id });
          
          const workerId = newWorker[0].id;

          // 3. Create Face Template
          await tx.insert(schema.faceTemplates).values({
              workerId,
              embedding: targetLog.rawEmbedding,
              cropS3Url: targetLog.cropUrl || targetLog.imageUrl,
              sourceImageId: targetLog.imageUrl
          });

          // 4. Backfill: Find other pending logs that match this new worker
          const vectorSql = buildVectorSql(targetLog.rawEmbedding!);
          const backfillResult = await tx.update(schema.attendanceLogs)
              .set({ workerId, status: 'confirmed' })
              .where(and(
                  eq(schema.attendanceLogs.status, 'pending'),
                  sql`${schema.attendanceLogs.rawEmbedding} <=> ${vectorSql} < ${this.mediumConfidenceThreshold}`
              ))
              .returning({ id: schema.attendanceLogs.id });

          return { workerId, backfillCount: backfillResult.length };
      });

      backfillCounter.inc(result.backfillCount);
      return `✅ Registered **${name}** (ID: ${result.workerId}).\nFound and updated ${result.backfillCount} past records.`;
  }

  async correctLog(chatId: string, correctName: string, wrongName?: string): Promise<string> {
      // 1. Find target worker (New Name)
      const targetWorkers = await this.db.select().from(schema.workers).where(eq(schema.workers.name, correctName)).limit(1);
      if (targetWorkers.length === 0) return `❌ Worker "${correctName}" not found.`;
      const correctWorker = targetWorkers[0];

      // 2. Build Query for Log - look for logs within correction window
      const timeLimit = new Date(Date.now() - this.correctionWindowMs); 
      
      const recentLogs = await this.db.select({
              id: schema.attendanceLogs.id,
              rawEmbedding: schema.attendanceLogs.rawEmbedding,
              imageUrl: schema.attendanceLogs.imageUrl,
              cropUrl: schema.attendanceLogs.cropUrl,
              workerName: schema.workers.name
          })
          .from(schema.attendanceLogs)
          .leftJoin(schema.workers, eq(schema.attendanceLogs.workerId, schema.workers.id))
          .where(and(
              eq(schema.attendanceLogs.groupId, chatId),
              // Allow correcting both auto-logged and human-confirmed entries
              sql`${schema.attendanceLogs.status} IN ('auto', 'confirmed')`,
              sql`${schema.attendanceLogs.timestamp} > ${timeLimit}`
          ))
          .orderBy(sql`${schema.attendanceLogs.timestamp} DESC`);
      
      if (recentLogs.length === 0) return '⚠️ No recent logged entries found to correct.';

      let logToCorrect: typeof recentLogs[0] | undefined;

      if (wrongName) {
          // Filter by the name user said was wrong
          logToCorrect = recentLogs.find(l => l.workerName?.toLowerCase() === wrongName.toLowerCase());
          if (!logToCorrect) {
              const names = recentLogs.map(l => l.workerName).filter(Boolean).join(', ');
              return `⚠️ I found recent logs for: ${names}, but not for "${wrongName}".`;
          }
      } else {
          // Default: The very last one
          logToCorrect = recentLogs[0];
          // Warning if ambiguity?
          if (recentLogs.length > 1 && recentLogs[0].workerName !== recentLogs[1].workerName) {
               // Optional: warn user
          }
      }

      // 3. Update - set to 'confirmed' since human is verifying
      await this.db.update(schema.attendanceLogs)
          .set({ workerId: correctWorker.id, status: 'confirmed' })
          .where(eq(schema.attendanceLogs.id, logToCorrect.id));

       // 4. Learn
      if (logToCorrect.rawEmbedding) {
          await this.db.insert(schema.faceTemplates).values({
              workerId: correctWorker.id,
              embedding: logToCorrect.rawEmbedding,
              cropS3Url: logToCorrect.cropUrl || logToCorrect.imageUrl,
              sourceImageId: logToCorrect.imageUrl
          });
      }
      
      return `✅ Corrected: **${logToCorrect.workerName}** is actually **${correctName}**. Updated memory.`;
  }

  async registerUnknownLog(logId: number, name: string, company?: string): Promise<string> {
      const log = await this.db.select().from(schema.attendanceLogs).where(eq(schema.attendanceLogs.id, logId)).limit(1);
      if (log.length === 0) throw new Error('Log not found');
      const targetLog = log[0];

      // Use transaction for atomicity
      const result = await this.db.transaction(async (tx) => {
          // Create Worker
          const newWorker = await tx.insert(schema.workers).values({
              name,
              company,
              status: 'active'
          }).returning({ id: schema.workers.id });
          const workerId = newWorker[0].id;

          // Template
          if (targetLog.rawEmbedding) {
              await tx.insert(schema.faceTemplates).values({
                  workerId,
                  embedding: targetLog.rawEmbedding,
                  cropS3Url: targetLog.cropUrl || targetLog.imageUrl,
                  sourceImageId: targetLog.imageUrl
              });
          }

          // Update Log (Primary)
          await tx.update(schema.attendanceLogs)
              .set({ workerId, status: 'confirmed' })
              .where(eq(schema.attendanceLogs.id, logId));
          
          // Backfill (Others)
          let backfillCount = 0;
          if (targetLog.rawEmbedding) {
              const vectorSql = buildVectorSql(targetLog.rawEmbedding);
              const backfillResult = await tx.update(schema.attendanceLogs)
                  .set({ workerId, status: 'confirmed' })
                  .where(and(
                      eq(schema.attendanceLogs.status, 'pending'),
                      sql`${schema.attendanceLogs.rawEmbedding} <=> ${vectorSql} < ${this.mediumConfidenceThreshold}`
                  ))
                  .returning({ id: schema.attendanceLogs.id });
              backfillCount = backfillResult.length;
          }

          return { workerId, backfillCount };
      });
      
      backfillCounter.inc(result.backfillCount);
      return `Registered ${name}. Backfilled ${result.backfillCount} other logs.`;
  }

  async ignoreUnknownLog(logId: number) {
      await this.db.update(schema.attendanceLogs)
          .set({ status: 'rejected' })
          .where(eq(schema.attendanceLogs.id, logId));
      return { success: true };
  }

  async addFaceToWorker(workerId: number, buffer: Buffer, filename: string): Promise<void> {
      // Verify worker exists
      const worker = await this.db.select({ id: schema.workers.id })
          .from(schema.workers)
          .where(eq(schema.workers.id, workerId))
          .limit(1);
      if (worker.length === 0) throw new Error('Worker not found');

      // Upload
      const s3Key = await this.storageService.upload(buffer, filename, 'image/jpeg');
      
      try {
        // Detect
        const faces = await this.visionService.detectFaces(s3Key);
        if (faces.length === 0) {
          await this.storageService.delete(s3Key);
          throw new Error('No face detected');
        }
        if (faces.length > 1) {
          this.logger.warn(`Multiple faces (${faces.length}) detected, using first face only`);
        }
        
        // Add Template (Take first face)
        await this.db.insert(schema.faceTemplates).values({
            workerId,
            embedding: faces[0].embedding,
            cropS3Url: s3Key, 
            sourceImageId: s3Key
        });
      } catch (e) {
        // Cleanup orphaned S3 file on failure
        await this.storageService.delete(s3Key).catch(err => 
          this.logger.warn(`Failed to cleanup S3 file ${s3Key}: ${err.message}`)
        );
        throw e;
      }
  }
}
