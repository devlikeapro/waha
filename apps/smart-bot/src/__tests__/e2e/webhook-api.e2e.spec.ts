import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as crypto from 'crypto';
import { WebhookController } from '../../controllers/webhook.controller';
import { WahaClientService } from '../../services/waha-client.service';
import { DocumentService } from '../../services/document.service';
import { FaceRecognitionService } from '../../services/face-recognition.service';
import { StorageService } from '../../services/storage.service';
import { AiService } from '../../services/ai.service';
import { TwoFactorService } from '../../services/auth/two-factor.service';
import { EveningReviewService } from '../../services/evening-review.service';
import { HmacGuard } from '../../guards/hmac.guard';
import { IdempotencyGuard } from '../../guards/idempotency.guard';
import { getQueueToken } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

/**
 * HTTP Integration tests for Webhook endpoint.
 * Tests HMAC verification, idempotency, and request handling.
 */
describe('Webhook API (HTTP Integration)', () => {
  let app: INestApplication;
  const HMAC_SECRET = 'test-hmac-secret';
  let processedMessageIds: Set<string>;

  // Mocks
  let mockWaha: jest.Mocked<Partial<WahaClientService>>;
  let mockFaceService: jest.Mocked<Partial<FaceRecognitionService>>;
  let mockStorage: jest.Mocked<Partial<StorageService>>;
  let mockTwoFactor: jest.Mocked<Partial<TwoFactorService>>;
  let mockQueue: { add: jest.Mock };

  function signPayload(payload: object): string {
    const body = JSON.stringify(payload);
    return 'sha256=' + crypto.createHmac('sha256', HMAC_SECRET).update(body).digest('hex');
  }

  beforeAll(async () => {
    processedMessageIds = new Set();

    mockWaha = {
      sendText: jest.fn().mockResolvedValue({}),
      sendImage: jest.fn().mockResolvedValue({}),
      sendPoll: jest.fn().mockResolvedValue({}),
      downloadFile: jest.fn().mockResolvedValue(Buffer.from('image')),
    };

    mockFaceService = {
      processImage: jest.fn(),
      processPollVote: jest.fn(),
      registerWorker: jest.fn().mockResolvedValue('Registered'),
      correctLog: jest.fn().mockResolvedValue('Corrected'),
    };

    mockStorage = {
      upload: jest.fn().mockResolvedValue('key.jpg'),
    };

    mockTwoFactor = {
      isVerified: jest.fn().mockResolvedValue(true),
      isAdmin: jest.fn().mockReturnValue(false),
      requestAccess: jest.fn(),
      approveUser: jest.fn(),
    };

    mockQueue = {
      add: jest.fn().mockResolvedValue({}),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [
        { provide: WahaClientService, useValue: mockWaha },
        { provide: DocumentService, useValue: { processFile: jest.fn(), findRelevantContext: jest.fn(), processPollWebhook: jest.fn() } },
        { provide: FaceRecognitionService, useValue: mockFaceService },
        { provide: StorageService, useValue: mockStorage },
        { provide: AiService, useValue: { answerQuestion: jest.fn() } },
        { provide: TwoFactorService, useValue: mockTwoFactor },
        { provide: EveningReviewService, useValue: { generateCsvForRange: jest.fn(), sendDailySummary: jest.fn() } },
        { provide: getQueueToken('faces'), useValue: mockQueue },
        { provide: ConfigService, useValue: { get: (key: string) => key === 'HMAC_SECRET' ? HMAC_SECRET : null } },
      ],
    })
      // Real HMAC guard behavior
      .overrideGuard(HmacGuard)
      .useValue({
        canActivate: (context: { switchToHttp: () => { getRequest: () => { headers: Record<string, string>; body: object } } }) => {
          const req = context.switchToHttp().getRequest();
          const signature = req.headers['x-hub-signature-256'];
          if (!signature) return false;
          
          const body = JSON.stringify(req.body);
          const expected = 'sha256=' + crypto.createHmac('sha256', HMAC_SECRET).update(body).digest('hex');
          return signature === expected;
        },
      })
      // Real idempotency guard behavior
      .overrideGuard(IdempotencyGuard)
      .useValue({
        canActivate: (context: { switchToHttp: () => { getRequest: () => { body: { id?: string } } } }) => {
          const req = context.switchToHttp().getRequest();
          const messageId = req.body?.id;
          if (!messageId) return true;
          if (processedMessageIds.has(messageId)) return false;
          processedMessageIds.add(messageId);
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('HMAC Signature Verification', () => {
    it('should reject request without signature', async () => {
      const payload = { event: 'message', id: 'msg-1', payload: {} };
      
      const response = await request(app.getHttpServer())
        .post('/webhook')
        .send(payload);
      
      expect(response.status).toBe(403);
    });

    it('should reject request with invalid signature', async () => {
      const payload = { event: 'message', id: 'msg-2', payload: {} };
      
      const response = await request(app.getHttpServer())
        .post('/webhook')
        .set('X-Hub-Signature-256', 'sha256=invalid')
        .send(payload);
      
      expect(response.status).toBe(403);
    });

    it('should accept request with valid signature', async () => {
      const payload = { 
        event: 'message', 
        id: 'msg-3', 
        session: 'default',
        payload: { from: 'user@c.us', fromMe: true, body: 'test' } 
      };
      const signature = signPayload(payload);
      
      const response = await request(app.getHttpServer())
        .post('/webhook')
        .set('X-Hub-Signature-256', signature)
        .set('Content-Type', 'application/json')
        .send(payload);
      
      expect(response.status).toBe(201);
    });

    it('should reject if payload is tampered after signing', async () => {
      const originalPayload = { event: 'message', id: 'msg-4', payload: { body: 'original' } };
      const signature = signPayload(originalPayload);
      
      const tamperedPayload = { event: 'message', id: 'msg-4', payload: { body: 'tampered' } };
      
      const response = await request(app.getHttpServer())
        .post('/webhook')
        .set('X-Hub-Signature-256', signature)
        .send(tamperedPayload);
      
      expect(response.status).toBe(403);
    });
  });

  describe('Idempotency', () => {
    it('should process first request with message ID', async () => {
      const payload = { 
        event: 'message', 
        id: 'unique-msg-100',
        session: 'default',
        payload: { from: 'user@c.us', fromMe: false, body: '/register Test' } 
      };
      const signature = signPayload(payload);
      
      const response = await request(app.getHttpServer())
        .post('/webhook')
        .set('X-Hub-Signature-256', signature)
        .set('Content-Type', 'application/json')
        .send(payload);
      
      expect(response.status).toBe(201);
      expect(mockFaceService.registerWorker).toHaveBeenCalled();
    });

    it('should reject duplicate request with same message ID', async () => {
      const payload = { 
        event: 'message', 
        id: 'unique-msg-100',
        session: 'default',
        payload: { from: 'user@c.us', fromMe: false, body: '/register Test' } 
      };
      const signature = signPayload(payload);
      
      mockFaceService.registerWorker!.mockClear();
      
      const response = await request(app.getHttpServer())
        .post('/webhook')
        .set('X-Hub-Signature-256', signature)
        .set('Content-Type', 'application/json')
        .send(payload);
      
      expect(response.status).toBe(403);
      expect(mockFaceService.registerWorker).not.toHaveBeenCalled();
    });

    it('should process request with different message ID', async () => {
      const payload = { 
        event: 'message', 
        id: 'unique-msg-101',
        session: 'default',
        payload: { from: 'user@c.us', fromMe: false, body: '/register Another' } 
      };
      const signature = signPayload(payload);
      
      const response = await request(app.getHttpServer())
        .post('/webhook')
        .set('X-Hub-Signature-256', signature)
        .set('Content-Type', 'application/json')
        .send(payload);
      
      expect(response.status).toBe(201);
    });
  });

  describe('Request Processing', () => {
    it('should call registerWorker with parsed arguments', async () => {
      const payload = { 
        event: 'message', 
        id: 'msg-register-1',
        session: 'default',
        payload: { from: 'user@c.us', fromMe: false, body: '/register Alice @ Acme' } 
      };
      const signature = signPayload(payload);
      
      await request(app.getHttpServer())
        .post('/webhook')
        .set('X-Hub-Signature-256', signature)
        .set('Content-Type', 'application/json')
        .send(payload);
      
      expect(mockFaceService.registerWorker).toHaveBeenCalledWith(
        'Alice',
        'Acme',
        'user@c.us'
      );
    });

    it('should queue image processing for image messages', async () => {
      const payload = { 
        event: 'message', 
        id: 'msg-image-1',
        session: 'default',
        payload: { 
          from: 'user@c.us', 
          fromMe: false, 
          hasMedia: true,
          media: { url: 'http://example.com/img.jpg', mimetype: 'image/jpeg', filename: 'photo.jpg' }
        } 
      };
      const signature = signPayload(payload);
      
      await request(app.getHttpServer())
        .post('/webhook')
        .set('X-Hub-Signature-256', signature)
        .set('Content-Type', 'application/json')
        .send(payload);
      
      expect(mockQueue.add).toHaveBeenCalledWith('process', expect.objectContaining({
        s3Key: 'key.jpg',
        session: 'default',
        chatId: 'user@c.us',
      }));
    });
  });
});
