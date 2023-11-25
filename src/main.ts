import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';

import { AllExceptionsFilter } from './api/exception.filter';
import { WhatsappConfigService } from './config.service';
import { AppModuleCore } from './core/app.module.core';
import { SwaggerModuleCore } from './core/swagger.module.core';
import { getLogLevels } from './helpers';
import { WAHA_WEBHOOKS } from './structures/webhooks.dto';
import { getWAHAVersion, VERSION, WAHAVersion } from './version';

async function loadModules(): Promise<
  [typeof AppModuleCore, typeof SwaggerModuleCore]
> {
  const version = getWAHAVersion();
  console.log(`WAHA (WhatsApp HTTP API) - Running ${version} version...`);

  if (version === WAHAVersion.CORE) {
    const { AppModuleCore } = await import('./core/app.module.core');
    const { SwaggerModuleCore } = await import('./core/swagger.module.core');
    return [AppModuleCore, SwaggerModuleCore];
  }
  // Ignore if it's core version - there's no plus module
  // @ts-ignore
  const { AppModulePlus } = await import('./plus/app.module.plus');
  // @ts-ignore
  const { SwaggerModulePlus } = await import('./plus/swagger.module.plus');
  return [AppModulePlus, SwaggerModulePlus];
}

async function bootstrap() {
  const [AppModule, SwaggerModule] = await loadModules();
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(),
  });

  app.enableShutdownHooks();
  app.useGlobalFilters(new AllExceptionsFilter());

  // Allow to send big body - for images and attachments
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: false }));

  // Configure swagger
  const swagger = new SwaggerModule();
  swagger.configure(app, WAHA_WEBHOOKS);

  const config = app.get(WhatsappConfigService);
  await app.listen(config.port);
  console.log(`WhatsApp HTTP API is running on: ${await app.getUrl()}`);
  console.log(`Environment:`, VERSION);
}

bootstrap();
