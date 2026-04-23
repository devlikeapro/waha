import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger, Inject } from '@nestjs/common';
import { AiService } from '../services/ai.service';
import { DRIZZLE } from '../db/database.module';
import { documents, documentChunks, extractedData } from '../db/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { DeliveryOrderSchema } from '../schemas/delivery-order';
import { sql } from 'drizzle-orm';
import { WahaClientService } from '../services/waha-client.service';
import { StorageService } from '../services/storage.service';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdf = require('pdf-parse');

@Processor('documents')
export class DocumentProcessor extends WorkerHost {
  private readonly logger = new Logger(DocumentProcessor.name);

  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
    private aiService: AiService,
    private wahaClient: WahaClientService,
    private storageService: StorageService,
    @InjectMetric('waha_docs_processed_total') public docCounter: Counter<string>,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { docId, storageKey, mimeType, sessionId, chatId } = job.data;
    this.logger.log(`Processing job ${job.id} for doc ${docId} (Key: ${storageKey})`);

    // Download from S3 (Robustness: Works even if pod restarted)
    const buffer = await this.storageService.getBuffer(storageKey);

    try {
        if (mimeType === 'application/pdf') {
          await this.processPdf(docId, buffer);
          await this.wahaClient.sendText(sessionId, chatId, '✅ PDF indexed for search.');
        } else if (mimeType.startsWith('image/')) {
          const result = await this.processImage(docId, buffer);
          
          if (result.status === 'pending_review') {
              const poll = await this.wahaClient.sendPoll(
                  sessionId, 
                  chatId, 
                  `⚠️ Low Confidence (${result.data.confidence * 100}%). Is this correct?\nTotal: ${result.data.line_items?.reduce((acc, item) => acc + (item.total || 0), 0)}`,
                  ['Confirm ✅', 'Reject ❌']
              );
              
              if (poll && poll.id) {
                  // Update DB with Poll Message ID so we can match the vote later
                  await this.db.update(extractedData)
                      .set({ waMessageId: poll.id })
                      .where(sql`${extractedData.id} = ${result.record.id}`);
              }
          } else {
              await this.wahaClient.sendText(sessionId, chatId, '✅ Document extracted and approved automatically.');
          }
        }
        
        // Metric Increment
        this.docCounter.inc({ type: mimeType });
        
    } catch (error) {
        this.logger.error(`Job ${job.id} failed`, error);
        await this.wahaClient.sendText(sessionId, chatId, '❌ Failed to process document.');
        throw error;
    }
  }

  private async processImage(docId: number, buffer: Buffer) {
      this.logger.log(`Extracting data from image for doc ${docId}`);
      
      const data = await this.aiService.extractStructure(
          "Extract delivery order details from this image.",
          DeliveryOrderSchema,
          buffer
      );

      const confidence = Math.round((data.confidence || 0) * 100);
      const isLowConfidence = confidence < 80;
      const status = isLowConfidence ? 'pending_review' : 'confirmed';

      // 1. Save to DB
      const [record] = await this.db.insert(extractedData).values({
          documentId: docId,
          type: 'delivery_order',
          data: data,
          confidence: confidence.toString(),
          status,
      }).returning();

      // 2. HITL Flow
      // We need to pass the 'sessionId' and 'chatId' to this method, or store them in the job context
      // Assuming we have access to them via job (passed in process method, I need to pass them down)
      // For now, returning the record and status so the 'process' method can handle the message sending.
      return { record, status, data };
  }

  private async processPdf(docId: number, buffer: Buffer) {
    const data = await pdf(buffer);
    const text = data.text;
    
    // Chunking
    const chunks = this.splitText(text, 1000); 

    // Embed & Save
    for (const chunk of chunks) {
      const embedding = await this.aiService.getEmbedding(chunk);
      await this.db.insert(documentChunks).values({
        documentId: docId,
        content: chunk,
        embedding,
      });
    }
    this.logger.log(`Indexed ${chunks.length} chunks for doc ${docId}`);
  }

  private splitText(text: string, chunkSize: number): string[] {
    const separators = ['\n\n', '\n', '.', '?', '!', ' ', ''];
    const chunks: string[] = [];
    let currentChunk = '';

    const splitRecursive = (textToSplit: string, separatorIndex: number) => {
        if (textToSplit.length <= chunkSize) {
            if (currentChunk.length + textToSplit.length > chunkSize) {
                if (currentChunk.trim()) chunks.push(currentChunk.trim());
                currentChunk = textToSplit;
            } else {
                currentChunk += (currentChunk ? separators[separatorIndex - 1] || '' : '') + textToSplit;
            }
            return;
        }

        if (separatorIndex >= separators.length) {
            const forcedChunks = textToSplit.match(new RegExp(`.{1,${chunkSize}}`, 'g')) || [];
            forcedChunks.forEach((c: string) => {
                 if (currentChunk.length + c.length > chunkSize) {
                    if (currentChunk.trim()) chunks.push(currentChunk.trim());
                    currentChunk = c;
                } else {
                    currentChunk += c;
                }
            });
            return;
        }

        const separator = separators[separatorIndex];
        const splits = textToSplit.split(separator);
        
        let newChunk = '';
        for (const split of splits) {
            if (newChunk.length + split.length + separator.length > chunkSize) {
                if (newChunk) splitRecursive(newChunk, separatorIndex + 1);
                newChunk = split;
            } else {
                newChunk += (newChunk ? separator : '') + split;
            }
        }
        if (newChunk) splitRecursive(newChunk, separatorIndex + 1);
    };

    splitRecursive(text, 0);
    if (currentChunk.trim()) chunks.push(currentChunk.trim());

    return chunks.filter(c => c.length > 50);
  }
}
