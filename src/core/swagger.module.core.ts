import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { WhatsappConfigService } from '../config.service';
import { VERSION } from '../version';

export class SwaggerModuleCore {
  configure(app: INestApplication) {
    this.setUpAuth(app);
    const builder = new DocumentBuilder();

    builder
      .setTitle('WAHA - WhatsApp HTTP API')
      .setDescription('WhatsApp HTTP API that you can run in a click!')
      .setExternalDoc('Documentation', 'https://waha.devlike.pro/')
      .setVersion(VERSION.version)
      .addTag('sessions', 'Control WhatsApp sessions')
      .addTag('screenshot', 'Get screenshot of WhatsApp and show QR code')
      .addTag('chatting', 'Chat methods')
      .addTag(
        'contacts',
        `Contacts methods.<br>
                Use phone number (without +) or phone number and \`@c.us\` at the end as \`contactId\`.<br>
                'E.g: \`12312312310\` OR \`12312312310@c.us\`<br>`,
      )
      .addTag('groups', `Groups methods.<br>`)
      .addTag(
        'presence',
        `Presence information. Available in <b>NOWEB</b> engine only.<br>`,
      )
      .addTag('other', 'Other methods')
      .addApiKey({
        type: 'apiKey',
        description: 'Your secret api key',
        name: 'X-Api-Key',
      });

    const config = app.get(WhatsappConfigService);
    if (config.getSwaggerAdvancedConfigEnabled()) {
      builder.addServer('{protocol}://{host}:{port}/{baseUrl}', '', {
        protocol: {
          default: 'http',
          enum: ['http', 'https'],
          description: 'The protocol used to access the server.',
        },
        host: {
          default: config.hostname,
          description: 'The hostname or IP address of the server.',
        },
        port: {
          default: config.port,
          description:
            'The port number on which the server is listening for requests',
        },
        baseUrl: {
          default: '',
          description:
            'The base URL path for all API endpoints. This can be used to group related endpoints together under a common path.',
        },
      });
    }

    const options = builder.build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('', app, document);
  }

  protected setUpAuth(app: INestApplication) {
    return undefined;
  }
}
