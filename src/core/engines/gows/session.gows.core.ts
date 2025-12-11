import {
  normalizeMessageContent,
  proto,
  WAMessageKey,
} from '@adiwajshing/baileys';
import * as grpc from '@grpc/grpc-js';
import { connectivityState } from '@grpc/grpc-js';
import { UnprocessableEntityException } from '@nestjs/common';
import {
  extractDeviceId,
  getChannelInviteLink,
  WhatsappSession,
} from '@waha/core/abc/session.abc';
import { Jid } from '@waha/core/engines/const';
import { EventsFromObservable } from '@waha/core/engines/gows/EventsFromObservable';
import { GowsEventStreamObservable } from '@waha/core/engines/gows/GowsEventStreamObservable';
import {
  ToGroupParticipants,
  ToGroupV2JoinEvent,
  ToGroupV2LeaveEvent,
  ToGroupV2ParticipantsEvents,
  ToGroupV2UpdateEvent,
} from '@waha/core/engines/gows/groups.gows';
import { messages } from '@waha/core/engines/gows/grpc/gows';
import {
  optional,
  parseJson,
  parseJsonList,
  statusToAck,
} from '@waha/core/engines/gows/helpers';
import { GowsAuthFactoryCore } from '@waha/core/engines/gows/store/GowsAuthFactoryCore';
import {
  extractBody,
  getDestination,
} from '@waha/core/engines/noweb/session.noweb.core';
import { extractMediaContent } from '@waha/core/engines/noweb/utils';
import {
  AvailableInPlusVersion,
  NotImplementedByEngineError,
} from '@waha/core/exceptions';
import { IMediaEngineProcessor } from '@waha/core/media/IMediaEngineProcessor';
import { QR } from '@waha/core/QR';
import { ExtractMessageKeysForRead } from '@waha/core/utils/convertors';
import { parseMessageIdSerialized } from '@waha/core/utils/ids';
import {
  isJidBroadcast,
  isJidGroup,
  toCusFormat,
  toJID,
} from '@waha/core/utils/jids';
import {
  Channel,
  ChannelListResult,
  ChannelMessage,
  ChannelRole,
  ChannelSearchByText,
  ChannelSearchByView,
  CreateChannelRequest,
  ListChannelsQuery,
  PreviewChannelMessages,
} from '@waha/structures/channels.dto';
import {
  ChatSortField,
  ChatSummary,
  GetChatMessageQuery,
  GetChatMessagesFilter,
  GetChatMessagesQuery,
  MessageSortField,
  OverviewFilter,
  ReadChatMessagesQuery,
  ReadChatMessagesResponse,
} from '@waha/structures/chats.dto';
import {
  ChatRequest,
  CheckNumberStatusQuery,
  EditMessageRequest,
  MessageContactVcardRequest,
  MessageFileRequest,
  MessageForwardRequest,
  MessageImageRequest,
  MessageLinkCustomPreviewRequest,
  MessageLocationRequest,
  MessagePollRequest,
  MessagePollVoteRequest,
  MessageReactionRequest,
  MessageReplyRequest,
  MessageTextRequest,
  MessageVoiceRequest,
  SendSeenRequest,
  WANumberExistResult,
} from '@waha/structures/chatting.dto';
import { SendListRequest } from '@waha/structures/chatting.list.dto';
import { ContactQuery, ContactUpdateBody } from '@waha/structures/contacts.dto';
import {
  ACK_UNKNOWN,
  WAHAEvents,
  WAHAPresenceStatus,
  WAHASessionStatus,
  WAMessageAck,
} from '@waha/structures/enums.dto';
import {
  EventMessageRequest,
  EventResponse,
  EventResponsePayload,
} from '@waha/structures/events.dto';
import { BinaryFile, RemoteFile } from '@waha/structures/files.dto';
import {
  CreateGroupRequest,
  GroupParticipant,
  GroupSortField,
  Participant,
  ParticipantsRequest,
  SettingsSecurityChangeInfo,
} from '@waha/structures/groups.dto';
import { ReplyToMessage } from '@waha/structures/message.dto';
import { PaginationParams, SortOrder } from '@waha/structures/pagination.dto';
import {
  WAHAChatPresences,
  WAHAPresenceData,
} from '@waha/structures/presence.dto';
import {
  MessageSource,
  WAMessage,
  WAMessageReaction,
} from '@waha/structures/responses.dto';
import { CallData } from '@waha/structures/calls.dto';
import { MeInfo, ProxyConfig } from '@waha/structures/sessions.dto';
import {
  BROADCAST_ID,
  DeleteStatusRequest,
  TextStatus,
} from '@waha/structures/status.dto';
import {
  EnginePayload,
  PollVotePayload,
  WAMessageAckBody,
  WAMessageEditedBody,
  WAMessageRevokedBody,
} from '@waha/structures/webhooks.dto';
import { PaginatorInMemory } from '@waha/utils/Paginator';
import { sleep, waitUntil } from '@waha/utils/promiseTimeout';
import { onlyEvent } from '@waha/utils/reactive/ops/onlyEvent';
import * as NodeCache from 'node-cache';
import {
  filter,
  groupBy,
  merge,
  mergeMap,
  Observable,
  partition,
  retry,
  share,
  Subject,
} from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { promisify } from 'util';

import * as gows from './types';
import { MessageStatus } from './types';
import { isFromFullSync } from '@waha/core/engines/gows/appstate';
import { toVcardV3 } from '@waha/core/vcard';
import { AckToStatus } from '@waha/core/utils/acks';
import { ParseEventResponseType } from '@waha/core/utils/events';
import { DistinctAck, DistinctMessages } from '@waha/core/utils/reactive';
import { Label, LabelDTO, LabelID } from '@waha/structures/labels.dto';
import { LidToPhoneNumber } from '@waha/structures/lids.dto';
import { exclude } from '@waha/utils/reactive/ops/exclude';
import * as lodash from 'lodash';

import {
  eventToLabelChatAssociationDTO,
  eventToLabelDTO,
  isLabelChatAddedEvent,
  isLabelUpsertEvent,
} from './labels.gows';
import {
  EventStreamClientSingleton,
  MessageServiceClientSingleton,
} from '@waha/core/engines/gows/clients';
import esm from '@waha/vendor/esm';
import { IsEditedMessage } from '@waha/core/utils/pwa';
import { GoToJSWAProto } from '@waha/core/engines/gows/waproto';
import { extractWALocation } from '@waha/core/engines/waproto/locaiton';
import { extractVCards } from '@waha/core/engines/waproto/vcards';
import { Activity } from '@waha/core/abc/activity';
import { TmpDir } from '@waha/utils/tmpdir';
import * as path from 'path';
import MessageServiceClient = messages.MessageServiceClient;
import * as fsp from 'fs/promises';

enum WhatsMeowEvent {
  CONNECTED = 'gows.ConnectedEventData',
  DISCONNECTED = 'events.Disconnected',
  KEEP_ALIVE_TIMEOUT = 'events.KeepAliveTimeout',
  KEEP_ALIVE_RESTORED = 'events.KeepAliveRestored',
  QR_CHANNEL_ITEM = 'whatsmeow.QRChannelItem',
  MESSAGE = 'events.Message',
  RECEIPT = 'events.Receipt',
  PRESENCE = 'events.Presence',
  CHAT_PRESENCE = 'events.ChatPresence',
  PUSH_NAME_SETTING = 'events.PushNameSetting',
  LOGGED_OUT = 'events.LoggedOut',
  // Groups
  GROUP_INFO = 'events.GroupInfo',
  JOINED_GROUP = 'events.JoinedGroup',
  // Labels
  LABEL_EDIT = 'events.LabelEdit',
  LABEL_ASSOCIATION_CHAT = 'events.LabelAssociationChat',
  // Events
  EVENT_MESSAGE_RESPONSE = 'gows.EventMessageResponse',
  // Polls
  POLL_VOTE_EVENT = 'gows.PollVoteEvent',
  // Calls
  CALL_OFFER = 'events.CallOffer',
  CALL_ACCEPT = 'events.CallAccept',
  CALL_REJECT = 'events.CallReject',
  CALL_TERMINATE = 'events.CallTerminate',
  CALL_OFFER_NOTICE = 'events.CallOfferNotice',
}

export interface GowsConfig {
  connection: string;
}

export class WhatsappSessionGoWSCore extends WhatsappSession {
  protected authFactory = new GowsAuthFactoryCore();

  protected qr: QR;
  public client: MessageServiceClient;
  protected stream$: GowsEventStreamObservable;
  protected all$: Observable<EnginePayload>;
  protected events: EventsFromObservable<WhatsMeowEvent>;

  protected me: MeInfo | null;
  public session: messages.Session;
  protected presences: any;

  private local$ = new Subject<EnginePayload>();

  public constructor(config) {
    super(config);
    this.qr = new QR();
    this.session = new messages.Session({ id: this.name });
    this.presences = new NodeCache({
      stdTTL: 60 * 60, // 1 hour
      useClones: false,
    });
  }

  async start() {
    this.status = WAHASessionStatus.STARTING;
    this.buildStreams();
    this.subscribeEvents();
    this.subscribeEngineEvents2();
    if (this.isDebugEnabled()) {
      this.listenEngineEventsInDebugMode();
    }

    // start session
    const auth = await this.authFactory.buildAuth(this.sessionStore, this.name);

    const level = messages.LogLevel[this.logger.level.toUpperCase()];
    const request = new messages.StartSessionRequest({
      id: this.name,
      config: new messages.SessionConfig({
        store: new messages.SessionStoreConfig({
          address: auth.address(),
          dialect: auth.dialect(),
        }),
        log: new messages.SessionLogConfig({
          level: level ?? messages.LogLevel.INFO,
        }),
        proxy: new messages.SessionProxyConfig({
          url: this.getProxyUrl(this.proxyConfig),
        }),
        ignore: new messages.SessionIgnoreJidsConfig({
          status: this.jids.ignore.status,
          groups: this.jids.ignore.groups,
          newsletters: this.jids.ignore.channels,
          broadcast: this.jids.ignore.broadcast,
        }),
      }),
    });

    this.client = MessageServiceClientSingleton(
      this.engineConfig.connection,
      grpc.credentials.createInsecure(),
    );

    try {
      await promisify(this.client.StartSession)(request);
    } catch (err) {
      this.logger.error('Failed to start the client');
      this.logger.error(err, err.stack);
      this.status = WAHASessionStatus.FAILED;
      throw err;
    }
  }

  protected getProxyUrl(config: ProxyConfig): string {
    if (!config || !config.server) {
      return '';
    }
    const { server, username, password } = config;
    const auth = username && password ? `${username}:${password}@` : '';
    const schema = 'http';
    return `${schema}://${auth}${server}`;
  }

  buildStreams() {
    this.stream$ = new GowsEventStreamObservable(
      this.loggerBuilder.child({ grpc: 'stream' }),
      () => {
        const client = EventStreamClientSingleton(
          this.engineConfig.connection,
          grpc.credentials.createInsecure(),
        );
        const stream = client.StreamEvents(this.session);
        return { client, stream };
      },
    );

    // Retry on error with delay
    // Accept locally re-issued events as well
    this.all$ = merge(this.stream$, this.local$).pipe(
      retry({ delay: 2_000 }),
      share(),
    );
  }

  subscribeEvents() {
    // Handle connection status
    this.events = new EventsFromObservable<WhatsMeowEvent>(this.all$);
    const events = this.events;
    events.on(WhatsMeowEvent.CONNECTED, (data) => {
      this.status = WAHASessionStatus.WORKING;
      this.me = {
        id: toCusFormat(esm.b.jidNormalizedUser(data.ID)),
        pushName: data.PushName,
        lid: esm.b.jidNormalizedUser(data.LID),
      };
      // @ts-ignore
      this.me.jid = data.ID;
    });

    events.on(WhatsMeowEvent.DISCONNECTED, () => {
      if (this.status != WAHASessionStatus.STARTING) {
        this.cleanupPresenceTimeout();
        this.presence = null;
        this.status = WAHASessionStatus.STARTING;
      }
    });
    events.on(WhatsMeowEvent.KEEP_ALIVE_TIMEOUT, () => {
      if (this.status != WAHASessionStatus.STARTING) {
        this.cleanupPresenceTimeout();
        this.presence = null;
        this.status = WAHASessionStatus.STARTING;
      }
    });
    events.on(WhatsMeowEvent.KEEP_ALIVE_RESTORED, () => {
      if (this.status != WAHASessionStatus.WORKING) {
        this.status = WAHASessionStatus.WORKING;
      }
    });
    events.on(WhatsMeowEvent.QR_CHANNEL_ITEM, async (data) => {
      if (!data.Event) {
        return;
      }
      if (data.Event == 'success') {
        return;
      }
      if (data.Event != 'code') {
        this.logger.warn(data, 'Failed QR item event');
        this.status = WAHASessionStatus.FAILED;
        return;
      }
      const qr = data.Code;
      if (!qr) {
        return;
      }
      this.qr.save(qr);
      this.printQR(this.qr);
      this.status = WAHASessionStatus.SCAN_QR_CODE;
    });
    events.on(WhatsMeowEvent.PUSH_NAME_SETTING, (data) => {
      this.me = { ...this.me, pushName: data.Action.name };
    });
    events.on(WhatsMeowEvent.LOGGED_OUT, () => {
      this.logger.error('Logged out');
      this.status = WAHASessionStatus.FAILED;
    });
    events.on(WhatsMeowEvent.PRESENCE, (event: gows.Presence) => {
      if (isJidGroup(event.From)) {
        // So group is not "online"
        return;
      }
      const Chat = event.From;
      const Sender = event.From;
      const stored = this.presences.get(Chat) || [];
      // remove values by event.Sender
      const filtered = stored.filter(
        (p) => p.Sender !== Sender && p.From !== Sender,
      );
      // add new value
      this.presences.set(Chat, [...filtered, event]);
    });
    events.on(WhatsMeowEvent.CHAT_PRESENCE, (event: gows.ChatPresence) => {
      const Chat = event.Chat;
      const Sender = event.Sender;
      const stored = this.presences.get(Chat) || [];
      // remove values by event.Sender
      const filtered = stored.filter(
        (p) => p.Sender !== Sender && p.From !== Sender,
      );
      // add new value
      this.presences.set(Chat, [...filtered, event]);
    });

    //
    // Fix for "typing" after sending a message
    // Re-issue a synthetic ChatPresence(PAUSED) to cancel COMPOSING state
    // Works for both DM and Group chats
    //
    events.on(WhatsMeowEvent.MESSAGE, (message: any) => {
      const chat = message?.Info?.Chat;
      if (!this.jids.include(chat)) {
        return;
      }
      if (message?.Info?.IsFromMe) {
        return;
      }
      const sender = message?.Info?.Sender || chat;
      if (!chat || !sender) {
        return;
      }
      const stored: Array<gows.Presence | gows.ChatPresence> =
        this.presences.get(chat) || [];
      const composing = stored.find(
        (presence: any) =>
          (presence?.Sender === sender || presence?.From === sender) &&
          presence?.State === gows.ChatPresenceState.COMPOSING,
      ) as gows.ChatPresence | undefined;
      if (!composing) {
        return;
      }
      const presence: gows.ChatPresence = {
        Chat: chat,
        Sender: sender,
        IsFromMe: false,
        IsGroup: !!isJidGroup(chat),
        State: gows.ChatPresenceState.PAUSED,
        Media: (composing as any)?.Media ?? gows.ChatPresenceMedia.TEXT,
      } as any;
      this.local$.next({
        event: WhatsMeowEvent.CHAT_PRESENCE,
        data: presence,
      } as any);
    });

    events.start();
  }

  subscribeEngineEvents2() {
    const all$ = this.all$;
    this.events2.get(WAHAEvents.ENGINE_EVENT).switch(all$);

    const messages$ = all$.pipe(
      onlyEvent(WhatsMeowEvent.MESSAGE),
      filter((msg: any) => this.jids.include(msg?.Info?.Chat)),
      share(),
    );

    let [messagesFromMe$, messagesFromOthers$] = partition(messages$, isMine);
    messagesFromMe$ = messagesFromMe$.pipe(
      map((msg) => {
        msg.Status = MessageStatus.ServerAck;
        return msg;
      }),
      mergeMap((msg) => this.processIncomingMessage(msg, true)),
      filter(Boolean),
      // Deduplicate messages by ID to prevent duplicate webhooks
      // @see https://github.com/devlikeapro/waha/issues/1564
      DistinctMessages(),
      share(), // share it so we don't process twice in message.any
    );
    messagesFromOthers$ = messagesFromOthers$.pipe(
      map((msg) => {
        msg.Status = MessageStatus.DeliveryAck;
        return msg;
      }),
      mergeMap((msg) => this.processIncomingMessage(msg, true)),
      filter(Boolean),
      // Deduplicate messages by ID to prevent duplicate webhooks
      // @see https://github.com/devlikeapro/waha/issues/1564
      DistinctMessages(),
      share(), // share it so we don't process twice in message.any
    );
    const messagesFromAll$ = merge(messagesFromMe$, messagesFromOthers$);
    this.events2.get(WAHAEvents.MESSAGE).switch(messagesFromOthers$);
    this.events2.get(WAHAEvents.MESSAGE_ANY).switch(messagesFromAll$);

    // Handle revoked messages
    const messagesRevoked$ = messages$.pipe(
      filter((msg) => {
        return (
          msg?.Message?.protocolMessage?.type === 0 &&
          msg?.Message?.protocolMessage?.key !== undefined
        );
      }),
      mergeMap(async (message): Promise<WAMessageRevokedBody> => {
        const afterMessage = await this.toWAMessage(message);
        // Extract the revoked message ID from protocolMessage.key
        const revokedMessageId = message.Message.protocolMessage.key?.ID;
        return {
          after: afterMessage,
          before: null,
          revokedMessageId: revokedMessageId,
          _data: message,
        };
      }),
    );
    this.events2.get(WAHAEvents.MESSAGE_REVOKED).switch(messagesRevoked$);

    // Handle edited messages
    const messagesEdited$ = messages$.pipe(
      filter((message) => IsEditedMessage(message.Message)),
      mergeMap(async (message): Promise<WAMessageEditedBody> => {
        const waMessage = await this.toWAMessage(message);
        const content = normalizeMessageContent(message.Message);
        // Extract the body from editedMessage using extractBody function
        const body = extractBody(content.protocolMessage.editedMessage) || '';
        // Extract the original message ID from protocolMessage.key
        // @ts-ignore
        const editedMessageId = content.protocolMessage.key?.ID;
        return {
          ...waMessage,
          body: body,
          editedMessageId: editedMessageId,
          _data: message,
        };
      }),
    );
    this.events2.get(WAHAEvents.MESSAGE_EDITED).switch(messagesEdited$);

    const receipt$ = all$.pipe(
      onlyEvent(WhatsMeowEvent.RECEIPT),
      filter((r: any) => this.jids.include(r?.Chat)),
    );
    const messageAck$ = receipt$.pipe(
      mergeMap(this.receiptToMessageAck.bind(this)),
      DistinctAck(),
    );
    this.events2.get(WAHAEvents.MESSAGE_ACK).switch(messageAck$);

    const messageReactions$ = messages$.pipe(
      filter((msg) => !!msg?.Message?.reactionMessage),
      map(this.processMessageReaction.bind(this)),
    );
    this.events2.get(WAHAEvents.MESSAGE_REACTION).switch(messageReactions$);

    //
    // Calls
    //
    const callOffer$ = all$.pipe(
      onlyEvent(WhatsMeowEvent.CALL_OFFER),
      filter(this.shouldProcessCallEvent.bind(this)),
      map(this.toCallData.bind(this)),
    );
    const callOfferNotice$ = all$.pipe(
      onlyEvent(WhatsMeowEvent.CALL_OFFER_NOTICE),
      filter(this.shouldProcessCallEvent.bind(this)),
      map(this.toCallData.bind(this)),
    );
    this.events2
      .get(WAHAEvents.CALL_RECEIVED)
      .switch(merge(callOffer$, callOfferNotice$));

    const callAccept$ = all$.pipe(
      onlyEvent(WhatsMeowEvent.CALL_ACCEPT),
      filter(this.shouldProcessCallEvent.bind(this)),
      map(this.toCallData.bind(this)),
    );
    this.events2.get(WAHAEvents.CALL_ACCEPTED).switch(callAccept$);

    const callReject$ = all$.pipe(
      onlyEvent(WhatsMeowEvent.CALL_REJECT),
      filter(this.shouldProcessCallEvent.bind(this)),
    );
    const callTerminate$ = all$.pipe(
      onlyEvent(WhatsMeowEvent.CALL_TERMINATE),
      filter(this.shouldProcessCallEvent.bind(this)),
      // Skip terminate events that only mean the call was accepted or rejected on another device
      filter(
        (call: any) =>
          call?.Reason !== 'accepted_elsewhere' &&
          call?.Reason !== 'rejected_elsewhere',
      ),
    );
    // Debounce per call to collapse duplicate reject/terminate events
    const callRejected$ = merge(callReject$, callTerminate$).pipe(
      groupBy((call: any) => this.getCallId(call) || 'unknown'),
      mergeMap((group$) => group$.pipe(debounceTime(1_000))),
      map(this.toCallData.bind(this)),
    );
    this.events2.get(WAHAEvents.CALL_REJECTED).switch(callRejected$);

    const presence$ = all$.pipe(
      onlyEvent(WhatsMeowEvent.PRESENCE),
      filter((event: any) => this.jids.include(event?.From)),
      filter((event) => !isJidGroup(event.From)),
    );
    const chatPresence$ = all$.pipe(
      onlyEvent(WhatsMeowEvent.CHAT_PRESENCE),
      filter((event: any) => this.jids.include(event?.Chat)),
    );
    const presenceUpdates$ = merge(presence$, chatPresence$).pipe(
      map((event) => this.toWahaPresences(event.From || event.Chat, [event])),
    );
    this.events2.get(WAHAEvents.PRESENCE_UPDATE).switch(presenceUpdates$);
    //
    // Group Events
    //
    const joinedGroup$ = all$.pipe(onlyEvent(WhatsMeowEvent.JOINED_GROUP));
    const groupV2Join$ = joinedGroup$.pipe(map(ToGroupV2JoinEvent));
    this.events2.get(WAHAEvents.GROUP_V2_JOIN).switch(groupV2Join$);

    const groupInfo$ = all$.pipe(onlyEvent(WhatsMeowEvent.GROUP_INFO));

    const groupV2Leave$ = groupInfo$.pipe(
      map((event) => ToGroupV2LeaveEvent(this.me, event)),
      filter(Boolean),
    );
    this.events2.get(WAHAEvents.GROUP_V2_LEAVE).switch(groupV2Leave$);

    const groupV2Participants$ = groupInfo$.pipe(
      map(ToGroupV2ParticipantsEvents),
      mergeMap((events) => events),
    );
    this.events2
      .get(WAHAEvents.GROUP_V2_PARTICIPANTS)
      .switch(groupV2Participants$);

    const groupV2Update$ = groupInfo$.pipe(
      map(ToGroupV2UpdateEvent),
      filter(Boolean),
    );
    this.events2.get(WAHAEvents.GROUP_V2_UPDATE).switch(groupV2Update$);

    // Label Events
    // First, create streams for the raw label events
    const labelEditEvents$ = all$.pipe(
      onlyEvent(WhatsMeowEvent.LABEL_EDIT),
      exclude(isFromFullSync),
    );

    // Split the raw label edit events into upsert and deleted events
    const [labelUpsertEvents$, labelDeletedEvents$] = partition(
      labelEditEvents$,
      isLabelUpsertEvent,
    );

    // Convert the events to DTOs
    const labelUpsert$ = labelUpsertEvents$.pipe(map(eventToLabelDTO));

    const labelDeleted$ = labelDeletedEvents$.pipe(map(eventToLabelDTO));

    this.events2.get(WAHAEvents.LABEL_UPSERT).switch(labelUpsert$);
    this.events2.get(WAHAEvents.LABEL_DELETED).switch(labelDeleted$);

    //
    // Polls
    //
    const pollVoteEvent$ = all$.pipe(
      onlyEvent(WhatsMeowEvent.POLL_VOTE_EVENT),
      filter((event: any) => this.jids.include(event?.Info?.Chat)),
      map(this.toPollVotePayload.bind(this)),
      filter(Boolean),
      share(),
    );

    // Split into successful and failed responses
    const [pollVoteSuccess$, pollVoteFailed$] = partition(
      pollVoteEvent$,
      (payload: PollVotePayload) => !!payload.vote.selectedOptions,
    );

    this.events2.get(WAHAEvents.POLL_VOTE).switch(pollVoteSuccess$);
    this.events2.get(WAHAEvents.POLL_VOTE_FAILED).switch(pollVoteFailed$);

    //
    // Event Message
    //
    const eventMessageResponse$ = all$.pipe(
      onlyEvent(WhatsMeowEvent.EVENT_MESSAGE_RESPONSE),
      filter((event: any) => this.jids.include(event?.Info?.Chat)),
      map(this.toEventResponsePayload.bind(this)),
      filter(Boolean),
    );

    // Split into successful and failed responses
    const [eventResponseSuccess$, eventResponseFailed$] = partition(
      eventMessageResponse$,
      (payload: EventResponsePayload) => !!payload.eventResponse,
    );

    this.events2.get(WAHAEvents.EVENT_RESPONSE).switch(eventResponseSuccess$);
    this.events2
      .get(WAHAEvents.EVENT_RESPONSE_FAILED)
      .switch(eventResponseFailed$);

    //
    // Labels
    //
    // Handle label association events
    const labelAssociationEvents$ = all$.pipe(
      onlyEvent(WhatsMeowEvent.LABEL_ASSOCIATION_CHAT),
      exclude(isFromFullSync),
    );

    // Split the raw label association events into added and deleted events
    const [labelChatAddedEvents$, labelChatDeletedEvents$] = partition(
      labelAssociationEvents$,
      isLabelChatAddedEvent,
    );

    // Convert the events to DTOs
    const labelChatAdded$ = labelChatAddedEvents$.pipe(
      map(eventToLabelChatAssociationDTO),
    );

    const labelChatDeleted$ = labelChatDeletedEvents$.pipe(
      map(eventToLabelChatAssociationDTO),
    );

    this.events2.get(WAHAEvents.LABEL_CHAT_ADDED).switch(labelChatAdded$);
    this.events2.get(WAHAEvents.LABEL_CHAT_DELETED).switch(labelChatDeleted$);
  }

  @Activity()
  async fetchContactProfilePicture(id: string): Promise<string> {
    const jid = toJID(this.ensureSuffix(id));
    const request = new messages.ProfilePictureRequest({
      jid: jid,
      session: this.session,
    });
    const response = await promisify(this.client.GetProfilePicture)(request);
    const url = response.toObject().url;
    return url;
  }

  protected listenEngineEventsInDebugMode() {
    this.events2.get(WAHAEvents.ENGINE_EVENT).subscribe((data) => {
      this.logger.debug({ events: data }, `GOWS event`);
    });
  }

  async stop(): Promise<void> {
    this.cleanupPresenceTimeout();
    if (this.client) {
      const response = await promisify(this.client.StopSession)(this.session);
      response.toObject();
    }
    this.status = WAHASessionStatus.STOPPED;
    this.events?.stop();
    this.stopEvents();
    this.mediaManager.close();
  }

  public async requestCode(phoneNumber: string, method: string, params?: any) {
    if (this.status == WAHASessionStatus.STARTING) {
      this.logger.debug('Waiting for connection update...');
      await waitUntil(
        async () => this.status === WAHASessionStatus.SCAN_QR_CODE,
        100,
        2000,
      );
    }

    if (this.status != WAHASessionStatus.SCAN_QR_CODE) {
      const err = `Can request code only in SCAN_QR_CODE status. The current status is ${this.status}`;
      throw new UnprocessableEntityException(err);
    }

    const request = new messages.PairCodeRequest({
      session: this.session,
      phone: phoneNumber,
    });
    const response = await promisify(this.client.RequestCode)(request);
    const code: string = response.toObject().code;
    this.logger.info(`Your code: ${code}`);
    return { code: code };
  }

  async unpair() {
    await promisify(this.client.Logout)(this.session);
  }

  public getSessionMeInfo(): MeInfo | null {
    return this.me;
  }

  /**
   * START - Methods for API
   */

  /**
   * Auth methods
   */
  public getQR(): QR {
    return this.qr;
  }

  async getScreenshot(): Promise<Buffer> {
    if (this.status === WAHASessionStatus.STARTING) {
      throw new UnprocessableEntityException(
        `The session is starting, please try again after few seconds`,
      );
    } else if (this.status === WAHASessionStatus.SCAN_QR_CODE) {
      return this.qr.get();
    } else if (this.status === WAHASessionStatus.WORKING) {
      throw new UnprocessableEntityException(
        `Can not get screenshot for non chrome based engine.`,
      );
    } else {
      throw new UnprocessableEntityException(`Unknown status - ${this.status}`);
    }
  }

  /**
   * Profile methods
   */
  @Activity()
  public async setProfileName(name: string): Promise<boolean> {
    const request = new messages.ProfileNameRequest({
      session: this.session,
      name: name,
    });
    const response = await promisify(this.client.SetProfileName)(request);
    response.toObject();
    return true;
  }

  @Activity()
  public async setProfileStatus(status: string): Promise<boolean> {
    const request = new messages.ProfileStatusRequest({
      session: this.session,
      status: status,
    });
    const response = await promisify(this.client.SetProfileStatus)(request);
    response.toObject();
    return true;
  }

  protected setProfilePicture(file: BinaryFile | RemoteFile): Promise<boolean> {
    throw new AvailableInPlusVersion();
  }

  protected deleteProfilePicture(): Promise<boolean> {
    throw new AvailableInPlusVersion();
  }

  /**
   * Other methods
   */
  async generateNewMessageId(): Promise<string> {
    const response = await promisify(this.client.GenerateNewMessageID)(
      this.session,
    );
    const data = response.toObject();
    return data.id;
  }

  async rejectCall(from: string, id: string): Promise<void> {
    const request = new messages.RejectCallRequest({
      session: this.session,
      from: toJID(this.ensureSuffix(from)),
      id: id,
    });
    await promisify(this.client.RejectCall)(request);
  }

  @Activity()
  async sendText(request: MessageTextRequest) {
    const jid = toJID(this.ensureSuffix(request.chatId));
    const message = new messages.MessageRequest({
      jid: jid,
      text: request.text,
      session: this.session,
      linkPreview: request.linkPreview ?? true,
      linkPreviewHighQuality: request.linkPreviewHighQuality,
      replyTo: getMessageIdFromSerialized(request.reply_to),
      mentions: request.mentions?.map((mention) => toJID(mention)),
    });
    const response = await promisify(this.client.SendMessage)(message);
    const data = response.toObject();
    return this.messageResponse(jid, data);
  }

  @Activity()
  public async editMessage(
    chatId: string,
    messageId: string,
    request: EditMessageRequest,
  ) {
    const jid = toJID(this.ensureSuffix(chatId));
    const key = parseMessageIdSerialized(messageId, true);
    const message = new messages.EditMessageRequest({
      session: this.session,
      jid: jid,
      messageId: key.id,
      text: request.text,
      linkPreview: request.linkPreview ?? true,
      linkPreviewHighQuality: request.linkPreviewHighQuality,
    });
    const response = await promisify(this.client.EditMessage)(message);
    const data = response.toObject();
    return this.messageResponse(jid, data);
  }

  @Activity()
  async sendContactVCard(request: MessageContactVcardRequest) {
    const jid = toJID(this.ensureSuffix(request.chatId));
    const contacts = request.contacts.map((el) => ({ vcard: toVcardV3(el) }));
    const message = new messages.MessageRequest({
      jid: jid,
      session: this.session,
      replyTo: getMessageIdFromSerialized(request.reply_to),
      contacts: contacts.map((contact) => new messages.vCardContact(contact)),
    });
    const response = await promisify(this.client.SendMessage)(message);
    const data = response.toObject();
    return this.messageResponse(jid, data);
  }

  @Activity()
  async sendPoll(request: MessagePollRequest) {
    const jid = toJID(request.chatId);
    const message = new messages.MessageRequest({
      jid: jid,
      session: this.session,
      replyTo: getMessageIdFromSerialized(request.reply_to),
      poll: new messages.PollMessage({
        name: request.poll.name,
        options: request.poll.options,
        multipleAnswers: request.poll.multipleAnswers,
      }),
    });
    const response = await promisify(this.client.SendMessage)(message);
    const data = response.toObject();
    return this.messageResponse(jid, data);
  }

  sendPollVote(request: MessagePollVoteRequest) {
    throw new AvailableInPlusVersion('Poll voting');
  }

  sendList(request: SendListRequest): Promise<any> {
    throw new AvailableInPlusVersion();
  }

  @Activity()
  public async deleteMessage(chatId: string, messageId: string) {
    const jid = toJID(this.ensureSuffix(chatId));
    const key = parseMessageIdSerialized(messageId);
    const message = new messages.RevokeMessageRequest({
      session: this.session,
      jid: jid,
      sender: key.participant || '',
      messageId: key.id,
    });
    const response = await promisify(this.client.RevokeMessage)(message);
    const data = response.toObject();
    return this.messageResponse(jid, data);
  }

  protected async prepareJidsForStatus(contacts: string[]) {
    if (!contacts || contacts.length == 0) {
      return [];
    }
    return contacts.map(toJID);
  }

  @Activity()
  public async sendTextStatus(status: TextStatus) {
    const participants = await this.prepareJidsForStatus(status.contacts);
    const message = new messages.MessageRequest({
      id: status.id,
      jid: Jid.BROADCAST,
      participants: participants,
      text: status.text,
      session: this.session,
      backgroundColor: new messages.OptionalString({
        value: status.backgroundColor,
      }),
      font: new messages.OptionalUInt32({
        value: status.font,
      }),
      linkPreview: status.linkPreview ?? true,
      linkPreviewHighQuality: status.linkPreviewHighQuality,
    });
    const response = await promisify(this.client.SendMessage)(message);
    const data = response.toObject();
    return this.messageResponse(Jid.BROADCAST, data);
  }

  public async deleteStatus(request: DeleteStatusRequest) {
    const participants = await this.prepareJidsForStatus(request.contacts);
    const key = parseMessageIdSerialized(request.id, true);
    const message = new messages.RevokeMessageRequest({
      session: this.session,
      jid: BROADCAST_ID,
      sender: '',
      messageId: key.id,
      participants: participants,
    });
    const response = await promisify(this.client.RevokeMessage)(message);
    const data = response.toObject();
    return this.messageResponse(BROADCAST_ID, data);
  }

  protected messageResponse(jid, data) {
    const message = data.message ? parseJson(data.message) : null;
    const id = buildMessageId({
      ID: data.id,
      IsFromMe: true,
      IsGroup: isJidGroup(jid) || isJidBroadcast(jid),
      Chat: jid,
      Sender: this.me.id,
    });
    return {
      id: id,
      _data: message,
    };
  }

  async checkNumberStatus(
    request: CheckNumberStatusQuery,
  ): Promise<WANumberExistResult> {
    let phone = request.phone.replace(/\+/g, '');
    const req = new messages.CheckPhonesRequest({
      session: this.session,
      phones: [phone],
    });
    const response = await promisify(this.client.CheckPhones)(req);
    const data = response.toObject();
    const info = data.infos[0];
    return {
      numberExists: info?.registered || false,
      chatId: toCusFormat(info?.jid || null),
    };
  }

  @Activity()
  async sendLocation(request: MessageLocationRequest) {
    const jid = toJID(this.ensureSuffix(request.chatId));
    const message = new messages.MessageRequest({
      jid: jid,
      session: this.session,
      replyTo: getMessageIdFromSerialized(request.reply_to),
      location: new messages.Location({
        name: request.title,
        degreesLatitude: request.latitude,
        degreesLongitude: request.longitude,
      }),
    });
    const response = await promisify(this.client.SendMessage)(message);
    const data = response.toObject();
    return this.messageResponse(jid, data);
  }

  forwardMessage(request: MessageForwardRequest): Promise<WAMessage> {
    throw new NotImplementedByEngineError();
  }

  sendImage(request: MessageImageRequest) {
    throw new AvailableInPlusVersion();
  }

  sendFile(request: MessageFileRequest) {
    throw new AvailableInPlusVersion();
  }

  sendVoice(request: MessageVoiceRequest) {
    throw new AvailableInPlusVersion();
  }

  sendLinkCustomPreview(
    request: MessageLinkCustomPreviewRequest,
  ): Promise<any> {
    throw new AvailableInPlusVersion();
  }

  @Activity()
  reply(request: MessageReplyRequest) {
    return this.sendText(request);
  }

  @Activity()
  async sendSeen(request: SendSeenRequest) {
    const keys = ExtractMessageKeysForRead(request);
    if (keys.length === 0) {
      return;
    }
    const receipts = esm.b.aggregateMessageKeysNotFromMe(keys);
    for (const receipt of receipts) {
      if (receipt.messageIds.length === 0) {
        return;
      }
      const req = new messages.MarkReadRequest({
        session: this.session,
        jid: receipt.jid,
        messageIds: receipt.messageIds,
        sender: receipt.participant,
      });
      const response = await promisify(this.client.MarkRead)(req);
      response.toObject();
    }
    return;
  }

  @Activity()
  async startTyping(chat: ChatRequest): Promise<void> {
    await this.setPresence(WAHAPresenceStatus.TYPING, chat.chatId);
  }

  @Activity()
  stopTyping(chat: ChatRequest) {
    return this.setPresence(WAHAPresenceStatus.PAUSED, chat.chatId);
  }

  /**
   * Group methods
   */
  @Activity()
  public async createGroup(request: CreateGroupRequest) {
    const req = new messages.CreateGroupRequest({
      session: this.session,
      name: request.name,
      participants: request.participants.map((p) => toJID(p.id)),
    });
    const response = await promisify(this.client.CreateGroup)(req);
    const data = parseJson(response);
    return data;
  }

  @Activity()
  public async joinInfoGroup(code: string): Promise<any> {
    const req = new messages.GroupCodeRequest({
      session: this.session,
      code: code,
    });
    const response = await promisify(this.client.GetGroupInfoFromLink)(req);
    const data = parseJson(response);
    return data;
  }

  @Activity()
  public async joinGroup(code: string): Promise<string> {
    const req = new messages.GroupCodeRequest({
      session: this.session,
      code: code,
    });
    const response = await promisify(this.client.JoinGroupWithLink)(req);
    const data = parseJson(response);
    return data.jid;
  }

  public async getGroups(pagination: PaginationParams) {
    const req = this.session;
    const response = await promisify(this.client.GetGroups)(req);
    const data = parseJsonList(response);
    switch (pagination.sortBy) {
      case GroupSortField.ID:
        pagination.sortBy = 'JID';
        break;
      case GroupSortField.SUBJECT:
        pagination.sortBy = 'Name';
        break;
    }
    const paginator = new PaginatorInMemory(pagination);
    return paginator.apply(data);
  }

  protected removeGroupsFieldParticipant(group: any) {
    delete group.Participants;
  }

  @Activity()
  public async refreshGroups(): Promise<boolean> {
    const req = this.session;
    await promisify(this.client.FetchGroups)(req);
    return true;
  }

  public async getGroup(id) {
    const req = new messages.JidRequest({
      session: this.session,
      jid: id,
    });
    const response = await promisify(this.client.GetGroupInfo)(req);
    const data = parseJson(response);
    return data;
  }

  public async getGroupParticipants(id: string): Promise<GroupParticipant[]> {
    const group = await this.getGroup(id);
    if (!group?.Participants?.length) {
      return [];
    }
    return ToGroupParticipants(group.Participants);
  }

  public async getInfoAdminsOnly(id): Promise<SettingsSecurityChangeInfo> {
    const group = await this.getGroup(id);
    return {
      adminsOnly: group.IsLocked,
    };
  }

  @Activity()
  public async setInfoAdminsOnly(id, value) {
    const req = new messages.JidBoolRequest({
      session: this.session,
      jid: id,
      value: value,
    });
    await promisify(this.client.SetGroupLocked)(req);
    return;
  }

  public async getMessagesAdminsOnly(id): Promise<SettingsSecurityChangeInfo> {
    const group = await this.getGroup(id);
    return {
      adminsOnly: group.IsAnnounce,
    };
  }

  @Activity()
  public async setMessagesAdminsOnly(id, value) {
    const req = new messages.JidBoolRequest({
      session: this.session,
      jid: id,
      value: value,
    });
    await promisify(this.client.SetGroupAnnounce)(req);
    return;
  }

  public deleteGroup(id) {
    throw new NotImplementedByEngineError();
  }

  @Activity()
  public async leaveGroup(id) {
    const req = new messages.JidRequest({
      session: this.session,
      jid: id,
    });
    await promisify(this.client.LeaveGroup)(req);
  }

  @Activity()
  public async setDescription(id, description) {
    const req = new messages.JidStringRequest({
      session: this.session,
      jid: id,
      value: description,
    });
    await promisify(this.client.SetGroupDescription)(req);
  }

  @Activity()
  public async setSubject(id, description) {
    const req = new messages.JidStringRequest({
      session: this.session,
      jid: id,
      value: description,
    });
    await promisify(this.client.SetGroupName)(req);
  }

  @Activity()
  public async getInviteCode(id): Promise<string> {
    const req = new messages.JidRequest({
      session: this.session,
      jid: id,
    });
    const response = await promisify(this.client.GetGroupInviteLink)(req);
    const data = response.toObject();
    return data.value;
  }

  @Activity()
  public async revokeInviteCode(id): Promise<string> {
    const req = new messages.JidRequest({
      session: this.session,
      jid: id,
    });
    const response = await promisify(this.client.RevokeGroupInviteLink)(req);
    const data = response.toObject();
    return data.value;
  }

  public async getParticipants(id) {
    const group = await this.getGroup(id);
    return group.Participants;
  }

  private async updateParticipants(
    id: string,
    participants: Array<Participant>,
    action: messages.ParticipantAction,
  ): Promise<any> {
    const jids = participants.map((p) => toJID(p.id));
    const req = new messages.UpdateParticipantsRequest({
      session: this.session,
      jid: id,
      participants: jids,
      action: action,
    });
    const response = await promisify(this.client.UpdateGroupParticipants)(req);
    const data = parseJsonList(response);
    return data;
  }

  @Activity()
  public addParticipants(id: string, request: ParticipantsRequest) {
    const action = messages.ParticipantAction.ADD;
    return this.updateParticipants(id, request.participants, action);
  }

  @Activity()
  public removeParticipants(id, request: ParticipantsRequest) {
    const action = messages.ParticipantAction.REMOVE;
    return this.updateParticipants(id, request.participants, action);
  }

  @Activity()
  public promoteParticipantsToAdmin(id, request: ParticipantsRequest) {
    const action = messages.ParticipantAction.PROMOTE;
    return this.updateParticipants(id, request.participants, action);
  }

  @Activity()
  public demoteParticipantsToUser(id, request: ParticipantsRequest) {
    const action = messages.ParticipantAction.DEMOTE;
    return this.updateParticipants(id, request.participants, action);
  }

  @Activity()
  async setReaction(request: MessageReactionRequest) {
    const key = parseMessageIdSerialized(request.messageId);
    const message = new messages.MessageReaction({
      session: this.session,
      jid: key.remoteJid,
      messageId: key.id,
      reaction: request.reaction,
      sender: key.fromMe ? this.me.id : key.participant || key.remoteJid,
    });
    const response = await promisify(this.client.SendReaction)(message);
    const data = response.toObject();
    return this.messageResponse(key.remoteJid, data);
  }

  @Activity()
  async sendEvent(request: EventMessageRequest): Promise<WAMessage> {
    const jid = toJID(this.ensureSuffix(request.chatId));
    const event = request.event;

    // Create EventLocation if provided
    let location = null;
    if (event.location) {
      location = new messages.EventLocation({
        name: event.location.name,
        // Doesn't work right now
        degreesLatitude: 0,
        degreesLongitude: 0,
      });
    }

    // Create event payload
    const eventMessage = new messages.EventMessage({
      name: event.name,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      location: location,
      extraGuestsAllowed: event.extraGuestsAllowed,
    });

    // Create message
    const message = new messages.MessageRequest({
      jid: jid,
      session: this.session,
      event: eventMessage,
      replyTo: getMessageIdFromSerialized(request.reply_to),
    });

    const response = await promisify(this.client.SendMessage)(message);
    const data = response.toObject();
    return this.messageResponse(jid, data) as any;
  }

  @Activity()
  async cancelEvent(eventId: string): Promise<WAMessage> {
    throw new Error('Method not implemented.');

    const key = parseMessageIdSerialized(eventId, false);
    const jid = key.remoteJid;
    const request = new messages.CancelEventMessageRequest({
      session: this.session,
      jid: jid,
      messageId: key.id,
    });
    const response = await promisify(this.client.CancelEventMessage)(request);
    const data = response.toObject();
    return this.messageResponse(jid, data) as any;
  }

  public async setPresence(presence: WAHAPresenceStatus, chatId?: string) {
    let request: any;
    let method: any;
    const jid = chatId ? toJID(this.ensureSuffix(chatId)) : null;
    switch (presence) {
      case WAHAPresenceStatus.ONLINE:
        request = new messages.PresenceRequest({
          session: this.session,
          status: messages.Presence.AVAILABLE,
        });
        method = this.client.SendPresence;
        break;
      case WAHAPresenceStatus.OFFLINE:
        request = new messages.PresenceRequest({
          session: this.session,
          status: messages.Presence.UNAVAILABLE,
        });
        method = this.client.SendPresence;
        break;
      case WAHAPresenceStatus.TYPING:
        await this.maintainPresenceOnline();
        request = new messages.ChatPresenceRequest({
          session: this.session,
          jid: jid,
          status: messages.ChatPresence.TYPING,
        });
        method = this.client.SendChatPresence;
        break;
      case WAHAPresenceStatus.RECORDING:
        await this.maintainPresenceOnline();
        request = new messages.ChatPresenceRequest({
          session: this.session,
          jid: jid,
          status: messages.ChatPresence.RECORDING,
        });
        method = this.client.SendChatPresence;
        break;
      case WAHAPresenceStatus.PAUSED:
        await this.maintainPresenceOnline();
        request = new messages.ChatPresenceRequest({
          session: this.session,
          jid: jid,
          status: messages.ChatPresence.PAUSED,
        });
        method = this.client.SendChatPresence;
        break;

      default:
        throw new Error('Invalid presence status');
    }
    await promisify(method)(request);
    this.presence = presence;
  }

  public async getPresences(): Promise<WAHAChatPresences[]> {
    const result: WAHAChatPresences[] = [];
    for (const remoteJid in this.presences.keys()) {
      const storedPresences = this.presences.get(remoteJid);
      result.push(this.toWahaPresences(remoteJid, storedPresences));
    }
    return result;
  }

  public async getPresence(chatId: string): Promise<WAHAChatPresences> {
    const jid = toJID(chatId);
    await this.subscribePresence(jid);
    if (!(jid in this.presences.keys())) {
      await sleep(1000);
    }
    const result = this.presences.get(jid) || [];
    return this.toWahaPresences(jid, result);
  }

  @Activity()
  async subscribePresence(chatId: string) {
    const jid = toJID(chatId);
    const req = new messages.SubscribePresenceRequest({
      session: this.session,
      jid: jid,
    });
    const response = await promisify(this.client.SubscribePresence)(req);
    return response.toObject();
  }

  protected toWahaPresenceData(
    data: gows.Presence | gows.ChatPresence,
  ): WAHAPresenceData {
    if ('From' in data) {
      data = data as gows.Presence;
      const lastKnownPresence = data.Unavailable
        ? WAHAPresenceStatus.OFFLINE
        : WAHAPresenceStatus.ONLINE;
      return {
        participant: toCusFormat(data.From),
        lastKnownPresence: lastKnownPresence,
        lastSeen: parseTimestampToSeconds(data.LastSeen),
      };
    }

    data = data as gows.ChatPresence;
    let lastKnownPresence: WAHAPresenceStatus;
    if (data.State === gows.ChatPresenceState.PAUSED) {
      lastKnownPresence = WAHAPresenceStatus.PAUSED;
    } else if (
      data.State === gows.ChatPresenceState.COMPOSING &&
      data.Media === gows.ChatPresenceMedia.TEXT
    ) {
      lastKnownPresence = WAHAPresenceStatus.TYPING;
    } else if (
      data.State === gows.ChatPresenceState.COMPOSING &&
      data.Media === gows.ChatPresenceMedia.AUDIO
    ) {
      lastKnownPresence = WAHAPresenceStatus.RECORDING;
    }
    return {
      participant: toCusFormat(data.Sender),
      lastKnownPresence: lastKnownPresence,
      lastSeen: null,
    };
  }

  protected toWahaPresences(
    jid,
    result: null | gows.Presence[] | gows.ChatPresence[],
  ): WAHAChatPresences {
    const chatId = toCusFormat(jid);
    return {
      id: chatId,
      presences: result?.map(this.toWahaPresenceData.bind(this)),
    };
  }

  /**
   * Channels methods
   */
  public searchChannelsByView(
    query: ChannelSearchByView,
  ): Promise<ChannelListResult> {
    throw new AvailableInPlusVersion();
  }

  public searchChannelsByText(
    query: ChannelSearchByText,
  ): Promise<ChannelListResult> {
    throw new AvailableInPlusVersion();
  }

  public async previewChannelMessages(
    inviteCode: string,
    query: PreviewChannelMessages,
  ): Promise<ChannelMessage[]> {
    throw new AvailableInPlusVersion();
  }

  protected toChannel(newsletter: messages.Newsletter): Channel {
    const role: ChannelRole =
      (newsletter.role?.toUpperCase() as ChannelRole) || ChannelRole.GUEST;
    let picture = newsletter.picture;
    if (picture.startsWith('/')) {
      picture = esm.b.getUrlFromDirectPath(picture);
    }
    let preview = newsletter.preview;
    if (preview.startsWith('/')) {
      preview = esm.b.getUrlFromDirectPath(preview);
    }
    return {
      id: newsletter.id,
      name: newsletter.name,
      description: newsletter.description,
      invite: getChannelInviteLink(newsletter.invite),
      picture: picture,
      preview: preview,
      verified: newsletter.verified,
      role: role,
      subscribersCount: newsletter.subscriberCount,
    };
  }

  public async channelsList(query: ListChannelsQuery): Promise<Channel[]> {
    const request = new messages.NewsletterListRequest({
      session: this.session,
    });
    const response = await promisify(this.client.GetSubscribedNewsletters)(
      request,
    );
    const data = response.toObject();
    const newsletters = data.newsletters;
    let channels: Channel[] = newsletters.map(this.toChannel.bind(this));
    if (query.role) {
      // @ts-ignore
      channels = channels.filter((channel) => channel.role === query.role);
    }
    return channels;
  }

  @Activity()
  public async channelsCreateChannel(
    request: CreateChannelRequest,
  ): Promise<Channel> {
    const req = new messages.CreateNewsletterRequest({
      session: this.session,
      name: request.name,
      description: request.description,
    });
    const response = await promisify(this.client.CreateNewsletter)(req);
    const newsletter = response.toObject() as messages.Newsletter;
    return this.toChannel(newsletter);
  }

  @Activity()
  public async channelsGetChannel(id: string): Promise<Channel> {
    return await this.channelsGetChannelByInviteCode(id);
  }

  @Activity()
  public async channelsGetChannelByInviteCode(
    inviteCode: string,
  ): Promise<Channel> {
    const request = new messages.NewsletterInfoRequest({
      session: this.session,
      id: inviteCode,
    });
    const response = await promisify(this.client.GetNewsletterInfo)(request);
    const newsletter = response.toObject() as messages.Newsletter;
    return this.toChannel(newsletter);
  }

  @Activity()
  public channelsFollowChannel(id: string): Promise<any> {
    return this.channelsToggleFollow(id, true);
  }

  @Activity()
  public channelsUnfollowChannel(id: string): Promise<any> {
    return this.channelsToggleFollow(id, false);
  }

  protected async channelsToggleFollow(id: string, follow: boolean) {
    const request = new messages.NewsletterToggleFollowRequest({
      session: this.session,
      jid: id,
      follow: follow,
    });
    const response = await promisify(this.client.NewsletterToggleFollow)(
      request,
    );
    return response.toObject();
  }

  @Activity()
  public channelsMuteChannel(id: string): Promise<void> {
    return this.channelsToggleMute(id, true);
  }

  @Activity()
  public channelsUnmuteChannel(id: string): Promise<void> {
    return this.channelsToggleMute(id, false);
  }

  protected async channelsToggleMute(id: string, mute: boolean): Promise<any> {
    const request = new messages.NewsletterToggleMuteRequest({
      session: this.session,
      jid: id,
      mute: mute,
    });
    const response = await promisify(this.client.NewsletterToggleMute)(request);
    return response.toObject();
  }

  /**
   * Contacts methods
   */
  @Activity()
  public async upsertContact(chatId: string, body: ContactUpdateBody) {
    const jid = toJID(chatId);
    const request = new messages.UpdateContactRequest({
      session: this.session,
      jid: jid,
      firstName: body.firstName || '',
      lastName: body.lastName || '',
    });
    const response = await promisify(this.client.UpdateContact)(request);
    response.toObject();
  }

  protected toWAContact(contact) {
    return {
      id: toCusFormat(contact.Jid),
      name: contact.Name,
      pushname: contact.PushName,
    };
  }

  public async getContact(query: ContactQuery) {
    const jid = toJID(query.contactId);
    const request = new messages.EntityByIdRequest({
      session: this.session,
      id: jid,
    });
    const response = await promisify(this.client.GetContactById)(request);
    const data = parseJson(response);
    return this.toWAContact(data);
  }

  public async getContacts(pagination: PaginationParams) {
    const request = new messages.GetContactsRequest({
      session: this.session,
      pagination: new messages.Pagination({
        limit: pagination.limit,
        offset: pagination.offset,
      }),
      sortBy: new messages.SortBy({
        field: pagination.sortBy || 'id',
        order:
          pagination.sortOrder === SortOrder.DESC
            ? messages.SortBy.Order.DESC
            : messages.SortBy.Order.ASC,
      }),
    });
    const response = await promisify(this.client.GetContacts)(request);
    const data = parseJsonList(response);
    return data.map(this.toWAContact.bind(this));
  }

  /**
   * Lid to Phone Number methods
   */
  public async getAllLids(
    pagination: PaginationParams,
  ): Promise<Array<LidToPhoneNumber>> {
    const request = new messages.GetLidsRequest({
      session: this.session,
    });
    const response = await promisify(this.client.GetAllLids)(request);
    const data = parseJsonList(response);

    const lids = data.map((item) => ({
      lid: item.lid,
      pn: toCusFormat(item.pn),
    }));

    // Use in-memory pagination
    const paginator = new PaginatorInMemory(pagination);
    return paginator.apply(lids);
  }

  public async getLidsCount(): Promise<number> {
    const response = await promisify(this.client.GetLidsCount)(this.session);
    return response?.value;
  }

  public async findPNByLid(lid: string): Promise<LidToPhoneNumber> {
    const request = new messages.EntityByIdRequest({
      session: this.session,
      id: lid,
    });
    const response = await promisify(this.client.FindPNByLid)(request);
    const phoneNumber = response?.value;
    return {
      lid: lid,
      pn: phoneNumber ? toCusFormat(phoneNumber) : null,
    };
  }

  public async findLIDByPhoneNumber(
    phoneNumber: string,
  ): Promise<LidToPhoneNumber> {
    const pn = toJID(phoneNumber);
    const request = new messages.EntityByIdRequest({
      session: this.session,
      id: pn,
    });
    const response = await promisify(this.client.FindLIDByPhoneNumber)(request);
    const lid = response.value;
    return {
      lid: lid || null,
      pn: toCusFormat(pn),
    };
  }

  /**
   * Chats methods
   */
  public async getChatsOverview(
    pagination: PaginationParams,
    filter?: OverviewFilter,
  ): Promise<ChatSummary[]> {
    if (!pagination.sortBy) {
      pagination.sortBy = 'timestamp';
    }
    if (!pagination.sortOrder) {
      pagination.sortOrder = SortOrder.DESC;
    }
    const chats = await this.getChats(pagination, filter);

    const promises = [];
    for (const chat of chats) {
      promises.push(this.fetchChatSummary(chat));
    }
    const result = await Promise.all(promises);
    return result;
  }

  protected async fetchChatSummary(chat): Promise<ChatSummary> {
    const id = toCusFormat(chat.id);
    const name = chat.name;
    const picture = await this.getContactProfilePicture(chat.id, false);
    const messages = await this.getChatMessages(
      chat.id,
      { limit: 1, offset: 0, downloadMedia: false },
      {},
    );
    const message = messages.length > 0 ? messages[0] : null;
    return {
      id: id,
      name: name || null,
      picture: picture,
      lastMessage: message,
      _chat: chat,
    };
  }

  protected toWAChat(chat) {
    return {
      id: toCusFormat(chat.Jid),
      name: chat.Name,
      conversationTimestamp: parseTimestampToSeconds(
        chat.ConversationTimestamp,
      ),
    };
  }

  public async getChats(
    pagination: PaginationParams,
    filter: OverviewFilter | null = null,
  ) {
    if (pagination.sortBy === ChatSortField.CONVERSATION_TIMESTAMP) {
      pagination.sortBy = 'timestamp';
    }
    let jids = [];
    if (filter?.ids && filter.ids.length > 0) {
      jids = filter.ids.map((id) => toJID(id));
    }
    const request = new messages.GetChatsRequest({
      session: this.session,
      pagination: new messages.Pagination({
        limit: pagination.limit,
        offset: pagination.offset,
      }),
      sortBy: new messages.SortBy({
        field: pagination.sortBy || 'id',
        order:
          pagination.sortOrder === SortOrder.DESC
            ? messages.SortBy.Order.DESC
            : messages.SortBy.Order.ASC,
      }),
      filter: new messages.ChatFilter({
        jids: jids,
      }),
    });
    const response = await promisify(this.client.GetChats)(request);
    const data = parseJsonList(response);
    return data.map(this.toWAChat.bind(this));
  }

  public async getChatMessages(
    chatId: string,
    query: GetChatMessagesQuery,
    filter: GetChatMessagesFilter,
  ) {
    const downloadMedia = query.downloadMedia;
    let jid: messages.OptionalString;
    if (chatId === 'all') {
      jid = null;
    } else {
      jid = new messages.OptionalString({
        value: toJID(this.ensureSuffix(chatId)),
      });
    }

    const status =
      filter['filter.ack'] != null ? AckToStatus(filter['filter.ack']) : null;
    const request = new messages.GetMessagesRequest({
      session: this.session,
      filters: new messages.MessageFilters({
        jid: jid,
        timestampGte: optional(
          filter['filter.timestamp.gte'],
          messages.OptionalUInt64,
        ),
        timestampLte: optional(
          filter['filter.timestamp.lte'],
          messages.OptionalUInt64,
        ),
        fromMe: optional(filter['filter.fromMe'], messages.OptionalBool),
        status: optional(status, messages.OptionalUInt32),
      }),
      sortBy: new messages.SortBy({
        field: query.sortBy || MessageSortField.TIMESTAMP,
        order:
          query.sortOrder === SortOrder.ASC
            ? messages.SortBy.Order.ASC
            : messages.SortBy.Order.DESC,
      }),
      pagination: new messages.Pagination({
        limit: query.limit,
        offset: query.offset,
      }),
    });
    const response = await promisify(this.client.GetMessages)(request);
    const msgs = parseJsonList(response);
    const promises = [];
    for (const msg of msgs) {
      promises.push(this.processIncomingMessage(msg, downloadMedia));
    }
    let result = await Promise.all(promises);
    result = result.filter(Boolean);
    return result;
  }

  @Activity()
  public readChatMessages(
    chatId: string,
    request: ReadChatMessagesQuery,
  ): Promise<ReadChatMessagesResponse> {
    return this.readChatMessagesWSImpl(chatId, request);
  }

  public async getChatMessage(
    chatId: string,
    messageId: string,
    query: GetChatMessageQuery,
  ): Promise<null | WAMessage> {
    const key = parseMessageIdSerialized(messageId, true);
    const request = new messages.EntityByIdRequest({
      session: this.session,
      id: key.id,
    });
    const response = await promisify(this.client.GetMessageById)(request);
    const msg = parseJson(response);
    return this.processIncomingMessage(msg, query.downloadMedia);
  }

  /**
   * Labels methods
   */

  public async getLabels(): Promise<Label[]> {
    const request = new messages.GetLabelsRequest({
      session: this.session,
    });
    const response = await promisify(this.client.GetLabels)(request);
    const labels = parseJsonList(response);
    return labels.map(this.toLabel);
  }

  @Activity()
  public async createLabel(labelDto: LabelDTO): Promise<Label> {
    const labels = await this.getLabels();
    const highestLabelId = lodash.max(
      labels.map((label) => parseInt(label.id)),
    );
    const labelId = highestLabelId ? highestLabelId + 1 : 1;
    const label: Label = {
      id: labelId.toString(),
      name: labelDto.name,
      color: labelDto.color,
      colorHex: Label.toHex(labelDto.color),
    };
    return this.updateLabel(label);
  }

  protected toLabel(label: any): Label {
    const color = label.color;
    return {
      id: label.id,
      name: label.name,
      color: color,
      colorHex: Label.toHex(color),
    };
  }

  @Activity()
  public async updateLabel(label: Label): Promise<Label> {
    const request = new messages.UpsertLabelRequest({
      session: this.session,
      label: new messages.Label({
        id: label.id,
        name: label.name,
        color: label.color,
      }),
    });
    await promisify(this.client.UpsertLabel)(request);
    return label;
  }

  @Activity()
  public async deleteLabel(label: Label): Promise<void> {
    const request = new messages.DeleteLabelRequest({
      session: this.session,
      label: new messages.Label({
        id: label.id,
        name: label.name,
        color: label.color,
      }),
    });
    await promisify(this.client.DeleteLabel)(request);
  }

  public async getChatsByLabelId(labelId: string) {
    const request = new messages.EntityByIdRequest({
      session: this.session,
      id: labelId,
    });
    const response = await promisify(this.client.GetChatsByLabelId)(request);
    const ids = parseJsonList(response);
    return ids.map((jid) => {
      return {
        id: toCusFormat(jid),
      };
    });
  }

  public async getChatLabels(chatId: string): Promise<Label[]> {
    const jid = toJID(chatId);
    const request = new messages.EntityByIdRequest({
      session: this.session,
      id: jid,
    });
    const response = await promisify(this.client.GetLabelsByJid)(request);
    const labels = parseJsonList(response);
    return labels.map(this.toLabel);
  }

  @Activity()
  public async chatsUnreadChat(chatId: string): Promise<any> {
    const jid = toJID(this.ensureSuffix(chatId));
    const request = new messages.ChatUnreadRequest({
      session: this.session,
      jid: jid,
      read: false,
    });
    await promisify(this.client.MarkChatUnread)(request);
    return { success: true };
  }

  @Activity()
  public async putLabelsToChat(chatId: string, labels: LabelID[]) {
    const jid = toJID(chatId);
    const labelsIds = labels.map((label) => label.id);
    const currentLabels = await this.getChatLabels(jid);
    const currentLabelsIds = currentLabels.map((label) => label.id);
    const addLabelsIds = lodash.difference(labelsIds, currentLabelsIds);
    const removeLabelsIds = lodash.difference(currentLabelsIds, labelsIds);
    for (const labelId of addLabelsIds) {
      const request = new messages.ChatLabelRequest({
        session: this.session,
        labelId: labelId,
        chatId: jid,
      });
      await promisify(this.client.AddChatLabel)(request);
    }
    for (const labelId of removeLabelsIds) {
      const request = new messages.ChatLabelRequest({
        session: this.session,
        labelId: labelId,
        chatId: jid,
      });
      await promisify(this.client.RemoveChatLabel)(request);
    }
  }

  //
  // END - Methods for API
  //

  protected shouldProcessIncomingMessage(message): boolean {
    // if there is no text or media message
    if (!message) return;
    if (!message.Message) return;

    const content = esm.b.normalizeMessageContent(message.Message);
    // Ignore reactions, we have a dedicated handler for that
    if (content.reactionMessage) return;
    // Ignore poll votes, we have a dedicated handler for that
    if (content.pollUpdateMessage) return;
    // Ignore event response, we have a dedicated handler for that
    if (content.encEventResponseMessage) return;
    // Ignore protocol messages
    if (content.protocolMessage) return;

    const contentType = esm.b.getContentType(content);
    // Ignore device sent message
    if (contentType == 'deviceSentMessage') {
      return;
    }
    const hasSomeContent = !!contentType;
    if (!hasSomeContent) {
      // Ignore key distribution messages
      if (message?.Message?.senderKeyDistributionMessage) return;
    }
    return true;
  }

  protected async processIncomingMessage(message, downloadMedia = true) {
    // Filter
    if (!this.shouldProcessIncomingMessage(message)) {
      return null;
    }
    // Convert
    const wamessage = this.toWAMessage(message);
    // Media
    if (downloadMedia) {
      const media = await this.downloadMediaSafe(message);
      wamessage.media = media;
    }
    return wamessage;
  }

  protected async downloadMediaSafe(message) {
    try {
      return await this.downloadMedia(message);
    } catch (e) {
      this.logger.error('Failed when tried to download media for a message');
      this.logger.error(e, e.stack);
      return null;
    }
  }

  protected async downloadMedia(message) {
    const processor = new GOWSEngineMediaProcessor(this);
    const media = await this.mediaManager.processMedia(
      processor,
      message,
      this.name,
    );
    return media;
  }

  protected toWAMessage(message): WAMessage {
    const fromToParticipant = getFromToParticipant(message);
    const id = buildMessageId(message);
    const body = extractBody(message.Message);
    const replyTo = this.extractReplyTo(message.Message);
    let ack = statusToAck(message.Status);
    if (ack === WAMessageAck.ERROR) {
      // GOWS error because of how golang treats it as null
      // It'll be UNKNOWN instead of ERROR
      ack = null;
    }
    const mediaContent = extractMediaContent(message.Message);
    const source = this.getSourceDeviceByMsg(message);

    let waproto: proto.Message | null = null;
    try {
      waproto = GoToJSWAProto(message.Message);
    } catch (e) {
      this.logger.error(
        'Failed to resolve proto message from GOWS to JS format',
      );
      this.logger.error(e, e.stack);
    }

    return {
      id: id,
      timestamp: parseTimestampToSeconds(message.Info.Timestamp),
      from: toCusFormat(fromToParticipant.from),
      fromMe: message.Info.IsFromMe,
      source: source,
      body: body,
      to: toCusFormat(fromToParticipant.to),
      participant: toCusFormat(fromToParticipant.participant),
      // Media
      hasMedia: Boolean(mediaContent),
      media: null,
      mediaUrl: message.media?.url,
      // @ts-ignore
      ack: ack,
      location: extractWALocation(waproto),
      vCards: extractVCards(waproto),
      ackName: WAMessageAck[ack] || ACK_UNKNOWN,
      replyTo: replyTo,
      _data: message,
    };
  }

  private toPollVotePayload(event: any): PollVotePayload {
    // Extract event creation message key from the message
    const creationKey = event.Message?.pollUpdateMessage.pollCreationMessageKey;
    const pollKey: proto.IMessageKey = {
      remoteJid: creationKey.remoteJID,
      fromMe: creationKey.fromMe,
      id: creationKey.ID,
      participant: creationKey.participant,
    };
    const voteKey: proto.IMessageKey = {
      id: event.Info.ID,
      remoteJid: event.Info.Chat,
      participant: event.IsGroup ? event.Info.Sender : null,
      fromMe: event.IsFromMe,
    };
    const key = fixPollCreationKey(voteKey, pollKey, this.me);
    const fromToParticipant = getFromToParticipant(event);
    const pollCreationKey = getDestination(key);
    return {
      poll: pollCreationKey,
      vote: {
        id: buildMessageId(event),
        from: toCusFormat(fromToParticipant.from),
        fromMe: event.Info.IsFromMe,
        to: toCusFormat(fromToParticipant.to),
        participant: toCusFormat(fromToParticipant.participant),
        selectedOptions: event.Votes,
        timestamp: event.Message.pollUpdateMessage.senderTimestampMS,
      },
      _data: event,
    };
  }

  private getCallId(call: any): string | null {
    return call?.CallID || call?.Data?.Attrs?.['call-id'] || null;
  }

  private shouldProcessCallEvent(call: any): boolean {
    if (!call) {
      return false;
    }
    if (call.GroupJID && this.jids.include(call.GroupJID)) {
      return true;
    }
    return this.jids.include(call.From);
  }

  private toCallData(call: any): CallData {
    const date = call?.Timestamp ? new Date(call.Timestamp) : new Date();
    const timestamp = date.getTime() / 1000;
    const isVideo = this.isVideoCall(call);
    const isGroup = this.isGroupCall(call);
    const from = call?.From || call?.GroupJID;
    return {
      id: this.getCallId(call),
      from: from ? toCusFormat(from) : undefined,
      timestamp: timestamp,
      isVideo: Boolean(isVideo),
      isGroup: isGroup,
      _data: call,
    };
  }

  private isVideoCall(call: any): boolean {
    if (!call) return false;
    if (call?.Media === 'video') return true;
    const attrsMedia = call?.Data?.Attrs?.media || call?.Data?.Attrs?.type;
    if (attrsMedia === 'video') return true;
    const content = call?.Data?.Content;
    if (Array.isArray(content)) {
      const hasVideoTag = content.some((item: any) => item?.Tag === 'video');
      if (hasVideoTag) {
        return true;
      }
    }
    return false;
  }

  private isGroupCall(call: any): boolean {
    if (!call) return false;
    if (call?.GroupJID) return true;
    const attrs = call?.Data?.Attrs;
    if (!attrs) return false;
    return attrs.type === 'group' || Boolean(attrs['group-jid']);
  }

  private toEventResponsePayload(event: any): EventResponsePayload {
    const msg = this.toWAMessage(event);
    let response: EventResponse | null = null;
    if (event.EventResponse) {
      response = {
        response: ParseEventResponseType(event.EventResponse.response),
        timestampMs: event.EventResponse.timestampMS,
        extraGuestCount: event.EventResponse.extraGuestCount || 0,
      };
    }

    // Extract event creation message key from the message
    const message = event.Message || event.message;
    const eventCreationMessageKey =
      message?.encEventResponseMessage?.eventCreationMessageKey;
    const key: WAMessageKey = {
      remoteJid: eventCreationMessageKey.remoteJID,
      fromMe: eventCreationMessageKey.fromMe,
      id: eventCreationMessageKey.ID,
      participant: eventCreationMessageKey.participant,
    };
    const eventCreationKey = getDestination(key);

    return {
      ...msg,
      eventCreationKey: eventCreationKey,
      eventResponse: response,
      _data: event,
    };
  }

  private getSourceDeviceByMsg(message): MessageSource {
    if (!message.Info.IsFromMe) {
      return MessageSource.APP;
    }
    // @ts-ignore
    const myJid = this.me.jid;
    const myDeviceId = extractDeviceId(myJid);
    const sentDeviceId = extractDeviceId(message.Info.Sender);
    return sentDeviceId === myDeviceId ? MessageSource.API : MessageSource.APP;
  }

  protected extractReplyTo(message): ReplyToMessage | null {
    const msgType = esm.b.getContentType(message);
    const contextInfo = message[msgType]?.contextInfo;
    if (!contextInfo) {
      return null;
    }
    const quotedMessage = contextInfo.quotedMessage;
    if (!quotedMessage) {
      return null;
    }
    const body = extractBody(quotedMessage);
    return {
      id: contextInfo.stanzaID,
      participant: toCusFormat(contextInfo.participant),
      body: body,
      _data: quotedMessage,
    };
  }

  public async getEngineInfo() {
    const clientState = this.client?.getChannel().getConnectivityState(false);
    const streamState = this.stream$?.client
      ?.getChannel()
      .getConnectivityState(false);
    const grpc = {
      client: connectivityState[clientState] || 'NO_CLIENT',
      stream: connectivityState[streamState] || 'NO_STREAM',
    };
    if (!this.client) {
      return {
        grpc: grpc,
      };
    }

    let gows;
    try {
      const response = await promisify(this.client.GetSessionState)(
        this.session,
      );
      const info = response.toObject();
      gows = { ...info };
    } catch (err) {
      gows = { error: err };
    }
    return {
      grpc: grpc,
      gows: gows,
    };
  }

  receiptToMessageAck(receipt: any): WAMessageAckBody[] {
    const fromToParticipant = getFromToParticipant(receipt);

    let ack;
    switch (receipt.Type) {
      case '':
        ack = WAMessageAck.DEVICE;
        break;
      case 'server-error':
        ack = WAMessageAck.ERROR;
        break;
      case 'inactive':
        ack = WAMessageAck.DEVICE;
        break;
      case 'active':
        ack = WAMessageAck.DEVICE;
        break;
      case 'read':
        ack = WAMessageAck.READ;
        break;
      case 'played':
        ack = WAMessageAck.PLAYED;
        break;
      default:
        return [];
    }
    const acks = [];
    for (const messageId of receipt.MessageIDs) {
      const msg = {
        ...receipt,
        ID: messageId,
        // Reverse the IsFromMe flag
        IsFromMe: !receipt.IsFromMe,
        Sender: receipt.MessageSender || this.me?.id,
      };
      const id = buildMessageId(msg);
      const body: WAMessageAckBody = {
        id: id,
        from: toCusFormat(fromToParticipant.from),
        to: toCusFormat(fromToParticipant.to),
        participant: toCusFormat(fromToParticipant.participant),
        fromMe: msg.IsFromMe,
        ack: ack,
        ackName: WAMessageAck[ack] || ACK_UNKNOWN,
        _data: receipt,
      };
      acks.push(body);
    }
    return acks;
  }

  private processMessageReaction(message): WAMessageReaction | null {
    if (!message) return null;
    if (!message.Message) return null;
    if (!message.Message.reactionMessage) return null;

    const id = buildMessageId(message);
    const fromToParticipant = getFromToParticipant(message);
    const reactionMessage = message.Message.reactionMessage;
    const messageId = this.buildMessageIdFromKey(reactionMessage.key);
    const source = this.getSourceDeviceByMsg(message);
    const reaction: WAMessageReaction = {
      id: id,
      timestamp: parseTimestampToSeconds(message.Info.Timestamp),
      from: toCusFormat(fromToParticipant.from),
      fromMe: message.Info.IsFromMe,
      source: source,
      to: toCusFormat(fromToParticipant.to),
      participant: toCusFormat(fromToParticipant.participant),
      reaction: {
        text: reactionMessage.text,
        messageId: messageId,
      },
    };
    return reaction;
  }

  buildMessageIdFromKey(key: WARawKey) {
    const sender = key.fromMe ? this.me.id : key.participant || key.remoteJID;
    const info: MessageIdData = {
      Chat: key.remoteJID,
      Sender: sender,
      ID: key.ID,
      IsFromMe: key.fromMe,
      IsGroup: isJidGroup(key.remoteJID),
    };
    return buildMessageId(info);
  }
}

export class GOWSEngineMediaProcessor implements IMediaEngineProcessor<any> {
  constructor(public session: WhatsappSessionGoWSCore) {}

  hasMedia(message: any): boolean {
    return Boolean(extractMediaContent(message.Message));
  }

  getChatId(message: any): string {
    return toCusFormat(message.Info.Chat);
  }

  getMessageId(message: any): string {
    return message.Info.ID;
  }

  getMimetype(message: any): string {
    const content = extractMediaContent(message.Message);
    return content.mimetype;
  }

  async getMediaBuffer(message: any): Promise<Buffer | null> {
    const mediaDownloadTimeoutMs = 600_000; // 10 minutes

    const data = JSON.stringify(message.Message);
    const tmpdir = new TmpDir(
      this.session.logger,
      `waha-media-${this.session.name}-`,
    );
    return await tmpdir.use(async (dir) => {
      const file = path.join(dir, 'content.tmp');
      const request = new messages.DownloadMediaRequest({
        // double "session" it's not a mistake here
        session: this.session.session,
        message: data,
        jid: message.Info.Chat,
        messageId: message.Info.ID,
        contentPath: file,
      });

      const opts = {
        deadline: new Date(Date.now() + mediaDownloadTimeoutMs),
      };
      const call = promisify(
        this.session.client.DownloadMedia.bind(this.session.client),
      );
      try {
        const response = await call(request, opts);
        const obj = response.toObject();
        if (!obj.contentPath) {
          // Read directly from grpc response
          return Buffer.from(obj.content);
        } else {
          // Read from the file
          return await fsp.readFile(obj.contentPath);
        }
      } catch (err) {
        if (err?.code === grpc.status.DEADLINE_EXCEEDED) {
          err.message = `DownloadMedia timed out after ${mediaDownloadTimeoutMs}ms for message '${message?.Info?.ID}'`;
        }
        throw err;
      }
    });
  }

  getFilename(message: any): string | null {
    const content = extractMediaContent(message.Message);
    return content?.fileName;
  }
}

function isMine(message) {
  return !!message.Info.IsFromMe;
}

function getFromToParticipant(message) {
  const info = message.Info || message;
  return {
    from: info.Chat,
    to: info.IsGroup ? info.Sender : null,
    participant: info.IsGroup ? info.Sender : null,
    fromMe: info.IsFromMe,
  };
}

interface MessageIdData {
  Info?: MessageIdData;
  Chat: string;
  Sender: string;
  ID: string;
  IsFromMe: boolean;
  IsGroup: boolean;
}

function buildMessageId(message: MessageIdData) {
  const info = message.Info || message;
  const chatId = toCusFormat(info.Chat);
  const participant = toCusFormat(info.Sender);
  if (info.IsGroup) {
    return `${info.IsFromMe}_${chatId}_${info.ID}_${participant}`;
  }
  return `${info.IsFromMe}_${chatId}_${info.ID}`;
}

interface WARawKey {
  remoteJID: string;
  fromMe: boolean;
  ID: string;
  participant?: string;
}

function parseTimestamp(timestamp: string): number {
  if (timestamp.startsWith('0001')) {
    return null;
  }
  // "2024-12-25T14:28:42+03:00" => 1234567890
  return new Date(timestamp).getTime();
}

function parseTimestampToSeconds(timestamp: string): number {
  const ms = parseTimestamp(timestamp);
  if (!ms) {
    return ms;
  }
  return Math.floor(ms / 1000);
}

export function getMessageIdFromSerialized(serialized: string): string | null {
  if (!serialized) {
    return null;
  }
  const key = parseMessageIdSerialized(serialized, true);
  return key.id;
}

/**
 * Poll creation keys are a bit tricky — they contain the data that the receiver uses.
 * When recipients respond to a poll, they send back THEIR `message.id`.
 *
 * For example,
 * - If we send a poll and in our system the ID is "true_{chatId}_{ID}",
 * - The corresponding `pollCreationKey` will be "false_{ourId}_{ID}" —
 *   essentially the opposite of our message ID.
 *
 * The function inspects the key and,
 * if it originates from us (based on `remoteJid` or `participant`),
 * adjusts it to the correct value.
 */

function fixPollCreationKey(
  vote: proto.IMessageKey,
  poll: proto.IMessageKey,
  me: MeInfo,
): proto.IMessageKey {
  // If the vote is from me, the pollCreationKey is already in my perspective
  if (vote?.fromMe) {
    return poll;
  }
  if (!me) {
    return poll;
  }
  if (!poll) {
    return poll;
  }

  // DM - my poll, not my vote
  if (
    toCusFormat(poll.remoteJid) == toCusFormat(me.id) ||
    toCusFormat(poll.remoteJid) == toCusFormat(me.lid)
  ) {
    return {
      id: poll.id,
      remoteJid: vote.remoteJid,
      fromMe: true,
      participant: undefined,
    };
  }

  // Many Participants Chat - my poll, not my vote
  if (
    toCusFormat(poll.participant) == toCusFormat(me.id) ||
    toCusFormat(poll.participant) == toCusFormat(me.lid)
  ) {
    return {
      id: poll.id,
      remoteJid: vote.remoteJid,
      fromMe: true,
      participant: me.id,
    };
  }

  // Other
  return poll;
}
