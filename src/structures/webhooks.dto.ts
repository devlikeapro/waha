import { ApiProperty } from '@nestjs/swagger';
import { CallData } from '@waha/structures/calls.dto';
import { Label, LabelChatAssociation } from '@waha/structures/labels.dto';

import { ChatArchiveEvent } from './chats.dto';
import { MessageDestination } from './chatting.dto';
import {
  WAHAEngine,
  WAHAEvents,
  WAHASessionStatus,
  WAMessageAck,
} from './enums.dto';
import { WAHAEnvironment } from './environment.dto';
import { WAHAChatPresences } from './presence.dto';
import { ChatIdProperty, MessageIdProperty } from './properties.dto';
import { WAMessage, WAMessageReaction } from './responses.dto';
import { MeInfo } from './sessions.dto';

export class WAMessageAckBody {
  @MessageIdProperty()
  id: string;

  @ChatIdProperty()
  from: string;

  @ChatIdProperty()
  to: string;

  @ChatIdProperty()
  participant: string;

  fromMe: boolean;
  ack: WAMessageAck;
  ackName: string;
}

export class WAGroupPayload {
  @ApiProperty({
    description: 'ID that represents the groupNotification',
  })
  id: any;

  @ApiProperty({
    description: 'Unix timestamp for when the groupNotification was created',
  })
  timestamp: number;

  @ChatIdProperty({
    description: 'ID for the Chat that this groupNotification was sent for',
  })
  chatId: string;

  @ApiProperty({
    description: 'ContactId for the user that produced the GroupNotification',
  })
  author: string;

  @ApiProperty({
    description: 'Extra content',
  })
  body: string;

  @ApiProperty({
    description:
      'Contact IDs for the users that were affected by this GroupNotification',
  })
  recipientIds: string[];
}

export class PollVote extends MessageDestination {
  @ApiProperty({
    description: 'Option that user has selected',
    example: ['Awesome!'],
  })
  selectedOptions: string[];

  @ApiProperty({
    description: 'Timestamp, ms',
    example: 1692861369,
  })
  timestamp: number;
}

export class PollVotePayload {
  vote: PollVote;
  poll: MessageDestination;
}

export class WAMessageRevokedBody {
  after?: WAMessage;
  before?: WAMessage;
}

export class WASessionStatusBody {
  @ApiProperty({
    example: 'default',
  })
  name: string;

  status: WAHASessionStatus;
}

export class WAHAWebhook {
  @ApiProperty({
    example: 'default',
  })
  session: string;

  @ApiProperty({
    example: {
      'user.id': '123',
      'user.email': 'email@example.com',
    },
    description: 'Metadata for the session.',
  })
  metadata?: Map<string, string>;

  @ApiProperty({
    example: WAHAEngine.WEBJS,
  })
  engine: WAHAEngine;

  me?: MeInfo;

  environment: WAHAEnvironment;

  event: WAHAEvents;

  payload:
    | WAGroupPayload
    // eslint-disable-next-line @typescript-eslint/ban-types
    | object;
}

class WAHAWebhookSessionStatus extends WAHAWebhook {
  @ApiProperty({
    description: 'The event is triggered when the session status changes.',
  })
  event = WAHAEvents.SESSION_STATUS;

  payload: WASessionStatusBody;
}

class WAHAWebhookMessage extends WAHAWebhook {
  @ApiProperty({ description: 'Incoming message.' })
  event = WAHAEvents.MESSAGE;

  payload: WAMessage;
}

class WAHAWebhookMessageReaction extends WAHAWebhook {
  @ApiProperty({
    description:
      'The event is triggered when a user reacts or removes a reaction.',
  })
  event = WAHAEvents.MESSAGE_REACTION;

  payload: WAMessageReaction;
}

class WAHAWebhookMessageAny extends WAHAWebhook {
  @ApiProperty({
    description: 'Fired on all message creations, including your own.',
  })
  event = WAHAEvents.MESSAGE_ANY;

  payload: WAMessage;
}

class WAHAWebhookMessageAck extends WAHAWebhook {
  @ApiProperty({
    description:
      'Receive events when server or recipient gets the message, read or played it.',
  })
  event = WAHAEvents.MESSAGE_ACK;

  payload: WAMessageAckBody;
}

class WAHAWebhookMessageRevoked extends WAHAWebhook {
  @ApiProperty({
    description:
      'The event is triggered when a user, whether it be you or any other participant, ' +
      'revokes a previously sent message.',
  })
  event = WAHAEvents.MESSAGE_REVOKED;

  payload: WAMessageRevokedBody;
}

class WAHAWebhookStateChange extends WAHAWebhook {
  @ApiProperty({
    description: 'It’s an internal engine’s state, not session status.',
  })
  event = WAHAEvents.STATE_CHANGE;

  payload: any;
}

class WAHAWebhookGroupJoin extends WAHAWebhook {
  @ApiProperty({
    description: 'Some one join a group.',
  })
  event = WAHAEvents.GROUP_JOIN;

  payload: any;
}

class WAHAWebhookGroupLeave extends WAHAWebhook {
  @ApiProperty({
    description: 'Some one left a group.',
  })
  event = WAHAEvents.GROUP_LEAVE;

  payload: any;
}

class WAHAWebhookPresenceUpdate extends WAHAWebhook {
  @ApiProperty({
    description: 'The most recent presence information for a chat.',
  })
  event = WAHAEvents.PRESENCE_UPDATE;

  payload: WAHAChatPresences;
}

class WAHAWebhookPollVote extends WAHAWebhook {
  @ApiProperty({
    description: 'With this event, you receive new votes for the poll sent.',
  })
  event = WAHAEvents.POLL_VOTE;

  payload: PollVotePayload;
}

class WAHAWebhookPollVoteFailed extends WAHAWebhook {
  @ApiProperty({
    description:
      'There may be cases when it fails to decrypt a vote from the user. ' +
      'Read more about how to handle such events in the documentations.',
  })
  event = WAHAEvents.POLL_VOTE_FAILED;

  payload: PollVotePayload;
}

class WAHAWebhookChatArchive extends WAHAWebhook {
  @ApiProperty({
    description:
      'The event is triggered when the chat is archived or unarchived',
  })
  event = WAHAEvents.CHAT_ARCHIVE;

  payload: ChatArchiveEvent;
}

class WAHAWebhookCallReceived extends WAHAWebhook {
  @ApiProperty({
    description:
      'The event is triggered when the call is received by the user.',
  })
  event = WAHAEvents.CALL_RECEIVED;

  payload: CallData;
}

class WAHAWebhookCallAccepted extends WAHAWebhook {
  @ApiProperty({
    description:
      'The event is triggered when the call is accepted by the user.',
  })
  event = WAHAEvents.CALL_ACCEPTED;

  payload: CallData;
}

class WAHAWebhookCallRejected extends WAHAWebhook {
  @ApiProperty({
    description:
      'The event is triggered when the call is rejected by the user.',
  })
  event = WAHAEvents.CALL_REJECTED;

  payload: CallData;
}

class WAHAWebhookLabelUpsert extends WAHAWebhook {
  @ApiProperty({
    description: 'The event is triggered when a label is created or updated',
  })
  event = WAHAEvents.LABEL_UPSERT;

  payload: Label;
}

class WAHAWebhookLabelDeleted extends WAHAWebhook {
  @ApiProperty({
    description: 'The event is triggered when a label is deleted',
  })
  event = WAHAEvents.LABEL_DELETED;

  payload: Label;
}

class WAHAWebhookLabelChatAdded extends WAHAWebhook {
  @ApiProperty({
    description: 'The event is triggered when a label is added to a chat',
  })
  event = WAHAEvents.LABEL_CHAT_ADDED;

  payload: LabelChatAssociation;
}

class WAHAWebhookLabelChatDeleted extends WAHAWebhook {
  @ApiProperty({
    description: 'The event is triggered when a label is deleted from a chat',
  })
  event = WAHAEvents.LABEL_CHAT_DELETED;

  payload: LabelChatAssociation;
}

const WAHA_WEBHOOKS = [
  WAHAWebhookSessionStatus,
  WAHAWebhookMessage,
  WAHAWebhookMessageReaction,
  WAHAWebhookMessageAny,
  WAHAWebhookMessageAck,
  WAHAWebhookMessageRevoked,
  WAHAWebhookStateChange,
  WAHAWebhookGroupJoin,
  WAHAWebhookGroupLeave,
  WAHAWebhookPresenceUpdate,
  WAHAWebhookPollVote,
  WAHAWebhookPollVoteFailed,
  WAHAWebhookChatArchive,
  WAHAWebhookCallReceived,
  WAHAWebhookCallAccepted,
  WAHAWebhookCallRejected,
  WAHAWebhookLabelUpsert,
  WAHAWebhookLabelDeleted,
  WAHAWebhookLabelChatAdded,
  WAHAWebhookLabelChatDeleted,
];
export { WAHA_WEBHOOKS };
