import { Processor } from '@nestjs/bullmq';
import * as lodash from 'lodash';
import { JOB_CONCURRENCY } from '@waha/apps/app_sdk/constants';
import { QueueName } from '@waha/apps/chatwoot/consumers/QueueName';
import { DIContainer } from '@waha/apps/chatwoot/di/DIContainer';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { RMutexService } from '@waha/modules/rmutex/rmutex.service';
import { Job, JobState } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';

import { ChatWootTaskConsumer } from '@waha/apps/chatwoot/consumers/task/base';
import { TKey } from '@waha/apps/chatwoot/i18n/templates';
import { WAHASessionAPI } from '@waha/apps/app_sdk/waha/WAHASelf';
import { WhatsAppContactInfo } from '@waha/apps/chatwoot/contacts/WhatsAppContactInfo';
import { ContactSortField } from '@waha/structures/contacts.dto';
import { SortOrder } from '@waha/structures/pagination.dto';
import {
  AvatarUpdateMode,
  ContactService,
  IsRawName,
  NameUpdateMode,
} from '@waha/apps/chatwoot/client/ContactService';
import { Conversation } from '@waha/apps/chatwoot/client/Conversation';
import { Locale } from '@waha/apps/chatwoot/i18n/locale';
import { ILogger } from '@waha/apps/app_sdk/ILogger';
import { JobLink } from '@waha/apps/app_sdk/JobUtils';
import { sleep } from '@waha/utils/promiseTimeout';
import { isJidGroup, isLidUser, isPnUser } from '@waha/core/utils/jids';
import {
  ArrayPaginator,
  PaginatorParams,
} from '@waha/apps/app_sdk/waha/Paginator';
import { EngineHelper } from '@waha/apps/chatwoot/waha';

export interface ContactsPullOptions {
  batch: number;
  progress: number | null;
  avatar: null | 'if-missing' | 'update';
  updateNames: NameUpdateMode;
  attributes: boolean;
  contacts: {
    groups: boolean;
    lids: boolean;
  };
  delay: {
    contact: number;
    batch: number;
  };
}

/**
 * Task consumer that pulls WhatsApp contacts into ChatWoot
 * Runs in batches to keep the job resumable and observable in ChatWoot
 */
@Processor(QueueName.TASK_CONTACTS_PULL, { concurrency: JOB_CONCURRENCY })
export class TaskContactsPullConsumer extends ChatWootTaskConsumer {
  constructor(manager: SessionManager, log: PinoLogger, rmutex: RMutexService) {
    super(manager, log, rmutex, TaskContactsPullConsumer.name);
  }

  protected ErrorHeaderKey(): TKey {
    return null;
  }

  /**
   * Process the contact pull job
   * Streams batches of contacts from WAHA into ChatWoot storage
   */
  protected async Process(
    container: DIContainer,
    job: Job,
    signal?: AbortSignal,
  ): Promise<any> {
    const options: ContactsPullOptions = job.data.options;
    const locale = container.Locale();
    const waha = container.WAHASelf();
    const session = new WAHASessionAPI(job.data.session, waha);
    const conversation = this.conversationForReport(container, job.data.body);
    const handler = new ContactsPullHandler(
      signal,
      container.Logger(),
      conversation,
      session,
      locale,
      container.ContactService(),
    );
    return await handler.handle(options, job);
  }
}

interface Progress {
  created: number;
  updated: number;
  renamed: number;
  skipped: number;
  errors: number;
  avatar: {
    updated: number;
  };
}

function total(progress: Progress) {
  return (
    progress.created + progress.updated + progress.skipped + progress.errors
  );
}

const NullProgress: Progress = {
  created: 0,
  updated: 0,
  renamed: 0,
  skipped: 0,
  errors: 0,
  avatar: {
    updated: 0,
  },
};

class ContactsPullHandler {
  private activity: TaskActivity;

  constructor(
    private signal: AbortSignal,
    private logger: ILogger,
    private conversation: Conversation,
    private session: WAHASessionAPI,
    private l: Locale,
    private contactService: ContactService,
  ) {
    this.activity = new TaskActivity(this.l, this.conversation);
  }

  async handle(options: ContactsPullOptions, job) {
    const batch = options.batch;
    let progress = lodash.merge({}, NullProgress, job.progress);
    this.logger.debug(
      `Pulling contacts for session ${job.data.session} with batch size ${batch}...`,
    );
    if (lodash.isEqual(progress, NullProgress)) {
      await this.activity.started(progress);
    }

    const query = {
      sortBy: ContactSortField.ID,
      sortOrder: SortOrder.ASC,
      limit: batch,
      offset: 0,
    };
    const params: PaginatorParams = {
      processed: total(progress),
    };
    const paginator = new ArrayPaginator<any>(params);
    const contacts = paginator.iterate((processed: number) => {
      query.offset = processed;
      return this.session.getContacts(query, {
        signal: this.signal,
      });
    });

    for await (const contact of contacts) {
      this.signal.throwIfAborted();

      //
      // Show progress
      //
      const thetotal = total(progress);
      if (options.progress && thetotal) {
        if (thetotal % options.progress == 0) {
          await this.activity.progress(progress);
        }
      }
      // Delay on batch
      if (thetotal && options.delay.batch) {
        if (thetotal % batch == 0) {
          await sleep(options.delay.batch);
        }
      }

      // Process
      try {
        if (!EngineHelper.ContactIsMy(contact)) {
          progress.skipped += 1;
          await job.updateProgress(progress);
          continue;
        }
        const chatId = contact.id;
        if (isJidGroup(chatId)) {
          if (!options.contacts.groups) {
            this.logger.debug(`Skipping group contact ${chatId}...`);
            progress.skipped += 1;
            await job.updateProgress(progress);
            continue;
          }
        } else if (isLidUser(chatId)) {
          if (!options.contacts.lids) {
            this.logger.debug(`Skipping LID contact ${chatId}...`);
            progress.skipped += 1;
            await job.updateProgress(progress);
            continue;
          }
        } else if (!isPnUser(chatId)) {
          this.logger.info(`Skipping non-phone-number contact ${chatId}...`);
          progress.skipped += 1;
          await job.updateProgress(progress);
          continue;
        }

        this.logger.debug(`Pulling ${chatId}...`);
        const result = await this.pullOneContact(options, contact);
        progress.created += result.created;
        progress.updated += result.updated;
        progress.renamed += result.renamed;
        progress.avatar.updated += result.avatar.updated;
        this.logger.info(
          `Contact ${chatId}: created=${result.created}, updated=${result.updated}, renamed=${result.renamed}, avatar.updated=${result.avatar.updated}`,
        );
      } catch (e) {
        this.logger.error(`Error pulling contact ${contact.id}: ${e}`);
        progress.errors += 1;
      }
      // update progress before signal fails
      await job.updateProgress(progress);
      await sleep(options.delay.contact);
    }

    await this.activity.completed(progress);
  }

  private async pullOneContact(options: ContactsPullOptions, contact: any) {
    const contactInfo = WhatsAppContactInfo(this.session, contact.id, this.l);
    contactInfo.SetFetchedContact(contact);
    let [cwContact, created] =
      await this.contactService.findOrCreateContact(contactInfo);

    // Name
    let renamed = false;
    if (!created) {
      switch (options.updateNames) {
        case NameUpdateMode.ALWAYS: {
          const name = await contactInfo.SavedName();
          if (name) {
            renamed = await this.contactService.updateName(cwContact, name);
          }
          break;
        }
        case NameUpdateMode.IF_RAW: {
          const name = await contactInfo.SavedName();
          if (!name) {
            break;
          }
          // Replace only raw names, nobody typed them by hand
          const placeholders = [
            contactInfo.ChatId(),
            await contactInfo.JidId(),
            await contactInfo.LidId(),
            await contactInfo.PhoneNumberE164(),
            cwContact.data.phone_number,
            await contactInfo.PushName(),
          ];
          const current = cwContact.data.name ?? '';
          if (!IsRawName(current, placeholders)) {
            break;
          }
          renamed = await this.contactService.updateName(cwContact, name);
          break;
        }
      }
    }

    // Attributes
    if (options.attributes) {
      const attributes = await contactInfo.Attributes();
      await this.contactService.upsertCustomAttributes(
        cwContact.data,
        attributes,
      );
    }

    // Avatar
    let avatarUpdated = false;
    switch (options.avatar) {
      case 'if-missing':
        avatarUpdated = await this.contactService.updateAvatar(
          cwContact,
          contactInfo,
          AvatarUpdateMode.IF_MISSING,
        );
        break;
      case 'update':
        avatarUpdated = await this.contactService.updateAvatar(
          cwContact,
          contactInfo,
          AvatarUpdateMode.ALWAYS,
        );
        break;
    }

    return {
      created: created ? 1 : 0,
      updated: created ? 0 : 1,
      renamed: renamed ? 1 : 0,
      avatar: {
        updated: avatarUpdated ? 1 : 0,
      },
    };
  }
}

class TaskActivity {
  constructor(
    private l: Locale,
    private conversation: Conversation,
  ) {}

  public async started(progress: Progress) {
    await this.conversation.activity(
      this.l.r('task.contacts.started', { progress: progress }),
    );
  }

  public async progress(progress: Progress) {
    await this.conversation.activity(
      this.l.r('task.contacts.progress', { progress: progress }),
    );
  }

  /**
   * Final report
   */
  public async completed(progress: Progress) {
    await this.conversation.activity(
      this.l.r('task.contacts.completed', { progress: progress }),
    );
  }
}

export function ContactsPullStatusMessage(
  l: Locale,
  job: Job,
  state: JobState | 'unknown',
) {
  const details = JobLink(job);
  const progress = lodash.merge({}, NullProgress, job.progress);
  const payload = {
    error: state === 'failed' || state === 'unknown' || progress.errors > 0,
    state: lodash.capitalize(state ?? 'unknown'),
    progress: progress,
    details: details,
  };
  return l.r('task.contacts.status', payload);
}
