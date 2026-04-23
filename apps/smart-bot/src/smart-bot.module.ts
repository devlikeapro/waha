import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { WebhookController } from './controllers/webhook.controller';
import { WahaClientService } from './services/waha-client.service';
import { DatabaseModule } from './db/database.module';
import { AiService } from './services/ai.service';
import { DocumentService } from './services/document.service';
import { TwoFactorService } from './services/auth/two-factor.service';
import { BullModule } from '@nestjs/bullmq';
import { DocumentProcessor } from './processors/document.processor';
import { FaceProcessor } from './processors/face.processor';
import { RedisModule } from './common/redis/redis.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { StorageService } from './services/storage.service';
import { VisionService } from './services/vision.service';
import { FaceRecognitionService } from './services/face-recognition.service';
import { EveningReviewService } from './services/evening-review.service';
import { PendingCleanupService } from './services/pending-cleanup.service';
import { WahaThrottlerGuard } from './guards/waha-throttler.guard';
import { PrometheusModule, makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DashboardController } from './controllers/dashboard.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'dashboard'), // Adjust path based on build structure. In dist, it might be different. 
      // Development: apps/smart-bot/src/dashboard. 
      // We will copy this folder in build or just map it.
      // For now, assuming running from root or dist structure matches.
      // Actually, standard nest build doesn't copy assets by default unless configured.
      // Let's point to the source for dev mode or assume 'dist/apps/smart-bot/dashboard' if we add assets.
      // Better: Use absolute path for dev or specific folder.
      serveRoot: '/dashboard',
    }),
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
    TerminusModule,
    RedisModule, // Global Redis Module
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ([{
        ttl: 60000, // 1 minute
        limit: config.get('RATE_LIMIT', 20), // 20 msgs/min per user (Bot Loop Protection)
      }]),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          url: configService.get('REDIS_URL', 'redis://localhost:6379'),
        },
        defaultJobOptions: {
            attempts: 3, // Retry 3 times
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: true, // Auto-clean
            removeOnFail: false, // Keep failed jobs for DLQ inspection
        }
      }),
    }),
    BullModule.registerQueue({
      name: 'documents',
    }),
    BullModule.registerQueue({
      name: 'faces',
    }),
    HttpModule,
    DatabaseModule,
  ],
  controllers: [WebhookController, HealthController, DashboardController],
  providers: [
    WahaClientService, 
    AiService, 
    DocumentService,
    TwoFactorService,
    DocumentProcessor,
    FaceProcessor,
    StorageService,
    VisionService,
    FaceRecognitionService,
    EveningReviewService,
    PendingCleanupService,
    makeCounterProvider({
        name: 'waha_docs_processed_total',
        help: 'Total number of documents processed by type',
        labelNames: ['type'],
    }),
    {
      provide: APP_GUARD,
      useClass: WahaThrottlerGuard,
    }
  ],
})
export class SmartBotModule {}
