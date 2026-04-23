import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SmartBotModule } from './smart-bot.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(SmartBotModule, { rawBody: true });
  await app.listen(process.env.PORT || 3001);
  logger.log(`Smart Bot is running on: ${await app.getUrl()}`);
}
bootstrap();
