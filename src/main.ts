import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
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
import { WAHA_WEBHOOKS } from './structures/webhooks.dto';
import { getWAHAVersion, VERSION, WAHAVersion } from './version';

const logger: Logger = pino({
  level: getPinoLogLevel(),
  transport: getPinoTransport(),
}).child({ name: 'Bootstrap' });

logger.info('NODE - Catching unhandled rejection enabled');
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // @ts-ignore
  logger.error(reason.stack);
});
process.on('SIGINT', () => {
  logger.info('SIGINT received');
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
});

async function loadModules(): Promise<
  [typeof AppModuleCore, typeof SwaggerConfiguratorCore]
> {
  const version = getWAHAVersion();

  if (version === WAHAVersion.CORE) {
    const { AppModuleCore } = await import('./core/app.module.core');
    const { SwaggerConfiguratorCore } = await import(
      './core/SwaggerConfiguratorCore'
    );
    return [AppModuleCore, SwaggerConfiguratorCore];
  }
  // Ignore if it's core version - there's no plus module
  // @ts-ignore
  const { AppModulePlus } = await import('./plus/app.module.plus');
  // @ts-ignore
  const { SwaggerConfiguratorPlus } = await import('./plus/SwaggerConfiguratorPlus'); // prettier-ignore
  // @ts-ignore
  return [AppModulePlus, SwaggerConfiguratorPlus];
}

async function bootstrap() {
  const version = getWAHAVersion();
  logger.info(`WAHA (WhatsApp HTTP API) - Running ${version} version...`);
  const [AppModule, SwaggerModule] = await loadModules();
  const httpsOptions = AppModule.getHttpsOptions(logger);
  const app = await NestFactory.create(AppModule, {
    logger: getNestJSLogLevels(),
    httpsOptions: httpsOptions,
    bufferLogs: true,
  });
  app.useLogger(app.get(NestJSPinoLogger));

  // Print original stack, not pino one
  // https://github.com/iamolegga/nestjs-pino?tab=readme-ov-file#expose-stack-trace-and-error-class-in-err-property
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();
  // Ideally, we should apply it globally.
  // but for now we added it ValidationPipe on Controller or endpoint level
  // app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Allow to send big body - for images and attachments
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: false }));
  app.useWebSocketAdapter(new WsAdapter(app));

  // Configure swagger
  const swaggerConfigurator = new SwaggerModule(app);
  swaggerConfigurator.configure(WAHA_WEBHOOKS);

  AppModule.appReady(app, logger);
  app.enableShutdownHooks();
  const config = app.get(WhatsappConfigService);
  await app.listen(config.port);
  logger.info(`WhatsApp HTTP API is running on: ${await app.getUrl()}`);
  logger.info(VERSION, 'Environment');
}

bootstrap().catch((error) => {
  logger.error(error, `Failed to start WAHA: ${error}`);
  // @ts-ignore
  logger.error(error.stack);
  process.exit(1);
});
