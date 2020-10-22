import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: process.env.DEBUG != undefined ? ['log', 'debug', 'error', 'verbose', 'warn'] :
            ['log', 'error', 'warn'],
    });

    app.enableShutdownHooks();
    const options = new DocumentBuilder()
        .setTitle('WhatsApp HTTP API')
        .setDescription('WhatsApp HTTP API that you can configure in a click')
        .setVersion('1.0')
        .addTag('device', 'Device information')
        .addTag('chatting', 'Chat methods')
        .addApiKey({
            type: 'apiKey',
                description: 'Your secret key',
                name: 'X-VENOM-TOKEN'
            }
        )
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('', app, document);

    await app.listen(3000);
    console.log(`WhatsApp HTTP API is running on: ${await app.getUrl()}`);
}

bootstrap();
