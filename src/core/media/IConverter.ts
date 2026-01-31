import { spawn } from 'child_process';
import { Readable } from 'stream';

export interface IMediaConverter {
  voice(content: Buffer): Promise<Buffer>;
  video(content: Buffer): Promise<Buffer>;
}

export class CoreMediaConverter implements IMediaConverter {
  async video(content: Buffer): Promise<Buffer> {
    return this.convert(content, [
      '-i',
      'pipe:0',
      '-c:v',
      'libx264',
      '-map',
      '0',
      '-movflags',
      '+faststart',
      '-f',
      'mp4',
      'pipe:1',
    ]);
  }

  async voice(content: Buffer): Promise<Buffer> {
    return this.convert(content, [
      '-i',
      'pipe:0',
      '-c:a',
      'libopus',
      '-b:a',
      '32k',
      '-ar',
      '48000',
      '-ac',
      '1',
      '-f',
      'opus',
      'pipe:1',
    ]);
  }

  private convert(content: Buffer, args: string[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', args);
      const inputStream = new Readable();
      inputStream.push(content);
      inputStream.push(null);

      // Handle stream errors
      inputStream.on('error', (err) => {
        reject(new Error(`Input stream error: ${err.message}`));
      });

      // Pipe input to ffmpeg stdin
      inputStream.pipe(ffmpeg.stdin).on('error', (err) => {
        // stdin errors can happen if ffmpeg exits early
        // We catch them here to avoid unhandled exceptions,
        // but the main error info usually comes from ffmpeg.on('close') or stderr
      });

      const chunks: Buffer[] = [];
      ffmpeg.stdout.on('data', (chunk) => chunks.push(chunk));

      const stderr: Buffer[] = [];
      ffmpeg.stderr.on('data', (data) => stderr.push(data));

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve(Buffer.concat(chunks));
        } else {
          const errorMessage = Buffer.concat(stderr).toString();
          reject(
            new Error(`FFmpeg exited with code ${code}. Error: ${errorMessage}`),
          );
        }
      });

      ffmpeg.on('error', (err) => {
        reject(new Error(`FFmpeg spawn error: ${err.message}`));
      });
    });
  }
}
