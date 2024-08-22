import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { Logger } from 'nestjs-pino';

import { WhatsappConfigService } from '../config.service';
import { VERSION } from '../version';
import { SwaggerConfigServiceCore } from './config/SwaggerConfigServiceCore';

export class SwaggerConfiguratorCore {
  protected logger: any;

  constructor(protected app: INestApplication) {
    this.logger = app.get(Logger);
  }

  get title() {
    return 'WAHA - WhatsApp HTTP API';
  }

  get description() {
    return (
      'WhatsApp HTTP API that you can run in a click!<br/>' +
      '<br/>' +
      'Learn more:' +
      '<ul>' +
      '<li><a href="https://waha.devlike.pro/" target="_blank">Documentation</a></li>' +
      '<li><a href="https://waha.devlike.pro/docs/how-to/engines/#features" target="_blank">Supported features in engines</a></li>' +
      '<li><a href="https://github.com/devlikeapro/waha" target="_blank">GitHub - WAHA Core</a></li>' +
      '<li><a href="https://github.com/devlikeapro/waha-plu' + // Separate line to pass pre-commit check
      's" target="_blank">GitHub - WAHA Plus</a></li>' +
      '<li><a href="/dashboard">WAHA Dashboard</a></li>' +
      '<li><a href="https://waha.devlike.pro/docs/how-to/waha-dashboard">WAHA Dashboard Documentation</a></li>' +
      '</ul>' +
      '<p>Support the project and get WAHA Plus version!</p>' +
      '<ul>' +
      '<li><a href="https://waha.devlike.pro/docs/how-to/plu' + // Separate line to pass pre-commit check
      's-version/" target="_blank">WAHA Plus</a></li>' +
      '<li><a href="https://patreon.com/wa_http_api/" target="_blank">Patreon</a></li>' +
      '<li><a href="https://boosty.to/wa-http-api/" target="_blank">Boosty</a></li>' +
      '<li><a href="https://portal.devlike.pro/" target="_blank">Patron Portal</a></li>' +
      '</ul>'
    );
  }

  get externalDocUrl() {
    return 'https://waha.devlike.pro/';
  }

  configure(webhooks: any[]) {
    const app = this.app;
    const builder = new DocumentBuilder();

    builder
      .setTitle(this.title)
      .setDescription(this.description)
      .setExternalDoc(this.title, this.externalDocUrl)
      .setVersion(VERSION.version)
      .addTag('🖥️ Sessions', 'Control WhatsApp sessions (accounts)')
      .addTag('🔑 Auth', 'Authentication')
      .addTag('🖼️ Screenshot', 'Get screenshot of WhatsApp and show QR code')
      .addTag('📤 Chatting', 'Chatting methods')
      .addTag('📢 Channels', 'Channels (newsletters) methods')
      .addTag(
        '🟢 Status',
        'Status (aka stories) methods. <b>NOWEB</b> engine only!',
      )
      .addTag('💬 Chats', `Chats methods`)
      .addTag(
        '👤 Contacts',
        `Contacts methods.<br>
                Use phone number (without +) or phone number and \`@c.us\` at the end as \`contactId\`.<br>
                'E.g: \`12312312310\` OR \`12312312310@c.us\`<br>`,
      )
      .addTag('👥 Groups', `Groups methods.<br>`)
      .addTag('✅ Presence', `Presence information`)
      .addTag(
        '🏷️ Labels',
        'Labels - available only for WhatsApp Business accounts',
      )
      .addTag('🔍 Observability', 'Other methods')
      .addTag('🗄️ Storage', 'Storage methods')
      .addApiKey({
        type: 'apiKey',
        description: 'Your secret api key',
        name: 'X-Api-Key',
      });

    const config = app.get(WhatsappConfigService);
    const swaggerConfig = app.get(SwaggerConfigServiceCore);
    if (swaggerConfig.advancedConfigEnabled) {
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

    const swaggerDocumentConfig = builder.build();
    const swaggerDocumentOptions = {
      extraModels: webhooks,
    };
    let document = SwaggerModule.createDocument(
      app,
      swaggerDocumentConfig,
      swaggerDocumentOptions,
    );
    document = this.configureWebhooks(document, webhooks);
    SwaggerModule.setup('', app, document, {
      customSiteTitle: this.title,
    });
  }

  private configureWebhooks(document: OpenAPIObject, supportedWebhooks) {
    document.openapi = '3.1.0';
    const webhooks = {};
    for (const webhook of supportedWebhooks) {
      const eventMetadata = Reflect.getMetadata(
        DECORATORS.API_MODEL_PROPERTIES,
        webhook.prototype,
        'event',
      );
      const event = new webhook().event;
      const schemaName = webhook.name;
      webhooks[event] = {
        post: {
          summary: eventMetadata.description,
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: `#/components/schemas/${schemaName}`,
                },
              },
            },
          },
          responses: {
            '200': {
              description:
                'Return a 200 status to indicate that the data was received successfully',
            },
          },
        },
      };
    }
    // @ts-ignore
    document.webhooks = webhooks;
    return document;
  }
}
