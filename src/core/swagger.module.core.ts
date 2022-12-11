import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {INestApplication} from "@nestjs/common";
import {VERSION} from "../version";

export class SwaggerModuleCore {
    configure(app: INestApplication){
        this.setUpAuth(app)

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

    }
    protected setUpAuth(app: INestApplication) {
        return undefined
    }
}
