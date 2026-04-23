import { Inject, Injectable, Logger } from '@nestjs/common';
import { DRIZZLE } from '../db/database.module';
import { documents, documentChunks, extractedData } from '../db/schema';
import { AiService } from './ai.service';
import { eq, sql, desc } from 'drizzle-orm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { StorageService } from './storage.service';
import { REDIS_CLIENT } from '../common/redis/redis.module';
import Redis from 'ioredis';

// Type definitions for drizzle instance
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
    private aiService: AiService,
    @InjectQueue('documents') private documentsQueue: Queue,
    private storageService: StorageService,
    @Inject(REDIS_CLIENT) private redis: Redis,
  ) {}

  async processFile(
    buffer: Buffer,
    filename: string,
    mimeType: string,
    sessionId: string,
    chatId: string,
  ) {
    this.logger.log(`Uploading & Queueing file ${filename} (${mimeType})`);

    // 1. Upload to S3 (Persist immediately)
    const storageKey = await this.storageService.upload(buffer, filename, mimeType);

    // 2. Save Document Metadata
    const [doc] = await this.db
      .insert(documents)
      .values({
        filename,
        mimeType,
        sessionId,
        chatId,
      })
      .returning();

    // 3. Offload processing to Queue (Pass KEY, not Buffer)
    await this.documentsQueue.add('process', {
        docId: doc.id,
        storageKey, // Pass the S3 key
        mimeType,
        sessionId,
        chatId
    });

    return doc;
  }

  async findRelevantContext(query: string, limit = 5): Promise<string> {
      const queryEmbedding = await this.aiService.getEmbedding(query);
      const vectorString = JSON.stringify(queryEmbedding);
      
      // HYBRID SEARCH: Reciprocal Rank Fusion (RRF)
      const rrfK = 60;
      
      const results = await this.db.execute(sql`
        WITH semantic AS (
            SELECT id, content, document_id,
                   ROW_NUMBER() OVER (ORDER BY embedding <=> ${vectorString}::vector) as rank_semantic
            FROM ${documentChunks}
            ORDER BY embedding <=> ${vectorString}::vector
            LIMIT 20
        ),
        keyword AS (
            SELECT id, content, document_id,
                   ROW_NUMBER() OVER (ORDER BY ts_rank_cd(to_tsvector('english', content), plainto_tsquery('english', ${query})) DESC) as rank_keyword
            FROM ${documentChunks}
            WHERE to_tsvector('english', content) @@ plainto_tsquery('english', ${query})
            LIMIT 20
        )
        SELECT 
            COALESCE(semantic.content, keyword.content) as content,
            COALESCE(semantic.document_id, keyword.document_id) as doc_id,
            COALESCE(1.0 / (${rrfK} + semantic.rank_semantic), 0.0) +
            COALESCE(1.0 / (${rrfK} + keyword.rank_keyword), 0.0) as score
        FROM semantic
        FULL OUTER JOIN keyword ON semantic.id = keyword.id
        ORDER BY score DESC
        LIMIT ${limit};
      `);

      // @ts-ignore
      const rows = results.rows;
      
      // Logic Gate for Caching: Track hits for these documents
      if (rows.length > 0) {
          // Just track the top document for simplicity in this RAG flow
          const topDocId = rows[0].doc_id as number;
          await this.checkCacheLogic(topDocId);
      }

      // @ts-ignore
      return rows.map(r => r.content).join('\n---\n');
  }

  async checkCacheLogic(docId: number) {
      const key = `doc:hits:${docId}`;
      const now = Date.now();
      const windowSize = 3600 * 1000; // 1 hour in ms
      
      // Sliding Window Strategy
      // 1. Add current hit (Score = Timestamp)
      await this.redis.zadd(key, now, `${now}-${Math.random()}`);
      
      // 2. Remove hits older than 1 hour
      await this.redis.zremrangebyscore(key, 0, now - windowSize);
      
      // 3. Count hits in current window
      const hits = await this.redis.zcard(key);
      
      // 4. Set TTL on the key itself so it cleans up if idle
      await this.redis.expire(key, 3700); // slightly more than 1h

      if (hits >= 4) {
          this.logger.log(`[CACHE LOGIC] Document ${docId} hit ${hits} times/hr. Triggering Context Cache creation.`);
          // In real implementation: Call AiService.createContextCache(docId)
      }
  }

  async processPollWebhook(payload: any) {
      // 1. Parse the Poll Vote
      // Payload structure depends on WAHA version, assuming:
      // { vote: { selectedOptions: ['Confirm ✅'] }, parentMessage: { id: '...' } }
      const vote = payload.vote || payload; // fallback
      const selectedOption = vote.selectedOptions?.[0];
      const messageId = payload.parentMessage?.id || payload.msgId; // Poll Message ID

      if (!selectedOption || !messageId) {
          this.logger.warn('Received poll webhook but could not parse selection or ID');
          return;
      }

      // 2. Logic
      const status = selectedOption.includes('Confirm') ? 'confirmed' : 'rejected';
      
      const result = await this.db.update(extractedData)
          .set({ status })
          .where(eq(extractedData.waMessageId, messageId))
          .returning();
          
      if (result.length > 0) {
          this.logger.log(`Updated extraction status to ${status} for message ${messageId}`);
          return status;
      } else {
          this.logger.warn(`Received vote for unknown message ID: ${messageId}`);
          return null;
      }
  }
}
