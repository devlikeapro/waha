import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {WhatsappConfigService} from "./config.service";
import {AllExceptionsFilter} from "./api/exception.filter";
import {getWAHAVersion, VERSION, WAHAVersion} from "./version";

async function getAppModule() {
    const version = getWAHAVersion()
    console.log(`WAHA (WhatsApp HTTP API) - Running ${version} version...`)

    if (version === WAHAVersion.CORE) {
        const {AppModuleCore} = await import("./core/app.module.core")
        return AppModuleCore
    }
    const {AppModulePlus} = await import("./plus/app.module.plus")
    return AppModulePlus
}

async function bootstrap() {
    const AppModule = await getAppModule()
    const app = await NestFactory.create(AppModule, {
        logger: process.env.DEBUG != undefined ? ['log', 'debug', 'error', 'verbose', 'warn'] :
            ['log', 'error', 'warn'],
    });

    app.enableShutdownHooks();
    app.useGlobalFilters(new AllExceptionsFilter());
    const options = new DocumentBuilder()
        .setTitle('WAHA - WhatsApp HTTP API')
        .setDescription('WhatsApp HTTP API that you can configure in a click!')
        .setExternalDoc("Documentation", "https://waha.devlike.pro/")
        .setVersion(VERSION.version)
        .addTag('sessions', 'Control your WhatsApp sessions')
        .addTag('screenshot', 'Get screenshot of WhatsApp and show QR code')
        .addTag('chatting', 'Chat methods')
        .addTag('other', 'Other endpoints')
        .addApiKey({
                type: 'apiKey',
                description: 'Your secret api key',
                name: 'X-Api-Key'
            }
        )
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('', app, document);

    const config = app.get(WhatsappConfigService);
    await app.listen(config.port);
    console.log(`WhatsApp HTTP API is running on: ${await app.getUrl()}`);
}

bootstrap();
