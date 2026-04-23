import { Test, TestingModule } from '@nestjs/testing';
import { WebhookController } from '../webhook.controller';
import { WahaClientService } from '../../services/waha-client.service';
import { DocumentService } from '../../services/document.service';
import { FaceRecognitionService } from '../../services/face-recognition.service';
import { StorageService } from '../../services/storage.service';
import { AiService } from '../../services/ai.service';
import { TwoFactorService } from '../../services/auth/two-factor.service';
import { EveningReviewService } from '../../services/evening-review.service';
import { getQueueToken } from '@nestjs/bullmq';
import { HmacGuard } from '../../guards/hmac.guard';
import { IdempotencyGuard } from '../../guards/idempotency.guard';

describe('WebhookController', () => {
  let controller: WebhookController;
  let mockWaha: jest.Mocked<WahaClientService>;
  let mockFaceRecognition: jest.Mocked<FaceRecognitionService>;
  let mockStorage: jest.Mocked<StorageService>;
  let mockTwoFactor: jest.Mocked<TwoFactorService>;
  let mockFacesQueue: { add: jest.Mock };

  beforeEach(async () => {
    mockWaha = {
      sendText: jest.fn().mockResolvedValue({}),
      sendImage: jest.fn().mockResolvedValue({}),
      sendPoll: jest.fn().mockResolvedValue({}),
      downloadFile: jest.fn().mockResolvedValue(Buffer.from('fake')),
    } as any;

    mockFaceRecognition = {
      processImage: jest.fn(),
      processPollVote: jest.fn(),
      registerWorker: jest.fn(),
      correctLog: jest.fn(),
    } as any;

    mockStorage = {
      upload: jest.fn().mockResolvedValue('uploaded-key.jpg'),
    } as any;

    mockTwoFactor = {
      isVerified: jest.fn().mockResolvedValue(true),
      isAdmin: jest.fn().mockReturnValue(false),
      requestAccess: jest.fn(),
      approveUser: jest.fn(),
    } as any;

    mockFacesQueue = { add: jest.fn().mockResolvedValue({}) };

    const mockEveningReview = {
      generateCsvForRange: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [
        { provide: WahaClientService, useValue: mockWaha },
        { provide: DocumentService, useValue: { processFile: jest.fn(), findRelevantContext: jest.fn(), processPollWebhook: jest.fn() } },
        { provide: FaceRecognitionService, useValue: mockFaceRecognition },
        { provide: StorageService, useValue: mockStorage },
        { provide: AiService, useValue: { answerQuestion: jest.fn() } },
        { provide: TwoFactorService, useValue: mockTwoFactor },
        { provide: EveningReviewService, useValue: mockEveningReview },
        { provide: getQueueToken('faces'), useValue: mockFacesQueue },
      ],
    })
    .overrideGuard(HmacGuard).useValue({ canActivate: () => true })
    .overrideGuard(IdempotencyGuard).useValue({ canActivate: () => true })
    .compile();

    controller = module.get<WebhookController>(WebhookController);
  });

  describe('/register command parsing', () => {
    const createWebhook = (body: string) => ({
      event: 'message',
      id: 'msg-1',
      session: 'default',
      payload: { from: 'user@c.us', fromMe: false, body, hasMedia: false },
    });

    it('should parse name without company correctly', async () => {
      mockFaceRecognition.registerWorker.mockResolvedValue('OK');

      await controller.handleWebhook(createWebhook('/register John Doe') as any);

      expect(mockFaceRecognition.registerWorker).toHaveBeenCalledWith(
        'John Doe',  // Full name preserved
        null,        // No company
        'user@c.us'
      );
    });

    it('should parse name with @ company correctly', async () => {
      mockFaceRecognition.registerWorker.mockResolvedValue('OK');

      await controller.handleWebhook(createWebhook('/register Alice Smith @ Acme Corp') as any);

      expect(mockFaceRecognition.registerWorker).toHaveBeenCalledWith(
        'Alice Smith',
        'Acme Corp',
        'user@c.us'
      );
    });

    it('should truncate names longer than 100 characters (sanitizeName handles this)', async () => {
      mockFaceRecognition.registerWorker.mockResolvedValue('OK');
      const longName = 'A'.repeat(150);

      await controller.handleWebhook(createWebhook(`/register ${longName}`) as any);

      // sanitizeName truncates to 100 chars, so it should be called with truncated name
      expect(mockFaceRecognition.registerWorker).toHaveBeenCalledWith(
        'A'.repeat(100),  // Truncated by sanitizeName
        null,
        'user@c.us'
      );
    });

    it('should truncate company names longer than 100 characters (sanitizeName handles this)', async () => {
      mockFaceRecognition.registerWorker.mockResolvedValue('OK');
      const longCompany = 'B'.repeat(150);

      await controller.handleWebhook(createWebhook(`/register Valid @ ${longCompany}`) as any);

      // sanitizeName truncates to 100 chars
      expect(mockFaceRecognition.registerWorker).toHaveBeenCalledWith(
        'Valid',
        'B'.repeat(100),  // Truncated by sanitizeName
        'user@c.us'
      );
    });

    it('should show usage when /register has no arguments', async () => {
      await controller.handleWebhook(createWebhook('/register') as any);

      expect(mockFaceRecognition.registerWorker).not.toHaveBeenCalled();
      expect(mockWaha.sendText).toHaveBeenCalledWith(
        'default',
        'user@c.us',
        expect.stringContaining('Usage')
      );
    });

    it('should sanitize special characters from name', async () => {
      mockFaceRecognition.registerWorker.mockResolvedValue('OK');

      await controller.handleWebhook(createWebhook('/register John<script>') as any);

      expect(mockFaceRecognition.registerWorker).toHaveBeenCalledWith(
        'Johnscript',  // <> removed
        null,
        'user@c.us'
      );
    });

    it('should reject name that becomes empty after sanitization', async () => {
      await controller.handleWebhook(createWebhook('/register <>&"\'') as any);

      expect(mockFaceRecognition.registerWorker).not.toHaveBeenCalled();
      expect(mockWaha.sendText).toHaveBeenCalledWith(
        'default',
        'user@c.us',
        expect.stringContaining('Invalid')
      );
    });
  });

  describe('/correct command parsing', () => {
    const createWebhook = (body: string) => ({
      event: 'message',
      id: 'msg-1',
      session: 'default',
      payload: { from: 'user@c.us', fromMe: false, body, hasMedia: false },
    });

    it('should parse "wrong to correct" format', async () => {
      mockFaceRecognition.correctLog.mockResolvedValue('OK');

      await controller.handleWebhook(createWebhook('/correct John to Jane') as any);

      expect(mockFaceRecognition.correctLog).toHaveBeenCalledWith(
        'user@c.us',
        'Jane',   // Correct name
        'John'    // Wrong name
      );
    });

    it('should parse "wrong is correct" format', async () => {
      mockFaceRecognition.correctLog.mockResolvedValue('OK');

      await controller.handleWebhook(createWebhook('/correct Bob is Robert') as any);

      expect(mockFaceRecognition.correctLog).toHaveBeenCalledWith(
        'user@c.us',
        'Robert',
        'Bob'
      );
    });

    it('should parse single name (correct last log)', async () => {
      mockFaceRecognition.correctLog.mockResolvedValue('OK');

      await controller.handleWebhook(createWebhook('/correct Alice') as any);

      expect(mockFaceRecognition.correctLog).toHaveBeenCalledWith(
        'user@c.us',
        'Alice',
        undefined  // No wrong name specified
      );
    });

    it('should show usage when /correct has no arguments', async () => {
      await controller.handleWebhook(createWebhook('/correct') as any);

      expect(mockFaceRecognition.correctLog).not.toHaveBeenCalled();
      expect(mockWaha.sendText).toHaveBeenCalledWith(
        'default',
        'user@c.us',
        expect.stringContaining('Usage')
      );
    });

    it('should truncate correct name longer than 100 characters (sanitizeName handles this)', async () => {
      mockFaceRecognition.correctLog.mockResolvedValue('OK');
      const longName = 'A'.repeat(150);

      await controller.handleWebhook(createWebhook(`/correct ${longName}`) as any);

      // sanitizeName truncates to 100 chars
      expect(mockFaceRecognition.correctLog).toHaveBeenCalledWith(
        'user@c.us',
        'A'.repeat(100),  // Truncated by sanitizeName
        undefined
      );
    });

    it('should sanitize special characters from names', async () => {
      mockFaceRecognition.correctLog.mockResolvedValue('OK');

      await controller.handleWebhook(createWebhook('/correct John<script> to Jane') as any);

      expect(mockFaceRecognition.correctLog).toHaveBeenCalledWith(
        'user@c.us',
        'Jane',
        'Johnscript'  // <> removed
      );
    });

    it('should reject name that becomes empty after sanitization', async () => {
      await controller.handleWebhook(createWebhook('/correct <>&"\'') as any);

      expect(mockFaceRecognition.correctLog).not.toHaveBeenCalled();
      expect(mockWaha.sendText).toHaveBeenCalledWith(
        'default',
        'user@c.us',
        expect.stringContaining('Invalid')
      );
    });
  });

  describe('Authorization flow', () => {
    const createWebhook = (from: string, body: string) => ({
      event: 'message',
      id: 'msg-1',
      session: 'default',
      payload: { from, fromMe: false, body, hasMedia: false },
    });

    it('should block unverified users from sending messages', async () => {
      mockTwoFactor.isVerified.mockResolvedValue(false);

      await controller.handleWebhook(createWebhook('unverified@c.us', 'Hello') as any);

      expect(mockWaha.sendText).toHaveBeenCalledWith(
        'default',
        'unverified@c.us',
        expect.stringContaining('Access Denied')
      );
    });

    it('should allow /access request even for unverified users', async () => {
      // Note: /access request is processed BEFORE auth check
      await controller.handleWebhook(createWebhook('new@c.us', '/access request user@email.com') as any);

      expect(mockTwoFactor.requestAccess).toHaveBeenCalledWith(
        'new@c.us',
        'user@email.com',
        'default'
      );
    });

    it('should reject /admin approve from non-admin', async () => {
      mockTwoFactor.isAdmin.mockReturnValue(false);

      await controller.handleWebhook(createWebhook('user@c.us', '/admin approve 123456') as any);

      expect(mockTwoFactor.approveUser).not.toHaveBeenCalled();
      expect(mockWaha.sendText).toHaveBeenCalledWith(
        'default',
        'user@c.us',
        expect.stringContaining('Admin access required')
      );
    });

    it('should allow /admin approve from admin', async () => {
      mockTwoFactor.isAdmin.mockReturnValue(true);

      await controller.handleWebhook(createWebhook('admin@c.us', '/admin approve 123456789') as any);

      expect(mockTwoFactor.approveUser).toHaveBeenCalledWith('123456789@s.whatsapp.net');
    });
  });

  describe('Image processing flow', () => {
    it('should queue image for face processing', async () => {
      const webhook = {
        event: 'message',
        id: 'msg-1',
        session: 'default',
        payload: {
          from: 'user@c.us',
          fromMe: false,
          hasMedia: true,
          media: { url: 'http://example.com/img.jpg', mimetype: 'image/jpeg', filename: 'photo.jpg' },
        },
      };

      await controller.handleWebhook(webhook as any);

      // Verify queue was called with correct data
      expect(mockFacesQueue.add).toHaveBeenCalledWith('process', {
        s3Key: 'uploaded-key.jpg',
        session: 'default',
        chatId: 'user@c.us',
      });
    });

    it('should reject images larger than 10MB', async () => {
      mockWaha.downloadFile.mockResolvedValue(Buffer.alloc(11 * 1024 * 1024));

      const webhook = {
        event: 'message',
        id: 'msg-1',
        session: 'default',
        payload: {
          from: 'user@c.us',
          fromMe: false,
          hasMedia: true,
          media: { url: 'http://example.com/large.jpg', mimetype: 'image/jpeg', filename: 'large.jpg' },
        },
      };

      await controller.handleWebhook(webhook as any);

      expect(mockFacesQueue.add).not.toHaveBeenCalled();
      expect(mockWaha.sendText).toHaveBeenCalledWith(
        'default',
        'user@c.us',
        expect.stringContaining('too large')
      );
    });

    it('should ignore messages from self (fromMe: true)', async () => {
      const webhook = {
        event: 'message',
        id: 'msg-1',
        session: 'default',
        payload: { from: 'bot@c.us', fromMe: true, body: 'My message', hasMedia: false },
      };

      await controller.handleWebhook(webhook as any);

      expect(mockWaha.sendText).not.toHaveBeenCalled();
      expect(mockFacesQueue.add).not.toHaveBeenCalled();
    });
  });

  describe('/csv command', () => {
    const createWebhook = (from: string, body: string) => ({
      event: 'message',
      id: 'msg-1',
      session: 'default',
      payload: { from, fromMe: false, body, hasMedia: false },
    });

    it('should reject /csv from non-admin', async () => {
      mockTwoFactor.isAdmin.mockReturnValue(false);

      await controller.handleWebhook(createWebhook('user@c.us', '/csv January') as any);

      expect(mockWaha.sendText).toHaveBeenCalledWith(
        'default',
        'user@c.us',
        expect.stringContaining('Admin access required')
      );
    });

    it('should show usage when /csv has no arguments', async () => {
      mockTwoFactor.isAdmin.mockReturnValue(true);

      await controller.handleWebhook(createWebhook('admin@c.us', '/csv') as any);

      expect(mockWaha.sendText).toHaveBeenCalledWith(
        'default',
        'admin@c.us',
        expect.stringContaining('Usage')
      );
    });

    it('should reject /csv with special characters', async () => {
      mockTwoFactor.isAdmin.mockReturnValue(true);

      await controller.handleWebhook(createWebhook('admin@c.us', '/csv <script>') as any);

      expect(mockWaha.sendText).toHaveBeenCalledWith(
        'default',
        'admin@c.us',
        expect.stringContaining('Usage')
      );
    });

    it('should reject /csv with invalid month', async () => {
      mockTwoFactor.isAdmin.mockReturnValue(true);

      await controller.handleWebhook(createWebhook('admin@c.us', '/csv InvalidMonth') as any);

      expect(mockWaha.sendText).toHaveBeenCalledWith(
        'default',
        'admin@c.us',
        expect.stringContaining('Invalid month')
      );
    });
  });
});
