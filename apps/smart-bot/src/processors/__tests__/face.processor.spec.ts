import { FaceProcessor } from '../face.processor';
import { FaceRecognitionService } from '../../services/face-recognition.service';
import { Job } from 'bullmq';

describe('FaceProcessor', () => {
  let processor: FaceProcessor;
  let mockFaceService: jest.Mocked<Pick<FaceRecognitionService, 'processImage'>>;

  beforeEach(() => {
    mockFaceService = {
      processImage: jest.fn(),
    };
    processor = new FaceProcessor(mockFaceService as unknown as FaceRecognitionService);
  });

  describe('process', () => {
    it('calls processImage with correct parameters', async () => {
      mockFaceService.processImage.mockResolvedValue(undefined);
      
      const job = {
        id: 'job-123',
        data: { s3Key: 'test.jpg', session: 'default', chatId: 'user@c.us' },
        attemptsMade: 0,
      } as Job<{ s3Key: string; session: string; chatId: string }>;

      const result = await processor.process(job);

      expect(mockFaceService.processImage).toHaveBeenCalledWith('test.jpg', 'default', 'user@c.us');
      expect(result).toEqual({ success: true });
    });

    it('throws error when processImage fails', async () => {
      const error = new Error('Vision service unavailable');
      mockFaceService.processImage.mockRejectedValue(error);
      
      const job = {
        id: 'job-456',
        data: { s3Key: 'fail.jpg', session: 'default', chatId: 'user@c.us' },
        attemptsMade: 0,
      } as Job<{ s3Key: string; session: string; chatId: string }>;

      await expect(processor.process(job)).rejects.toThrow('Vision service unavailable');
    });

    it('includes attempt count in logging context', async () => {
      mockFaceService.processImage.mockResolvedValue(undefined);
      
      const job = {
        id: 'job-789',
        data: { s3Key: 'retry.jpg', session: 'default', chatId: 'user@c.us' },
        attemptsMade: 2,
      } as Job<{ s3Key: string; session: string; chatId: string }>;

      await processor.process(job);

      expect(mockFaceService.processImage).toHaveBeenCalled();
    });
  });
});
