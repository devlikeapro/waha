import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { IAppService } from '@waha/apps/app_sdk/services/IAppService';
import { CacheForConfig } from '@waha/apps/chatwoot/cache/ConversationCache';
import { CHATWOOT_CUSTOM_ATTRIBUTES } from '@waha/apps/chatwoot/const';
import { ChatWootAppConfig } from '@waha/apps/chatwoot/dto/config.dto';
import { ChatWootScheduleService } from '@waha/apps/chatwoot/services/ChatWootScheduleService';
import { ChatWootWAHAQueueService } from '@waha/apps/chatwoot/services/ChatWootWAHAQueueService';
import { App } from '@waha/apps/chatwoot/storage';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { DIContainer } from '../di/DIContainer';

import { TKey } from '@waha/apps/chatwoot/i18n/templates';
import { session } from 'passport';
import { i18n } from '@waha/apps/chatwoot/i18n';

@Injectable()
export class ChatWootAppService implements IAppService {
  constructor(
    private chatWootWAHAQueueService: ChatWootWAHAQueueService,
    private chatWootScheduleService: ChatWootScheduleService,
    @InjectPinoLogger('ChatWootAppService')
    protected logger: PinoLogger,
  ) {}

  validate(app: App<ChatWootAppConfig>): void {
    if (!i18n.has(app.config.locale)) {
      throw new UnprocessableEntityException(
        `Unknown '${app.config.locale}' locale in 'config.local'`,
      );
    }
  }

  async beforeCreated(app: App<ChatWootAppConfig>) {
    await this.setupCustomAttributes(app);
    await this.sendConnectedMessage(app);
  }

  async beforeEnabled(
    savedApp: App<ChatWootAppConfig>,
    newApp: App<ChatWootAppConfig>,
  ): Promise<void> {
    // Enabling -> behave like created
    await this.beforeCreated(newApp);
    return;
  }

  async beforeDisabled(
    savedApp: App<ChatWootAppConfig>,
    newApp: App<ChatWootAppConfig>,
  ): Promise<void> {
    // Disabling -> behave like deleted
    await this.beforeDeleted(savedApp);
    return;
  }

  async beforeUpdated(
    savedApp: App<ChatWootAppConfig>,
    newApp: App<ChatWootAppConfig>,
  ) {
    const isTheSameUrl = savedApp.config.url === newApp.config.url;
    const isTheSameInboxId = savedApp.config.inboxId === newApp.config.inboxId;
    const isTheSameInbox = isTheSameUrl && isTheSameInboxId;
    if (isTheSameInbox) {
      await this.setupCustomAttributes(newApp);
      await this.sendUpdatedMessage(newApp);
    } else {
      this.sendDisconnectedMessage(savedApp).catch((err) => {
        this.logger.error(
          'Error sending disconnected message to ChatWoot - ' + err,
        );
      });
      await this.setupCustomAttributes(newApp);
      await this.sendConnectedMessage(newApp);
    }
  }

  async beforeDeleted(app: App<ChatWootAppConfig>): Promise<void> {
    await this.chatWootScheduleService.unschedule(app.id, app.session);
    this.cleanCache(app);
    this.sendDisconnectedMessage(app).catch((err) => {
      this.logger.error(
        'Error sending disconnected message to ChatWoot - ' + err,
      );
    });
  }

  private async sendConnectedMessage(app: App<ChatWootAppConfig>) {
    const di = new DIContainer(0, app.config, this.logger, null);
    const repo = di.ContactConversationService();
    const conversation = await repo.InboxNotifications();
    const welcome = di
      .Locale()
      .key(TKey.APP_CONNECTED_MESSAGE)
      .r({ name: app.session });
    await conversation.incoming(welcome);
  }

  private async sendDisconnectedMessage(app: App<ChatWootAppConfig>) {
    const di = new DIContainer(0, app.config, this.logger, null);
    const repo = di.ContactConversationService();
    const conversation = await repo.InboxNotifications();
    const disconnected = di
      .Locale()
      .key(TKey.APP_DISCONNECTED_MESSAGE)
      .r({ name: app.session });
    await conversation.incoming(disconnected);
  }

  private async sendUpdatedMessage(app: App<ChatWootAppConfig>) {
    const di = new DIContainer(0, app.config, this.logger, null);
    const repo = di.ContactConversationService();
    const conversation = await repo.InboxNotifications();
    const updated = di
      .Locale()
      .key(TKey.APP_UPDATED_MESSAGE)
      .r({ name: app.session });
    await conversation.incoming(updated);
  }

  beforeSessionStart(app: App<ChatWootAppConfig>, session: WhatsappSession) {
    this.chatWootWAHAQueueService.listenEvents(app.id, session);
  }

  afterSessionStart(app: App<ChatWootAppConfig>, session: WhatsappSession) {
    this.chatWootScheduleService.schedule(app.id, session.name).catch((err) => {
      this.logger.error('Error scheduling session for ChatWoot');
      this.logger.error(err, err.stack);
    });
  }

  private async setupCustomAttributes(app: App<ChatWootAppConfig>) {
    const di = new DIContainer(0, app.config, this.logger, null);
    const service = di.CustomAttributesService();
    await service.upsert(CHATWOOT_CUSTOM_ATTRIBUTES);
  }

  private cleanCache(app: App<ChatWootAppConfig>) {
    const cache = CacheForConfig(app.config);
    cache.clean();
  }
}
