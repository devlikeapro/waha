import { RegisterAppQueue } from '@waha/apps/app_sdk/BullUtils';
import {
  ExponentialRetriesJobOptions,
  JobRemoveOptions,
  merge,
  NoRetriesJobOptions,
} from '@waha/apps/app_sdk/constants';
import { MessageCleanupConsumer } from '@waha/apps/chatwoot/consumers/scheduled/message.cleanup';
import { ChatWootAppService } from '@waha/apps/chatwoot/services/ChatWootAppService';
import * as lodash from 'lodash';

import { ChatwootLocalesController } from './api/chatwoot.locales.controller';
import { ChatwootWebhookController } from './api/chatwoot.webhook.controller';
import { ChatWootInboxCommandsConsumer } from './consumers/inbox/commands';
import { ChatWootInboxMessageCreatedConsumer } from './consumers/inbox/message_created';
import { ChatWootInboxMessageDeletedConsumer } from './consumers/inbox/message_deleted';
import { ChatWootInboxMessageUpdatedConsumer } from './consumers/inbox/message_updated';
import { QueueName } from './consumers/QueueName';
import { CheckVersionConsumer } from './consumers/scheduled/check.version';
import { WAHAMessageAnyConsumer } from './consumers/waha/message.any';
import { WAHAMessageEditedConsumer } from './consumers/waha/message.edited';
import { WAHAMessageReactionConsumer } from './consumers/waha/message.reaction';
import { WAHAMessageRevokedConsumer } from './consumers/waha/message.revoked';
import { WAHAMessageReadConsumer } from './consumers/waha/message.read';
import { WAHASessionStatusConsumer } from './consumers/waha/session.status';
import { ChatWootQueueService } from './services/ChatWootQueueService';
import { ChatWootScheduleService } from './services/ChatWootScheduleService';
import { ChatWootWAHAQueueService } from './services/ChatWootWAHAQueueService';
import { ChatWootConversationCreatedConsumer } from './consumers/inbox/conversation_created';
import { ChatWootConversationStatusChangedConsumer } from '@waha/apps/chatwoot/consumers/inbox/conversation_status_changed';

const CONTROLLERS = [ChatwootWebhookController, ChatwootLocalesController];

const IMPORTS = lodash.flatten([
  RegisterAppQueue({
    name: QueueName.SCHEDULED_MESSAGE_CLEANUP,
    defaultJobOptions: merge(ExponentialRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.SCHEDULED_CHECK_VERSION,
    defaultJobOptions: merge(NoRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.WAHA_MESSAGE_ANY,
    defaultJobOptions: merge(ExponentialRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.WAHA_MESSAGE_REACTION,
    defaultJobOptions: merge(ExponentialRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.WAHA_MESSAGE_EDITED,
    defaultJobOptions: merge(ExponentialRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.WAHA_MESSAGE_REVOKED,
    defaultJobOptions: merge(ExponentialRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.WAHA_MESSAGE_READ,
    defaultJobOptions: merge(ExponentialRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.WAHA_SESSION_STATUS,
    defaultJobOptions: merge(ExponentialRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.INBOX_MESSAGE_CREATED,
    defaultJobOptions: merge(ExponentialRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.INBOX_MESSAGE_UPDATED,
    defaultJobOptions: merge(ExponentialRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.INBOX_CONVERSATION_CREATED,
    defaultJobOptions: merge(NoRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.INBOX_CONVERSATION_STATUS_CHANGED,
    defaultJobOptions: merge(NoRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.INBOX_MESSAGE_DELETED,
    defaultJobOptions: merge(ExponentialRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.INBOX_COMMANDS,
    defaultJobOptions: merge(NoRetriesJobOptions, JobRemoveOptions),
  }),
]);

const PROVIDERS = [
  ChatWootInboxMessageCreatedConsumer,
  ChatWootInboxMessageUpdatedConsumer,
  ChatWootInboxMessageDeletedConsumer,
  // Conversation events
  ChatWootConversationCreatedConsumer,
  ChatWootConversationStatusChangedConsumer,
  ChatWootInboxCommandsConsumer,
  WAHASessionStatusConsumer,
  WAHAMessageAnyConsumer,
  WAHAMessageReactionConsumer,
  WAHAMessageEditedConsumer,
  WAHAMessageRevokedConsumer,
  WAHAMessageReadConsumer,
  MessageCleanupConsumer,
  CheckVersionConsumer,
  ChatWootWAHAQueueService,
  ChatWootQueueService,
  ChatWootScheduleService,
  ChatWootAppService,
];

export const ChatWootExports = {
  providers: PROVIDERS,
  imports: IMPORTS,
  controllers: CONTROLLERS,
};
