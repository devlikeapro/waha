import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import * as crypto from 'crypto';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3: S3Client;
  private bucket: string;
  private debugMode: boolean;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('S3_REGION', 'us-east-1');
    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY');
    const secretAccessKey = this.configService.get<string>('S3_SECRET_KEY');
    
    if (!accessKeyId || !secretAccessKey) {
      throw new Error('S3_ACCESS_KEY and S3_SECRET_KEY must be configured');
    }
    
    this.bucket = this.configService.get<string>('S3_BUCKET', 'waha-media');
    this.debugMode = this.configService.get<string>('FORCE_DEBUG_STORAGE', 'false') === 'true';
    
    if (this.debugMode) {
      this.logger.warn('Debug storage mode enabled - raw images will be retained');
    }

    this.s3 = new S3Client({
      region,
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  isDebugMode(): boolean {
    return this.debugMode;
  }

  async upload(buffer: Buffer, originalFilename: string, mimeType: string): Promise<string> {
    const hash = crypto.createHash('md5').update(buffer).digest('hex');
    const ext = originalFilename.split('.').pop();
    const key = `${hash}.${ext}`;

    try {
      await this.s3.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      }));
      
      this.logger.log(`Uploaded ${key} to ${this.bucket}`);
      return key;
    } catch (error) {
      this.logger.error(`Failed to upload ${key}`, error);
      throw error;
    }
  }

  async getBuffer(key: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      const response = await this.s3.send(command);
      const byteArray = await response.Body.transformToByteArray();
      return Buffer.from(byteArray);
    } catch (error) {
      this.logger.error(`Failed to get ${key}`, error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    if (this.debugMode) {
      this.logger.debug(`Debug mode: skipping deletion of ${key}`);
      return;
    }
    
    try {
      await this.s3.send(new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }));
      this.logger.log(`Deleted ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete ${key}`, error);
    }
  }
}
