import { Injectable } from '@nestjs/common';
import { WhatsappConfigService } from '@waha/config.service';

@Injectable()
export class MediaS3StorageConfig {
    constructor(private config: WhatsappConfigService) { }

    get region(): string {
        return this.config.get('WAHA_S3_REGION', 'us-east-1');
    }

    get bucket(): string {
        return this.config.get('WAHA_S3_BUCKET', 'waha-files');
    }

    get accessKeyId(): string {
        return this.config.get('WAHA_S3_ACCESS_KEY_ID', '');
    }

    get secretAccessKey(): string {
        return this.config.get('WAHA_S3_SECRET_ACCESS_KEY', '');
    }

    get endpoint(): string | undefined {
        return this.config.get('WAHA_S3_ENDPOINT', undefined) || undefined;
    }

    get forcePathStyle(): boolean {
        return this.config.get('WAHA_S3_FORCE_PATH_STYLE', 'false').toLowerCase() === 'true';
    }

    get proxyFiles(): boolean {
        return this.config.get('WAHA_S3_PROXY_FILES', 'false').toLowerCase() === 'true';
    }

    /**
     * Optional public base URL for accessing uploaded files (e.g. Cloudflare R2 custom domain).
     * If set, this URL is used to construct public file URLs instead of the S3 endpoint.
     * Example: https://files.getcdn.my.id
     */
    get publicUrl(): string | undefined {
        return this.config.get('WAHA_S3_PUBLIC_URL', undefined) || undefined;
    }
}
