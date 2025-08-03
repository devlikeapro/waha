import ChatwootClient from '@figuro/chatwoot-sdk';
import { AxiosLogging } from '@waha/apps/app_sdk/AxiosLogging';
import { ILogger } from '@waha/apps/app_sdk/ILogger';
import { ContactAPI } from '@waha/apps/chatwoot/client/ContactAPI';
import { ContactConversationService } from '@waha/apps/chatwoot/client/ContactConversationService';
import { ConversationAPI } from '@waha/apps/chatwoot/client/ConversationAPI';
import { CustomAttributesAPI } from '@waha/apps/chatwoot/client/CustomAttributesAPI';
import { ChatWootInboxAPI } from '@waha/apps/chatwoot/client/interfaces';
import { ChatWootAppConfig } from '@waha/apps/chatwoot/dto/config.dto';
import { ChatWootErrorReporter } from '@waha/apps/chatwoot/error/ChatWootErrorReporter';
import { Locale } from '@waha/apps/chatwoot/locale';
import { WAHASelf } from '@waha/apps/chatwoot/session/WAHASelf';
import {
  ChatwootMessageRepository,
  MessageMappingRepository,
  MessageMappingService,
  WhatsAppMessageRepository,
} from '@waha/apps/chatwoot/storage';
import { Job } from 'bullmq';
import { Knex } from 'knex';

/**
 * Dependency Injection Container for ChatWoot
 * Manages the creation and caching of various clients and repositories
 */
export class DIContainer {
  private accountAPI: ChatwootClient;
  private inboxAPI: ChatWootInboxAPI;
  private contactAPI: ContactAPI;
  private conversationAPI: ConversationAPI;
  private contactConversationService: ContactConversationService;
  private locale: Locale;
  private messageMappingService: MessageMappingService;
  private wahaSelf: WAHASelf;

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

  public Locale(): Locale {
    if (!this.locale) {
      this.locale = new Locale(this.config.locale);
    }
    return this.locale;
  }

  /**
   * Gets the AccountAPI client
   * @returns ChatwootClient instance
   */
  public AccountAPI(): ChatwootClient {
    if (!this.accountAPI) {
      this.accountAPI = new ChatwootClient({
        config: {
          basePath: this.config.url,
          with_credentials: true,
          credentials: 'include',
          token: this.config.accountToken,
        },
      });
    }
    return this.accountAPI;
  }

  /**
   * Gets the InboxAPI client
   * @returns ChatWootInboxAPI instance
   */
  public InboxAPI(): ChatWootInboxAPI {
    if (!this.inboxAPI) {
      const chatwootClientAPI = new ChatwootClient({
        config: {
          basePath: this.config.url,
          with_credentials: true,
          credentials: 'include',
          token: this.config.inboxIdentifier,
        },
      });
      this.inboxAPI = chatwootClientAPI.client as ChatWootInboxAPI;
    }
    return this.inboxAPI;
  }

  /**
   * Gets the ContactAPI
   * @returns ContactAPI instance
   */
  private ContactAPI(): ContactAPI {
    if (!this.contactAPI) {
      this.contactAPI = new ContactAPI(
        this.config,
        this.AccountAPI(),
        this.InboxAPI(),
        this.logger,
      );
    }
    return this.contactAPI;
  }

  /**
   * Gets the ConversationAPI
   * @returns ConversationAPI instance
   */
  private ConversationAPI(): ConversationAPI {
    if (!this.conversationAPI) {
      this.conversationAPI = new ConversationAPI(
        this.config,
        this.InboxAPI(),
        this.logger,
      );
    }
    return this.conversationAPI;
  }

  /**
   * Gets the ContactConversationService
   * @returns ContactConversationService instance
   */
  public ContactConversationService(): ContactConversationService {
    if (!this.contactConversationService) {
      this.contactConversationService = new ContactConversationService(
        this.config,
        this.ContactAPI(),
        this.ConversationAPI(),
        this.AccountAPI(),
        this.logger,
        this.Locale(),
      );
    }
    return this.contactConversationService;
  }

  private ChatwootMessageRepository(): ChatwootMessageRepository {
    return new ChatwootMessageRepository(this.Knex(), this.AppPk());
  }

  private WhatsAppMessageRepository(): WhatsAppMessageRepository {
    return new WhatsAppMessageRepository(this.Knex(), this.AppPk());
  }

  private MessageMappingRepository(): MessageMappingRepository {
    return new MessageMappingRepository(this.Knex(), this.AppPk());
  }

  public MessageMappingService(): MessageMappingService {
    if (!this.messageMappingService) {
      this.messageMappingService = new MessageMappingService(
        this.Knex(),
        this.WhatsAppMessageRepository(),
        this.ChatwootMessageRepository(),
        this.MessageMappingRepository(),
      );
    }
    return this.messageMappingService;
  }

  public ChatWootErrorReporter(job: Job): ChatWootErrorReporter {
    return new ChatWootErrorReporter(this.Logger(), job, this.Locale());
  }

  /**
   * Gets the WAHASelf instance
   * @returns WAHASelf instance
   */
  public WAHASelf(): WAHASelf {
    if (!this.wahaSelf) {
      this.wahaSelf = new WAHASelf();
      const logging = new AxiosLogging(this.Logger());
      logging.applyTo(this.wahaSelf.client);
    }
    return this.wahaSelf;
  }

  public CustomAttributesAPI() {
    return new CustomAttributesAPI(this.config, this.AccountAPI());
  }

  public isServerCommandsDisabled(): boolean {
    return this.config.disableServerCommands || false;
  }
}
