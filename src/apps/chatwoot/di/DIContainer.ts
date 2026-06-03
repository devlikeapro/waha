import ChatwootClient from '@figuro/chatwoot-sdk';
import * as lodash from 'lodash';
import { AxiosLogging } from '@waha/apps/app_sdk/AxiosLogging';
import { ILogger } from '@waha/apps/app_sdk/ILogger';
import { ContactService } from '@waha/apps/chatwoot/client/ContactService';
import { ContactConversationService } from '@waha/apps/chatwoot/client/ContactConversationService';
import { ConversationService } from '@waha/apps/chatwoot/client/ConversationService';
import { CustomAttributesService } from '@waha/apps/chatwoot/client/CustomAttributesService';
import { ChatWootInboxAPI } from '@waha/apps/chatwoot/client/interfaces';
import {
  ChatWootAppConfig,
  ChatWootConfig,
  DEFAULT_LOCALE,
  LinkPreview,
} from '@waha/apps/chatwoot/dto/config.dto';
import { ChatWootErrorReporter } from '@waha/apps/chatwoot/error/ChatWootErrorReporter';
import { Locale } from '@waha/apps/chatwoot/i18n/locale';
import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import {
  ChatwootMessageRepository,
  MessageMappingRepository,
  MessageMappingService,
  WhatsAppMessageRepository,
} from '@waha/apps/chatwoot/storage';
import { Job } from 'bullmq';
import { Knex } from 'knex';
import { i18n } from '@waha/apps/chatwoot/i18n';
import { CacheSync } from '@waha/utils/Cache';
import {
  ConversationSelector,
  ConversationSort,
} from '@waha/apps/chatwoot/services/ConversationSelector';
import { Auth } from '@waha/core/auth/config';

/**
 * Dependency Injection Container for ChatWoot
 * Manages the creation and caching of various clients and repositories
 */
export class DIContainer {
  /**
   * Creates a new DIContainer with the given configuration
   */
  constructor(
    private readonly appPk: number,
    private readonly config: ChatWootAppConfig,
    private readonly logger: ILogger,
    private readonly knex: Knex,
  ) {}

  public Logger(): ILogger {
    return this.logger;
  }

  private AppPk() {
    if (!this.appPk) {
      throw new Error('AppPk not set or 0');
    }
    return this.appPk;
  }

  private Knex() {
    if (!this.knex) {
      throw new Error('Knex not set');
    }
    return this.knex;
  }

  @CacheSync()
  public Locale(): Locale {
    let locale = i18n.locale(this.config.locale || DEFAULT_LOCALE);
    locale = locale.override(this.ChatWootConfig().templates);
    return locale;
  }

  /**
   * Gets the AccountAPI client
   * @returns ChatwootClient instance
   */
  @CacheSync()
  public AccountAPI(): ChatwootClient {
    return new ChatwootClient({
      config: {
        basePath: this.config.url,
        with_credentials: true,
        credentials: 'include',
        token: this.config.accountToken,
      },
    });
  }

  /**
   * Gets the InboxAPI client
   * @returns ChatWootInboxAPI instance
   */
  @CacheSync()
  public InboxAPI(): ChatWootInboxAPI {
    const chatwootClientAPI = new ChatwootClient({
      config: {
        basePath: this.config.url,
        with_credentials: true,
        credentials: 'include',
        token: this.config.inboxIdentifier,
      },
    });
    return chatwootClientAPI.client as ChatWootInboxAPI;
  }

  /**
   * Gets the ContactService
   * @returns ContactService instance
   */
  @CacheSync()
  public ContactService(): ContactService {
    return new ContactService(
      this.config,
      this.AccountAPI(),
      this.InboxAPI(),
      this.logger,
    );
  }

  @CacheSync()
  public ConversationSelector() {
    const config = this.ChatWootConfig();
    return new ConversationSelector({
      sort: config.conversations.sort,
      status: config.conversations.status,
      inboxId: this.config.inboxId,
    });
  }

  /**
   * Gets the ConversationService
   * @returns ConversationService instance
   */
  @CacheSync()
  public ConversationService(): ConversationService {
    return new ConversationService(
      this.config,
      this.AccountAPI(),
      this.InboxAPI(),
      this.ConversationSelector(),
      this.logger,
    );
  }

  /**
   * Gets the ContactConversationService
   * @returns ContactConversationService instance
   */
  @CacheSync()
  public ContactConversationService(): ContactConversationService {
    return new ContactConversationService(
      this.config,
      this.ContactService(),
      this.ConversationService(),
      this.AccountAPI(),
      this.logger,
      this.Locale(),
    );
  }

  @CacheSync()
  private ChatwootMessageRepository(): ChatwootMessageRepository {
    return new ChatwootMessageRepository(this.Knex(), this.AppPk());
  }

  @CacheSync()
  private WhatsAppMessageRepository(): WhatsAppMessageRepository {
    return new WhatsAppMessageRepository(this.Knex(), this.AppPk());
  }

  @CacheSync()
  private MessageMappingRepository(): MessageMappingRepository {
    return new MessageMappingRepository(this.Knex(), this.AppPk());
  }

  @CacheSync()
  public MessageMappingService(): MessageMappingService {
    return new MessageMappingService(
      this.Knex(),
      this.WhatsAppMessageRepository(),
      this.ChatwootMessageRepository(),
      this.MessageMappingRepository(),
    );
  }

  public ChatWootErrorReporter(job: Job): ChatWootErrorReporter {
    return new ChatWootErrorReporter(this.Logger(), job, this.Locale());
  }

  /**
   * Gets the WAHASelf instance
   * @returns WAHASelf instance
   */
  @CacheSync()
  public WAHASelf(): WAHASelf {
    const self = new WAHASelf(Auth.keyplain.value);
    const logging = new AxiosLogging(this.Logger());
    logging.applyTo(self.client);
    return self;
  }

  @CacheSync()
  public CustomAttributesService() {
    return new CustomAttributesService(this.config, this.AccountAPI());
  }

  @CacheSync()
  public ChatWootConfig(): ChatWootConfig {
    return ChatWootConfigDefaults(this.config);
  }
}

/**
 * Applies default values to the ChatWoot configuration
 */
export function ChatWootConfigDefaults(
  config: ChatWootAppConfig,
): ChatWootConfig {
  const defaults: ChatWootConfig = {
    templates: {},
    linkPreview: LinkPreview.OFF,
    commands: {
      server: true,
      queue: false,
    },
    conversations: {
      sort: ConversationSort.created_newest,
      status: null,
      markAsRead: true,
    },
  };
  return lodash.defaultsDeep({}, config, defaults);
}
