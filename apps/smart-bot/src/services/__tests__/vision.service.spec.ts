import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { VisionService, isRetryableError, VISION_TIMEOUT_MS, MAX_RETRIES, RETRY_DELAY_MS } from '../vision.service';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('VisionService Helper Functions (No Mocks)', () => {
  describe('isRetryableError', () => {
    it('returns true for ECONNREFUSED', () => {
      expect(isRetryableError({ code: 'ECONNREFUSED' })).toBe(true);
    });

    it('returns true for ETIMEDOUT', () => {
      expect(isRetryableError({ code: 'ETIMEDOUT' })).toBe(true);
    });

    it('returns true for ECONNRESET', () => {
      expect(isRetryableError({ code: 'ECONNRESET' })).toBe(true);
    });

    it('returns true for 502 Bad Gateway', () => {
      expect(isRetryableError({ response: { status: 502 } })).toBe(true);
    });

    it('returns true for 503 Service Unavailable', () => {
      expect(isRetryableError({ response: { status: 503 } })).toBe(true);
    });

    it('returns true for 504 Gateway Timeout', () => {
      expect(isRetryableError({ response: { status: 504 } })).toBe(true);
    });

    it('returns false for 400 Bad Request', () => {
      expect(isRetryableError({ response: { status: 400 } })).toBe(false);
    });

    it('returns false for 401 Unauthorized', () => {
      expect(isRetryableError({ response: { status: 401 } })).toBe(false);
    });

    it('returns false for 404 Not Found', () => {
      expect(isRetryableError({ response: { status: 404 } })).toBe(false);
    });

    it('returns false for 500 Internal Server Error', () => {
      expect(isRetryableError({ response: { status: 500 } })).toBe(false);
    });

    it('returns false for null', () => {
      expect(isRetryableError(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isRetryableError(undefined)).toBe(false);
    });

    it('returns false for non-object', () => {
      expect(isRetryableError('error')).toBe(false);
      expect(isRetryableError(123)).toBe(false);
    });

    it('returns false for unknown error code', () => {
      expect(isRetryableError({ code: 'UNKNOWN' })).toBe(false);
    });
  });

  describe('Constants', () => {
    it('VISION_TIMEOUT_MS is 30 seconds', () => {
      expect(VISION_TIMEOUT_MS).toBe(30000);
    });

    it('MAX_RETRIES is 3', () => {
      expect(MAX_RETRIES).toBe(3);
    });

    it('RETRY_DELAY_MS is 1 second', () => {
      expect(RETRY_DELAY_MS).toBe(1000);
    });
  });
});

describe('VisionService', () => {
  let service: VisionService;
  let mockHttpService: jest.Mocked<HttpService>;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    mockHttpService = {
      post: jest.fn(),
    } as any;

    mockConfigService = {
      get: jest.fn((key: string, defaultValue?: string) => {
        if (key === 'visionUrl') return 'http://vision:8000';
        if (key === 'VISION_API_KEY') return 'test-api-key';
        return defaultValue;
      }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisionService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<VisionService>(VisionService);
  });

  describe('detectFaces', () => {
    it('should return faces from vision worker', async () => {
      const mockFaces = [
        { bbox: [10, 10, 100, 100], det_score: 0.99, embedding: Array(512).fill(0.1) },
      ];

      const response: AxiosResponse = {
        data: { faces: mockFaces },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(response));

      const result = await service.detectFaces('test-key.jpg');

      expect(result).toEqual(mockFaces);
      expect(mockHttpService.post).toHaveBeenCalledWith(
        'http://vision:8000/detect',
        { s3_key: 'test-key.jpg' },
        expect.objectContaining({
          headers: { 'X-API-Key': 'test-api-key' },
        })
      );
    });

    it('should throw error on vision worker failure after retries', async () => {
      mockHttpService.post.mockReturnValue(
        throwError(() => new Error('Connection refused'))
      );

      await expect(service.detectFaces('test.jpg')).rejects.toThrow('Connection refused');
    });

    it('should retry on transient errors', async () => {
      const retryableError = { code: 'ECONNREFUSED', message: 'Connection refused' };
      const successResponse: AxiosResponse = {
        data: { faces: [] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post
        .mockReturnValueOnce(throwError(() => retryableError))
        .mockReturnValueOnce(of(successResponse));

      const result = await service.detectFaces('test.jpg');

      expect(result).toEqual([]);
      expect(mockHttpService.post).toHaveBeenCalledTimes(2);
    });

    it('should not retry on non-retryable errors (4xx)', async () => {
      const clientError = { response: { status: 400 }, message: 'Bad Request' };

      mockHttpService.post.mockReturnValue(throwError(() => clientError));

      await expect(service.detectFaces('test.jpg')).rejects.toMatchObject({ message: 'Bad Request' });
      expect(mockHttpService.post).toHaveBeenCalledTimes(1);
    });

    it('should retry on 503 Service Unavailable', async () => {
      const serverError = { response: { status: 503 }, message: 'Service Unavailable' };
      const successResponse: AxiosResponse = {
        data: { faces: [] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post
        .mockReturnValueOnce(throwError(() => serverError))
        .mockReturnValueOnce(of(successResponse));

      const result = await service.detectFaces('test.jpg');

      expect(result).toEqual([]);
      expect(mockHttpService.post).toHaveBeenCalledTimes(2);
    });

    it('should not include API key header when not configured', async () => {
      mockConfigService.get.mockImplementation((key: string, defaultValue?: string) => {
        if (key === 'visionUrl') return 'http://vision:8000';
        if (key === 'VISION_API_KEY') return undefined;
        return defaultValue;
      });

      // Recreate service with new config
      const module = await Test.createTestingModule({
        providers: [
          VisionService,
          { provide: HttpService, useValue: mockHttpService },
          { provide: ConfigService, useValue: mockConfigService },
        ],
      }).compile();

      const serviceNoKey = module.get<VisionService>(VisionService);

      const response: AxiosResponse = {
        data: { faces: [] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(response));

      await serviceNoKey.detectFaces('test.jpg');

      expect(mockHttpService.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          headers: {},
        })
      );
    });
  });
});
