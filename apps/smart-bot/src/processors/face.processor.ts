import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { FaceRecognitionService } from '../services/face-recognition.service';

interface FaceJobData {
  s3Key: string;
  session: string;
  chatId: string;
}

interface FaceJobResult {
  success: boolean;
  error?: string;
}

@Processor('faces', {
  concurrency: 2,
  limiter: { max: 10, duration: 1000 },
})
export class FaceProcessor extends WorkerHost {
  private readonly logger = new Logger(FaceProcessor.name);

  constructor(
    private readonly faceRecognitionService: FaceRecognitionService,
  ) {
    super();
  }

  async process(job: Job<FaceJobData, FaceJobResult, string>): Promise<FaceJobResult> {
    const { s3Key, session, chatId } = job.data;
    
    this.logger.log({ jobId: job.id, s3Key, attempt: job.attemptsMade + 1 }, 'Processing face job');
    
    try {
      await this.faceRecognitionService.processImage(s3Key, session, chatId);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error({ jobId: job.id, error: message }, 'Failed to process face job');
      throw error;
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<FaceJobData>, error: Error) {
    this.logger.error(
      { jobId: job.id, attempts: job.attemptsMade, error: error.message },
      'Face job failed permanently'
    );
  }
}
