import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { WAHA_WEBHOOKS } from '@waha/structures/webhooks';
import {
  getNestJSLogLevels,
  getPinoLogLevel,
  getPinoTransport,
} from '@waha/utils/logging';
import { json, urlencoded } from 'express';
import { Logger as NestJSPinoLogger } from 'nestjs-pino';
import { LoggerErrorInterceptor } from 'nestjs-pino';
import { Logger } from 'pino';
import pino from 'pino';

import { WhatsappConfigService } from './config.service';
import { AppModuleCore } from './core/app.module.core';
import { SwaggerConfiguratorCore } from './core/SwaggerConfiguratorCore';
import { AllExceptionsFilter } from './nestjs/AllExceptionsFilter';
import { getWAHAVersion, VERSION, WAHAVersion } from './version';
import { loadESMModules } from '@waha/vendor/esm';
import { setGlobalDispatcher, Agent } from 'undici';

setGlobalDispatcher(new Agent({ connect: { family: 4 } }));

const logger: Logger = pino({
  level: getPinoLogLevel(),
  transport: getPinoTransport(),
}).child({ name: 'Bootstrap' });

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  if (err instanceof Error) {
    logger.error(err.stack);
  }
});
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise);
  if (reason instanceof Error) {
    logger.error(reason.stack);
  } else {
    logger.error('Unhandled rejection reason:', reason);
  }
});
logger.info('NODE - Catching unhandled rejections and exceptions enabled');

process.on('SIGINT', () => {
  logger.info('SIGINT received');
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
});

async function loadModules(): Promise<typeof AppModuleCore> {
  await loadESMModules();

  const version = getWAHAVersion();
  if (version === WAHAVersion.CORE) {
    const { AppModuleCore } = await import('./core/app.module.core');
    return AppModuleCore;
  }
  // Ignore if it's a core version - there's no plus module
  // @ts-ignore
  const { AppModulePlus } = await import('./plus/app.module.plus');
  // @ts-ignore
  return AppModulePlus;
}

async function bootstrap() {
  const version = getWAHAVersion();
  logger.info(`WAHA (WhatsApp HTTP API) - Running ${version} version...`);
  const AppModule = await loadModules();
  const httpsOptions = AppModule.getHttpsOptions(logger);
  const app = await NestFactory.create(AppModule, {
    logger: getNestJSLogLevels(),
    httpsOptions: httpsOptions,
    bufferLogs: true,
    forceCloseConnections: true,
  });
  app.useLogger(app.get(NestJSPinoLogger));

  // Print the original stack, not pino one
  // https://github.com/iamolegga/nestjs-pino?tab=readme-ov-file#expose-stack-trace-and-error-class-in-err-property
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();
  // Ideally, we should apply it globally.
  // but for now we added it ValidationPipe on Controller or endpoint level
  // app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Allow sending big body - for images and attachments
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: false }));
  app.useWebSocketAdapter(new WsAdapter(app));

  // Configure swagger
  const swaggerConfigurator = new SwaggerConfiguratorCore(app);
  swaggerConfigurator.configure(WAHA_WEBHOOKS);

  AppModule.appReady(app, logger);
  app.enableShutdownHooks();
  const config = app.get(WhatsappConfigService);
  // Bind explicitly to 0.0.0.0 so the HTTP server accepts IPv4 traffic.
  // When host is omitted, Node may bind to "::1" (IPv6 loopback) on some
  // platforms, which makes internal axios calls to "http://localhost:3000"
  // fail to connect (localhost resolves to 127.0.0.1 and IPv4 is refused).
  await app.listen(config.port, '0.0.0.0');
  logger.info(`WhatsApp HTTP API is running on: ${await app.getUrl()}`);
  logger.info(VERSION, 'Environment');
}

bootstrap().catch((error) => {
  logger.error(error, `Failed to start WAHA: ${error}`);
  // @ts-ignore
  logger.error(error.stack);
  process.exit(1);
});
