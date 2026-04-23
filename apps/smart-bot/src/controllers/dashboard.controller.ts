import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, Query, Logger, Res, UseGuards, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Inject } from '@nestjs/common';
import { DRIZZLE } from '../db/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { desc, eq, count, or } from 'drizzle-orm';
import { FaceRecognitionService, sanitizeName } from '../services/face-recognition.service';
import { StorageService } from '../services/storage.service';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { CreateWorkerDto, RegisterUnknownDto } from '../dto/worker.dto';

interface MulterFile {
    originalname: string;
    mimetype: string;
    buffer: Buffer;
}

@Controller('api')
@UseGuards(ApiKeyGuard)
export class DashboardController {
  private readonly logger = new Logger(DashboardController.name);

  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
    private readonly faceService: FaceRecognitionService,
    private readonly storageService: StorageService
  ) {}

  @Get('stats')
  async getStats() {
      const [logsCount, workersCount, unknownCount, confirmedCount] = await Promise.all([
          this.db.select({ value: count() }).from(schema.attendanceLogs),
          this.db.select({ value: count() }).from(schema.workers),
          this.db.select({ value: count() }).from(schema.attendanceLogs).where(eq(schema.attendanceLogs.status, 'pending')),
          // Count both 'auto' and 'confirmed' as successful identifications
          this.db.select({ value: count() }).from(schema.attendanceLogs).where(
            or(eq(schema.attendanceLogs.status, 'confirmed'), eq(schema.attendanceLogs.status, 'auto'))
          ),
      ]);

      return {
          totalWorkers: workersCount[0].value,
          todayLogs: logsCount[0].value, 
          unknown: unknownCount[0].value,
          confirmed: confirmedCount[0].value,
          debugMode: this.storageService.isDebugMode()
      };
  }

  @Get('media/:key')
  async getMedia(@Param('key') key: string, @Res() res: Response) {
      if (key.includes('..') || key.includes('/') || key.includes('\\')) {
          throw new BadRequestException('Invalid key');
      }

      try {
          const buffer = await this.storageService.getBuffer(key);
          const contentType = key.endsWith('.png') ? 'image/png' : 'image/jpeg';
          res.setHeader('Content-Type', contentType);
          res.send(buffer);
      } catch {
          res.status(404).send('Not found');
      }
  }

  @Get('logs')
  async getLogs(@Query('limit') limit = '50') {
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 500);
    return await this.db.select({
        id: schema.attendanceLogs.id,
        timestamp: schema.attendanceLogs.timestamp,
        status: schema.attendanceLogs.status,
        imageUrl: schema.attendanceLogs.imageUrl,
        cropUrl: schema.attendanceLogs.cropUrl,
        workerName: schema.workers.name,
        company: schema.workers.company,
        confidence: schema.attendanceLogs.metadata
    })
    .from(schema.attendanceLogs)
    .leftJoin(schema.workers, eq(schema.attendanceLogs.workerId, schema.workers.id))
    .orderBy(desc(schema.attendanceLogs.timestamp))
    .limit(parsedLimit);
  }

  @Get('unknowns')
  async getUnknowns() {
      return await this.db.select()
          .from(schema.attendanceLogs)
          .where(eq(schema.attendanceLogs.status, 'pending'))
          .orderBy(desc(schema.attendanceLogs.timestamp))
          .limit(100);
  }

  @Post('unknowns/:id/register')
  async registerUnknown(@Param('id', ParseIntPipe) id: number, @Body() body: RegisterUnknownDto) {
      return await this.faceService.registerUnknownLog(id, body.name, body.company);
  }

  @Post('unknowns/:id/ignore')
  async ignoreUnknown(@Param('id', ParseIntPipe) id: number) {
      return await this.faceService.ignoreUnknownLog(id);
  }

  @Get('workers')
  async getWorkers() {
      return await this.db.select().from(schema.workers).orderBy(desc(schema.workers.createdAt));
  }

  @Post('workers')
  async createWorker(@Body() body: CreateWorkerDto) {
      return await this.db.insert(schema.workers).values({ 
          name: sanitizeName(body.name), 
          company: body.company ? sanitizeName(body.company) : undefined
      }).returning();
  }

  @Post('workers/:id/faces')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFace(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: MulterFile) {
      if (!file) throw new BadRequestException('No file uploaded');
      await this.faceService.addFaceToWorker(id, file.buffer, file.originalname);
      return { status: 'uploaded' };
  }
}
