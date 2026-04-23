import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WahaClientService {
  private readonly logger = new Logger(WahaClientService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Default to internal Docker DNS if not specified, port 3000
    this.baseUrl = this.configService.get<string>('WAHA_BASE_URL', 'http://waha:3000');
    this.apiKey = this.configService.get<string>('WAHA_API_KEY', '');
  }

  async sendText(session: string, chatId: string, text: string) {
    const url = `${this.baseUrl}/api/send/chat`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['X-Api-Key'] = this.apiKey;
    }

    try {
      this.logger.log(`Sending message to ${chatId} via ${session}`);
      const response = await lastValueFrom(
        this.httpService.post(
          url,
          {
            session,
            chatId,
            text,
          },
          { headers },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to send message: ${error.message}`, error.stack);
      // Don't crash the bot if WAHA is down
      return null;
    }
  }

  async sendPoll(session: string, chatId: string, question: string, options: string[]) {
      const url = `${this.baseUrl}/api/send/poll`;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (this.apiKey) headers['X-Api-Key'] = this.apiKey;

      try {
          const response = await lastValueFrom(
              this.httpService.post(url, { session, chatId, question, options }, { headers })
          );
          return response.data; // Returns { id: '...' } message ID
      } catch (error) {
          this.logger.error(`Failed to send poll`, error);
          return null;
      }
  }

  async sendImage(session: string, chatId: string, fileData: Buffer, filename: string, caption?: string) {
      const url = `${this.baseUrl}/api/send/image`;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (this.apiKey) headers['X-Api-Key'] = this.apiKey;

      const base64Data = fileData.toString('base64');
      const mimetype = this.getMimeType(filename);

      try {
          const response = await lastValueFrom(
              this.httpService.post(url, { 
                  session, 
                  chatId, 
                  file: {
                      mimetype,
                      filename,
                      data: base64Data
                  },
                  caption
              }, { headers })
          );
          return response.data;
      } catch (error) {
          this.logger.error(`Failed to send image`, error);
          return null;
      }
  }

  private getMimeType(filename: string): string {
      const ext = filename.split('.').pop()?.toLowerCase();
      if (ext === 'png') return 'image/png';
      if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
      if (ext === 'webp') return 'image/webp';
      return 'application/octet-stream';
  }

  async downloadFile(url: string): Promise<Buffer> {
      try {
          const response = await lastValueFrom(
              this.httpService.get(url, { responseType: 'arraybuffer' })
          );
          return Buffer.from(response.data);
      } catch (error) {
          this.logger.error(`Failed to download file from ${url}`, error);
          throw error;
      }
  }

  async sendFile(session: string, chatId: string, fileData: Buffer, filename: string, mimetype: string, caption?: string) {
      const url = `${this.baseUrl}/api/send/file`;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (this.apiKey) headers['X-Api-Key'] = this.apiKey;

      const base64Data = fileData.toString('base64');

      try {
          const response = await lastValueFrom(
              this.httpService.post(url, { 
                  session, 
                  chatId, 
                  file: {
                      mimetype,
                      filename,
                      data: base64Data
                  },
                  caption
              }, { headers })
          );
          return response.data;
      } catch (error) {
          this.logger.error(`Failed to send file`, error);
          return null;
      }
  }
}
