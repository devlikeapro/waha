import { ApiProperty } from '@nestjs/swagger';
import { CallData } from '@waha/structures/calls.dto';
import { EventResponsePayload } from '@waha/structures/events.dto';
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

export class WAMessageAckError {
  @ApiProperty({
    description: 'Server error code for the failed ack (e.g. "463").',
    example: '463',
    nullable: true,
  })
  code: string | null;

  @ApiProperty({
    description:
      'True when the failure is an account restriction (code 463) - ' +
      'WhatsApp blocked the outgoing message.',
    example: true,
  })
  blocked: boolean;

  @ApiProperty({
    description: 'Machine-readable reason, when known.',
    example: 'account_restricted',
    required: false,
  })
  reason?: string;

  @ApiProperty({
    description:
      'ISO 8601 timestamp when the restriction window ends, if known.',
    example: '2026-06-26T23:45:00.000Z',
    required: false,
    nullable: true,
  })
  until?: string | null;

  @ApiProperty({
    description: 'WhatsApp enforcement type for the restriction, if known.',
    required: false,
  })
  enforcementType?: string;
}

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

  @ApiProperty({
    description:
      'Failure details, present only on error acks (ack=-1/ERROR). ' +
      'Carries the account-restriction (463) feedback and block window.',
    required: false,
    type: WAMessageAckError,
  })
  error?: WAMessageAckError;

  _data?: any;
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
  _data?: any;
}

export class WAMessageRevokedBody {
  after?: WAMessage;
  before?: WAMessage;

  @ApiProperty({
    description: 'ID of the message that was revoked',
    example: 'A06CA7BB5DD8C8F705628CDB7E3A33C9',
  })
  revokedMessageId?: string;

  _data?: any;
}

export class WAMessageEditedBody extends WAMessage {
  @ApiProperty({
    description: 'ID of the original message that was edited',
    example: 'A06CA7BB5DD8C8F705628CDB7E3A33C9',
  })
  editedMessageId?: string;
}

export class SessionStatusPoint {
  status: WAHASessionStatus;
  timestamp: number;
}

export class WASessionStatusBody {
  @ApiProperty({
    example: 'default',
  })
  name: string;

  status: WAHASessionStatus;

  statuses: SessionStatusPoint[];

  @ApiProperty({
    required: false,
    nullable: true,
    description:
      'Extra info that belongs to the current status, null for most of them.\n' +
      'PASSKEY_REQUIRED - the WebAuthn challenge, ' +
      'pass it to navigator.credentials.get({ publicKey: data }).\n' +
      'PASSKEY_CONFIRMATION_REQUIRED - { code } - the code to verify against the phone.',
    example: null,
  })
  data?: any;
}

export class WAHAWebhook<Payload = any> {
  @ApiProperty({
    example: 'evt_01aaaaaaaaaaaaaaaaaaaaaaaa',
    description:
      'Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec',
  })
  id: string;

  @ApiProperty({
    example: 1634567890123,
    description: 'Unix timestamp (ms) for when the event was created.',
  })
  timestamp: number;

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
  metadata?: Record<string, string>;

  @ApiProperty({
    example: WAHAEngine.WEBJS,
  })
  engine: WAHAEngine;

  me?: MeInfo;

  environment: WAHAEnvironment;

  event: WAHAEvents;

  payload: Payload;
}

export class WAHAWebhookSessionStatus extends WAHAWebhook {
  @ApiProperty({
    description: 'The event is triggered when the session status changes.',
  })
  event = WAHAEvents.SESSION_STATUS;

  payload: WASessionStatusBody;
}

export class WAHAWebhookMessage extends WAHAWebhook {
  @ApiProperty({ description: 'Incoming message.' })
  event = WAHAEvents.MESSAGE;

  payload: WAMessage;
}

export class WAHAWebhookMessageReaction extends WAHAWebhook {
  @ApiProperty({
    description:
      'The event is triggered when a user reacts or removes a reaction.',
  })
  event = WAHAEvents.MESSAGE_REACTION;

  payload: WAMessageReaction;
}

export class WAHAWebhookMessageAny extends WAHAWebhook {
  @ApiProperty({
    description: 'Fired on all message creations, including your own.',
  })
  event = WAHAEvents.MESSAGE_ANY;

  payload: WAMessage;
}

export class WAHAWebhookMessageAck extends WAHAWebhook {
  @ApiProperty({
    description:
      'Receive events when server or recipient gets the message, read or played it (contacts only).',
  })
  event = WAHAEvents.MESSAGE_ACK;

  payload: WAMessageAckBody;
}

export class WAHAWebhookMessageAckGroup extends WAHAWebhook {
  @ApiProperty({
    description:
      'Receive events when participants in a group read or play messages.',
  })
  event = WAHAEvents.MESSAGE_ACK_GROUP;

  payload: WAMessageAckBody;
}

export class WAHAWebhookMessageRevoked extends WAHAWebhook {
  @ApiProperty({
    description:
      'The event is triggered when a user, whether it be you or any other participant, ' +
      'revokes a previously sent message.',
  })
  event = WAHAEvents.MESSAGE_REVOKED;

  payload: WAMessageRevokedBody;
}

export class WAHAWebhookMessageEdited extends WAHAWebhook {
  @ApiProperty({
    description:
      'The event is triggered when a user edits a previously sent message.',
  })
  event = WAHAEvents.MESSAGE_EDITED;

  payload: WAMessageEditedBody;
}

export class WAHAWebhookStateChange extends WAHAWebhook {
  @ApiProperty({
    description: 'It’s an internal engine’s state, not session status.',
    deprecated: true,
  })
  event = WAHAEvents.STATE_CHANGE;

  payload: any;
}

export class WAHAWebhookGroupJoin extends WAHAWebhook {
  @ApiProperty({
    description: 'Some one join a group.',
    deprecated: true,
  })
  event = WAHAEvents.GROUP_JOIN;

  payload: any;
}

export class WAHAWebhookGroupLeave extends WAHAWebhook {
  @ApiProperty({
    description: 'Some one left a group.',
    deprecated: true,
  })
  event = WAHAEvents.GROUP_LEAVE;

  payload: any;
}

export class WAHAWebhookPresenceUpdate extends WAHAWebhook {
  @ApiProperty({
    description: 'The most recent presence information for a chat.',
  })
  event = WAHAEvents.PRESENCE_UPDATE;

  payload: WAHAChatPresences;
}

export class WAHAWebhookPollVote extends WAHAWebhook {
  @ApiProperty({
    description: 'With this event, you receive new votes for the poll sent.',
  })
  event = WAHAEvents.POLL_VOTE;

  payload: PollVotePayload;
}

export class WAHAWebhookPollVoteFailed extends WAHAWebhook {
  @ApiProperty({
    description:
      'There may be cases when it fails to decrypt a vote from the user. ' +
      'Read more about how to handle such events in the documentations.',
  })
  event = WAHAEvents.POLL_VOTE_FAILED;

  payload: PollVotePayload;
}

export class WAHAWebhookChatArchive extends WAHAWebhook {
  @ApiProperty({
    description:
      'The event is triggered when the chat is archived or unarchived',
  })
  event = WAHAEvents.CHAT_ARCHIVE;

  payload: ChatArchiveEvent;
}

export class WAHAWebhookCallReceived extends WAHAWebhook {
  @ApiProperty({
    description:
      'The event is triggered when the call is received by the user.',
  })
  event = WAHAEvents.CALL_RECEIVED;

  payload: CallData;
}

export class WAHAWebhookCallAccepted extends WAHAWebhook {
  @ApiProperty({
    description:
      'The event is triggered when the call is accepted by the user.',
  })
  event = WAHAEvents.CALL_ACCEPTED;

  payload: CallData;
}

export class WAHAWebhookCallRejected extends WAHAWebhook {
  @ApiProperty({
    description:
      'The event is triggered when the call is rejected by the user.',
  })
  event = WAHAEvents.CALL_REJECTED;

  payload: CallData;
}

export class WAHAWebhookLabelUpsert extends WAHAWebhook {
  @ApiProperty({
    description: 'The event is triggered when a label is created or updated',
  })
  event = WAHAEvents.LABEL_UPSERT;

  payload: Label;
}

export class WAHAWebhookLabelDeleted extends WAHAWebhook {
  @ApiProperty({
    description: 'The event is triggered when a label is deleted',
  })
  event = WAHAEvents.LABEL_DELETED;

  payload: Label;
}

export class WAHAWebhookLabelChatAdded extends WAHAWebhook {
  @ApiProperty({
    description: 'The event is triggered when a label is added to a chat',
  })
  event = WAHAEvents.LABEL_CHAT_ADDED;

  payload: LabelChatAssociation;
}

export class WAHAWebhookLabelChatDeleted extends WAHAWebhook {
  @ApiProperty({
    description: 'The event is triggered when a label is deleted from a chat',
  })
  event = WAHAEvents.LABEL_CHAT_DELETED;

  payload: LabelChatAssociation;
}

export class EnginePayload {
  event: string;
  data: any;
}

export class WAHAWebhookEventResponse extends WAHAWebhook {
  @ApiProperty({
    description: 'The event is triggered when the event response is received.',
  })
  event = WAHAEvents.EVENT_RESPONSE;

  payload: EventResponsePayload;
}

export class WAHAWebhookEventResponseFailed extends WAHAWebhook {
  @ApiProperty({
    description:
      'The event is triggered when the event response is failed to decrypt.',
  })
  event = WAHAEvents.EVENT_RESPONSE_FAILED;

  payload: EventResponsePayload;
}

export class WAHAWebhookEngineEvent extends WAHAWebhook {
  @ApiProperty({
    description: 'Internal engine event.',
  })
  event = WAHAEvents.ENGINE_EVENT;

  payload: EnginePayload;
}
