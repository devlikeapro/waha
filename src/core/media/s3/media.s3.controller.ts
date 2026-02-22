import { Controller, Get, Param, Res, StreamableFile, Req, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { MediaS3StorageConfig } from './MediaS3StorageConfig';

@ApiTags('🖼️ Media')
@Controller('api/s3')
export class MediaS3Controller {
    private s3: S3Client;

    constructor(private config: MediaS3StorageConfig) {
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

    @Get(':bucket/:session/:file')
    @ApiOperation({
        summary: 'Get Media File from S3',
        description: 'Proxy endpoint to retrieve media file from S3 storage.',
    })
    @ApiParam({ name: 'bucket', required: true, description: 'S3 Bucket Name' })
    @ApiParam({ name: 'session', required: true, description: 'Session Name' })
    @ApiParam({ name: 'file', required: true, description: 'File name (e.g., id.pdf)' })
    async getFile(
        @Param('bucket') bucket: string,
        @Param('session') session: string,
        @Param('file') file: string,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<StreamableFile | void> {
        const key = `${session}/${file}`;

        try {
            const command = new GetObjectCommand({
                Bucket: bucket,
                Key: key,
            });

            const s3Response = await this.s3.send(command);

            // Pass through relevant headers
            if (s3Response.ContentType) {
                res.setHeader('Content-Type', s3Response.ContentType);
            }
            if (s3Response.ContentLength) {
                res.setHeader('Content-Length', s3Response.ContentLength);
            }
            if (s3Response.ETag) {
                res.setHeader('ETag', s3Response.ETag);
            }
            if (s3Response.LastModified) {
                res.setHeader('Last-Modified', s3Response.LastModified.toUTCString());
            }
            if (s3Response.Expires) {
                res.setHeader('Expires', s3Response.Expires.toUTCString());
            }

            // Cache control based on LastModified
            if (s3Response.CacheControl) {
                res.setHeader('Cache-Control', s3Response.CacheControl);
            } else {
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            }

            const bodyStream = s3Response.Body as import('stream').Readable;
            return new StreamableFile(bodyStream);

        } catch (error) {
            const err = error as any;
            if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
                res.status(HttpStatus.NOT_FOUND).send('File not found');
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
            }
        }
    }
}
