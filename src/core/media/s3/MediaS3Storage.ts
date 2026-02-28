import {
    S3Client,
    PutObjectCommand,
    HeadObjectCommand,
    DeleteObjectsCommand,
    ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import {
    getMetadata,
    IMediaStorage,
    MediaData,
    MediaStorageData,
} from '@waha/core/media/IMediaStorage';
import { Logger } from 'pino';
import { MediaS3StorageConfig } from './MediaS3StorageConfig';

export class MediaS3Storage implements IMediaStorage {
    private s3: S3Client;

    constructor(
        protected log: Logger,
        private config: MediaS3StorageConfig,
        private baseUrl: string,
    ) {
        this.s3 = new S3Client({
            region: this.config.region,
            credentials: {
                accessKeyId: this.config.accessKeyId,
                secretAccessKey: this.config.secretAccessKey,
            },
            endpoint: this.config.endpoint,
            forcePathStyle: this.config.forcePathStyle,
        });
    }

    async init() {
        this.log.info(`S3 Media Storage initialized for bucket: ${this.config.bucket}`);
    }

    async exists(data: MediaData): Promise<boolean> {
        const key = this.getKey(data);
        try {
            await this.s3.send(
                new HeadObjectCommand({
                    Bucket: this.config.bucket,
                    Key: key,
                }),
            );
            return true;
        } catch (error) {
            const err = error as any;
            if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
                return false;
            }
            this.log.error(err, `Error checking if file exists in S3 (key: ${key}):`);
            return false; // Safest default is to assume not exists on generic error to allow re-upload if needed, or throw depending on strictness.
        }
    }

    public async save(buffer: Buffer, data: MediaData): Promise<boolean> {
        const key = this.getKey(data);
        const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

        if (buffer.length > MAX_SIZE_BYTES) {
            this.log.warn(`File size (${buffer.length} bytes) exceeds 10MB limit: ${key}`);
            throw new Error(`File size exceeds 10MB limit`);
        }

        try {
            await this.s3.send(
                new PutObjectCommand({
                    Bucket: this.config.bucket,
                    Key: key,
                    Body: buffer,
                    Metadata: getMetadata(data),
                    ACL: 'public-read',
                }),
            );
            this.log.info(`File uploaded to S3: ${key}`);
            return true;
        } catch (error) {
            this.log.error(error, `Failed to upload file to S3: ${key}`);
            return false;
        }
    }

    public async getStorageData(data: MediaData): Promise<MediaStorageData> {
        const key = this.getKey(data);
        const bucket = this.config.bucket;

        let url: string;
        if (this.config.proxyFiles) {
            // Local URL acting as proxy
            url = `${this.baseUrl}/api/s3/${bucket}/${key}`;
        } else {
            // Direct public URL - files are uploaded with ACL public-read, no expiry.
            // WAHA_S3_PUBLIC_URL: optional custom public domain (e.g. Cloudflare R2 custom domain).
            //   If set, this is used as the base URL for public file access.
            //   The S3 endpoint (WAHA_S3_ENDPOINT) is still used by the SDK for upload/API operations.
            // Falls back to the S3 endpoint, then the default AWS S3 URL.
            const publicBase = this.config.publicUrl
                ?? this.config.endpoint
                ?? `https://s3.${this.config.region}.amazonaws.com`;
            url = `${publicBase.replace(/\/$/, '')}/${key}`;
        }

        return {
            url,
            s3: {
                Bucket: bucket,
                Key: key,
            },
        };
    }

    async purge() {
        this.log.info('Purge is not implemented for S3 storage by default. Use Bucket Lifecycle Rules.');
        // Implementing purge for S3 can be very dangerous if bucket contains other files.
        // Left as no-op intentionally as stated in the implementation plan.
    }

    private getKey(data: MediaData): string {
        return `${data.session}/${data.message.id}.${data.file.extension}`;
    }

    async close() {
        this.s3.destroy();
    }
}
