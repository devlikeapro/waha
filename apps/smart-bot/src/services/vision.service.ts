import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface FaceResult {
  bbox: number[];
  det_score: number;
  embedding: number[];
}

export interface DetectResponse {
  faces: FaceResult[];
}

/** Exported for testing */
export const VISION_TIMEOUT_MS = 30000;
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 1000;

/** Retryable error codes and HTTP statuses */
const RETRYABLE_CODES = new Set(['ECONNREFUSED', 'ETIMEDOUT', 'ECONNRESET']);
const RETRYABLE_STATUSES = new Set([502, 503, 504]);

export function isRetryableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const code = (error as { code?: string }).code;
  const status = (error as { response?: { status?: number } }).response?.status;
  return (code !== undefined && RETRYABLE_CODES.has(code)) || 
         (status !== undefined && RETRYABLE_STATUSES.has(status));
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@Injectable()
export class VisionService {
  private readonly logger = new Logger(VisionService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('visionUrl', 'http://vision-worker:8000');
    this.apiKey = this.configService.get<string>('VISION_API_KEY');
  }

  async detectFaces(s3Key: string): Promise<FaceResult[]> {
    const headers: Record<string, string> = {};
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        this.logger.debug(`Detect request for ${s3Key} (attempt ${attempt}/${MAX_RETRIES})`);
        
        const response = await firstValueFrom(
          this.httpService.post<DetectResponse>(
            `${this.baseUrl}/detect`,
            { s3_key: s3Key },
            { timeout: VISION_TIMEOUT_MS, headers },
          ),
        );

        return response.data.faces;
      } catch (error) {
        lastError = error;
        
        if (attempt < MAX_RETRIES && isRetryableError(error)) {
          const delay = RETRY_DELAY_MS * attempt;
          this.logger.warn(`Vision request failed (attempt ${attempt}), retrying in ${delay}ms: ${error.message}`);
          await sleep(delay);
        } else {
          break;
        }
      }
    }

    this.logger.error(`Error calling vision worker: ${lastError?.message}`, lastError?.stack);
    throw lastError;
  }
}
