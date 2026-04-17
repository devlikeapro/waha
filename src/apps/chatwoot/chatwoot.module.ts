import { RegisterAppQueue } from '@waha/apps/app_sdk/BullUtils';
import {
  ExponentialRetriesJobOptions,
  JobRemoveOptions,
  merge,
  NoRetriesJobOptions,
} from '@waha/apps/app_sdk/constants';
import { MessageCleanupConsumer } from '@waha/apps/chatwoot/consumers/scheduled/message.cleanup';
import { CheckTierConsumer } from '@waha/apps/chatwoot/consumers/scheduled/check.tier';
import { ChatWootAppService } from '@waha/apps/chatwoot/services/ChatWootAppService';
import * as lodash from 'lodash';

import { ChatwootLocalesController } from './api/chatwoot.locales.controller';
import { ChatwootWebhookController } from './api/chatwoot.webhook.controller';
import { ChatWootInboxCommandsConsumer } from './consumers/inbox/commands';
import { ChatWootInboxMessageCreatedConsumer } from './consumers/inbox/message_created';
import { ChatWootInboxMessageDeletedConsumer } from './consumers/inbox/message_deleted';
import { ChatWootInboxMessageUpdatedConsumer } from './consumers/inbox/message_updated';
import { FlowProducerName, QueueName } from './consumers/QueueName';
import { CheckVersionConsumer } from './consumers/scheduled/check.version';
import { WAHAMessageAnyConsumer } from './consumers/waha/message.any';
import { WAHAMessageEditedConsumer } from './consumers/waha/message.edited';
import { WAHAMessageReactionConsumer } from './consumers/waha/message.reaction';
import { WAHAMessageRevokedConsumer } from './consumers/waha/message.revoked';
import { WAHAMessageAckConsumer } from './consumers/waha/message.ack';
import { WAHASessionStatusConsumer } from './consumers/waha/session.status';
import { WAHACallAcceptedConsumer } from './consumers/waha/call.accepted';
import { WAHACallReceivedConsumer } from './consumers/waha/call.received';
import { WAHACallRejectedConsumer } from './consumers/waha/call.rejected';
import { ChatWootQueueService } from './services/ChatWootQueueService';
import { ChatWootScheduleService } from './services/ChatWootScheduleService';
import { ChatWootWAHAQueueService } from './services/ChatWootWAHAQueueService';
import { QueueRegistry } from './services/QueueRegistry';
import { ChatWootConversationCreatedConsumer } from './consumers/inbox/conversation_created';
import { ChatWootConversationStatusChangedConsumer } from '@waha/apps/chatwoot/consumers/inbox/conversation_status_changed';
import { TaskContactsPullConsumer } from '@waha/apps/chatwoot/consumers/task/contacts.pull';
import { TaskMessagesPullConsumer } from '@waha/apps/chatwoot/consumers/task/messages.pull';
import { BullModule } from '@nestjs/bullmq';
import { QueueManager } from '@waha/apps/chatwoot/services/QueueManager';

const CONTROLLERS = [ChatwootWebhookController, ChatwootLocalesController];

const IMPORTS = lodash.flatten([
  BullModule.registerFlowProducer({
    name: FlowProducerName.MESSAGES_PULL_FLOW,
  }),
  RegisterAppQueue({
    name: QueueName.SCHEDULED_MESSAGE_CLEANUP,
    defaultJobOptions: merge(ExponentialRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.SCHEDULED_CHECK_VERSION,
    defaultJobOptions: merge(NoRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.SCHEDULED_CHECK_TIER,
    defaultJobOptions: merge(NoRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.TASK_CONTACTS_PULL,
    defaultJobOptions: merge(ExponentialRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.TASK_MESSAGES_PULL,
    defaultJobOptions: merge(ExponentialRetriesJobOptions, JobRemoveOptions),
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
    name: QueueName.WAHA_MESSAGE_ACK,
    defaultJobOptions: merge(ExponentialRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.WAHA_CALL_RECEIVED,
    defaultJobOptions: merge(ExponentialRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.WAHA_CALL_ACCEPTED,
    defaultJobOptions: merge(ExponentialRetriesJobOptions, JobRemoveOptions),
  }),
  RegisterAppQueue({
    name: QueueName.WAHA_CALL_REJECTED,
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
  // Tasks
  TaskContactsPullConsumer,
  TaskMessagesPullConsumer,
  // WAHA
  WAHASessionStatusConsumer,
  WAHAMessageAnyConsumer,
  WAHAMessageReactionConsumer,
  WAHAMessageEditedConsumer,
  WAHAMessageRevokedConsumer,
  WAHAMessageAckConsumer,
  WAHACallReceivedConsumer,
  WAHACallAcceptedConsumer,
  WAHACallRejectedConsumer,
  // Scheduled
  MessageCleanupConsumer,
  CheckVersionConsumer,
  CheckTierConsumer,
  // Services
  ChatWootWAHAQueueService,
  ChatWootQueueService,
  ChatWootScheduleService,
  ChatWootAppService,
  QueueRegistry,
  QueueManager,
];

export const ChatWootExports = {
  providers: PROVIDERS,
  imports: IMPORTS,
  controllers: CONTROLLERS,
};
