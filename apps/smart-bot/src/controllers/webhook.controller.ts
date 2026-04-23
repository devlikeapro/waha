import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { HmacGuard } from '../guards/hmac.guard';
import { IdempotencyGuard } from '../guards/idempotency.guard';
import { WAHAWebhook } from '@waha/shared';
import { WahaClientService } from '../services/waha-client.service';
import { DocumentService } from '../services/document.service';
import { FaceRecognitionService, sanitizeName } from '../services/face-recognition.service';
import { StorageService } from '../services/storage.service';
import { AiService } from '../services/ai.service';
import { TwoFactorService } from '../services/auth/two-factor.service';
import { EveningReviewService, parseMonthInput } from '../services/evening-review.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly wahaClient: WahaClientService,
    private readonly documentService: DocumentService,
    private readonly faceRecognitionService: FaceRecognitionService,
    private readonly storageService: StorageService,
    private readonly aiService: AiService,
    private readonly twoFactorService: TwoFactorService,
    private readonly eveningReviewService: EveningReviewService,
    @InjectQueue('faces') private readonly facesQueue: Queue,
  ) {}

  @Post()
  @UseGuards(HmacGuard, IdempotencyGuard)
  async handleWebhook(@Body() webhook: WAHAWebhook) {
    this.logger.log(`Received webhook event: ${webhook.event} [${webhook.id}]`);
    
    if (webhook.event === 'message.poll.vote') {
        // ... (poll logic remains same)
        // Try Document Polls first
        const docStatus = await this.documentService.processPollWebhook(webhook.payload);
        if (docStatus) {
            await this.wahaClient.sendText(webhook.session, webhook.payload.from || webhook.payload.sender, `Updated status to: ${docStatus}`);
            return { status: 'ok' };
        }

        const pollId = webhook.payload.pollMessage?.key?.id || webhook.payload.waMessageId;
        const selectedOptions = webhook.payload.vote?.selectedOptions || [];
        const vote = selectedOptions.length > 0 ? selectedOptions[0].name : null;

        if (pollId && vote) {
             const faceResult = await this.faceRecognitionService.processPollVote(pollId, vote);
             if (faceResult) {
                 await this.wahaClient.sendText(webhook.session, webhook.payload.from || webhook.payload.sender, faceResult);
             }
        }
        
        return { status: 'ok' };
    }

    if (webhook.event === 'message') {
        const payload = webhook.payload;
        if (payload.fromMe) return { status: 'ok' };

        // 0. Handle Commands (Admin & Access)
        const body = payload.body || '';

        // User: Request Access
        if (body.startsWith('/access request')) {
            const email = body.split(' ')[2];
            if (email) {
                await this.twoFactorService.requestAccess(payload.from, email, webhook.session);
                await this.wahaClient.sendText(webhook.session, payload.from, `⏳ Access requested for ${email}. Please wait for admin approval.`);
            } else {
                await this.wahaClient.sendText(webhook.session, payload.from, 'Usage: /access request <email>');
            }
            return { status: 'ok' };
        }
        
        // Admin: Approve User
        if (body.startsWith('/admin approve')) {
             if (!this.twoFactorService.isAdmin(payload.from)) {
                 await this.wahaClient.sendText(webhook.session, payload.from, '⛔ Admin access required.');
                 return { status: 'ok' };
             }

             const targetPhone = body.split(' ')[2]; // Format: 123456789 or 123456789@s.whatsapp.net
             if (targetPhone) {
                 const targetId = targetPhone.includes('@') ? targetPhone : `${targetPhone}@s.whatsapp.net`;
                 await this.twoFactorService.approveUser(targetId);
                 await this.wahaClient.sendText(webhook.session, payload.from, `✅ User ${targetId} approved.`);
                 await this.wahaClient.sendText(webhook.session, targetId, '🎉 Your access has been approved!');
             } else {
                 await this.wahaClient.sendText(webhook.session, payload.from, 'Usage: /admin approve <phone_number>');
             }
             return { status: 'ok' };
        }

        // CSV Export: /csv <month>
        if (body.startsWith('/csv')) {
            if (!this.twoFactorService.isAdmin(payload.from)) {
                await this.wahaClient.sendText(webhook.session, payload.from, '⛔ Admin access required.');
                return { status: 'ok' };
            }

            const args = body.substring(4).trim();
            // Validate input length and characters
            if (!args || args.length > 20 || !/^[\w\s-]+$/.test(args)) {
                await this.wahaClient.sendText(webhook.session, payload.from, 
                    'Usage: /csv <month>\nExamples: /csv January, /csv Feb, /csv 2026-01');
                return { status: 'ok' };
            }

            const dateRange = parseMonthInput(args);
            if (!dateRange) {
                await this.wahaClient.sendText(webhook.session, payload.from, 
                    '⚠️ Invalid month. Use: January, Jan, 1, or 2026-01');
                return { status: 'ok' };
            }

            await this.wahaClient.sendText(webhook.session, payload.from, `⏳ Generating report for ${dateRange.label}...`);

            try {
                const result = await this.eveningReviewService.generateCsvForRange(
                    dateRange.start, dateRange.end, dateRange.label
                );

                if (!result) {
                    await this.wahaClient.sendText(webhook.session, payload.from, 
                        `📭 No attendance records found for ${dateRange.label}.`);
                    return { status: 'ok' };
                }

                await this.wahaClient.sendFile(
                    webhook.session, payload.from, result.buffer, result.filename, 'text/csv',
                    `📊 ${dateRange.label}: ${result.count} records`
                );
            } catch (e) {
                this.logger.error('Failed to generate CSV report', e);
                await this.wahaClient.sendText(webhook.session, payload.from, 
                    '❌ Failed to generate report. Please try again.');
            }
            return { status: 'ok' };
        }

        // Vision: Register Worker
        if (body.startsWith('/register')) {
            const args = body.substring(9).trim();
            if (!args) {
                await this.wahaClient.sendText(webhook.session, payload.from, 'Usage: /register <Name> [@ Company]');
                return { status: 'ok' };
            }

            let name = args;
            let company: string | null = null;
            if (args.includes('@')) {
                const parts = args.split('@');
                name = parts[0].trim();
                company = parts[1].trim();
            }

            // Sanitize inputs (also truncates to max length)
            name = sanitizeName(name);
            company = company ? sanitizeName(company) : null;

            if (!name) {
                await this.wahaClient.sendText(webhook.session, payload.from, '⚠️ Invalid name');
                return { status: 'ok' };
            }

            const result = await this.faceRecognitionService.registerWorker(name, company, payload.from);
            await this.wahaClient.sendText(webhook.session, payload.from, result);
            return { status: 'ok' };
        }

        // Correction: /correct
        if (body.startsWith('/correct')) {
            const args = body.substring(8).trim();
            if (!args) {
                await this.wahaClient.sendText(webhook.session, payload.from, 'Usage: /correct [Wrong Name] to [Right Name]');
                return { status: 'ok' };
            }
            const splitRegex = /\s+(?:to|is)\s+/i;
            const parts = args.split(splitRegex);
            let wrongName: string | undefined;
            let correctName: string;

            if (parts.length >= 2) {
                wrongName = sanitizeName(parts[0].trim());
                correctName = sanitizeName(parts[1].trim());
            } else {
                correctName = sanitizeName(args.trim());
            }

            if (!correctName) {
                await this.wahaClient.sendText(webhook.session, payload.from, '⚠️ Invalid name');
                return { status: 'ok' };
            }

            const result = await this.faceRecognitionService.correctLog(payload.from, correctName, wrongName);
            await this.wahaClient.sendText(webhook.session, payload.from, result);
            return { status: 'ok' };
        }

        // 1. Auth Gatekeeper
        const isVerified = await this.twoFactorService.isVerified(payload.from);
        if (!isVerified) {
            await this.wahaClient.sendText(
                webhook.session, 
                payload.from, 
                '🔒 Access Denied.\nPlease request access using:\n/access request <your-email>'
            );
            return { status: 'ok' };
        }

        // 2. Handle Media
        const mediaUrl = payload.media?.url || payload.body?.url;
        
        if (payload.hasMedia && mediaUrl) {
            this.logger.log(`Found media: ${mediaUrl}`);
            try {
                const mimeType = payload.media?.mimetype || 'application/octet-stream';
                const filename = payload.media?.filename || 'unknown_file';
                const buffer = await this.wahaClient.downloadFile(mediaUrl);

                // A. Handle Images (Face Recognition)
                if (mimeType.startsWith('image/')) {
                     // Security: Size Limit (10MB)
                     const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
                     if (buffer.length > MAX_IMAGE_SIZE) {
                         await this.wahaClient.sendText(webhook.session, payload.from, '⚠️ Image too large (Max 10MB).');
                         return { status: 'ok' };
                     }

                     // Offload to Queue
                     const s3Key = await this.storageService.upload(buffer, filename, mimeType);

                     await this.facesQueue.add('process', {
                         s3Key, 
                         session: webhook.session,
                         chatId: payload.from
                     });
                     
                     await this.wahaClient.sendText(webhook.session, payload.from, '🤖 Processing photo...');
                     return { status: 'ok' };
                }

                // B. Handle PDFs
                if (mimeType === 'application/pdf') {
                    await this.documentService.processFile(
                        buffer,
                        filename,
                        mimeType,
                        webhook.session,
                        payload.from
                    );
                    await this.wahaClient.sendText(webhook.session, payload.from, '📄 Document indexed! You can now ask questions about it.');
                    return { status: 'ok' };
                }
                
                return { status: 'ok' };

            } catch (e) {
                this.logger.error('Failed to process media', e);
                await this.wahaClient.sendText(webhook.session, payload.from, '❌ Failed to process media.');
                return { status: 'error' };
            }
        }

        // 2. Handle Text (RAG)
        if (payload.body) {
             const query = payload.body;
             const context = await this.documentService.findRelevantContext(query);
             
             if (context) {
                 const answer = await this.aiService.answerQuestion(context, query);
                 await this.wahaClient.sendText(webhook.session, payload.from, answer);
             } else {
                 await this.wahaClient.sendText(webhook.session, payload.from, `Echo: ${query}`);
             }
        }
    }

    return { status: 'ok' };
  }
}
