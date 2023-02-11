import {NestFactory} from '@nestjs/core';
import {WhatsappConfigService} from "./config.service";
import {AllExceptionsFilter} from "./api/exception.filter";
import {getWAHAVersion, VERSION, WAHAVersion} from "./version";
import {AppModuleCore} from "./core/app.module.core";
import {SwaggerModuleCore} from "./core/swagger.module.core";

async function loadModules(): Promise<[typeof AppModuleCore, typeof SwaggerModuleCore]> {
    const version = getWAHAVersion()
    console.log(`WAHA (WhatsApp HTTP API) - Running ${version} version...`)

    if (version === WAHAVersion.CORE) {
        const {AppModuleCore} = await import("./core/app.module.core")
        const {SwaggerModuleCore} = await import("./core/swagger.module.core")
        return [AppModuleCore, SwaggerModuleCore]
    }
    // Ignore if it's core version - there's no plus module
    // @ts-ignore
    const {AppModulePlus} = await import("./plus/app.module.plus")
    // @ts-ignore
    const {SwaggerModulePlus} = await import("./plus/swagger.module.plus")
    return [AppModulePlus, SwaggerModulePlus]
}

async function bootstrap() {
    const [AppModule, SwaggerModule] = await loadModules()
    const app = await NestFactory.create(AppModule, {
        logger: process.env.DEBUG != undefined ? ['log', 'debug', 'error', 'verbose', 'warn'] :
            ['log', 'error', 'warn'],
    });

    app.enableShutdownHooks();
    app.useGlobalFilters(new AllExceptionsFilter());

    // Configure swagger
    const swagger = new SwaggerModule()
    swagger.configure(app)

    const config = app.get(WhatsappConfigService);
    await app.listen(config.port);
    console.log(`WhatsApp HTTP API is running on: ${await app.getUrl()}`);
}

bootstrap();
