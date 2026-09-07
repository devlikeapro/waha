import makeWASocket, {
  Browsers,
  Chat,
  Contact,
  decryptPollVote,
  DisconnectReason,
  downloadMediaMessage,
  extractMessageContent,
  generateMessageIDV2,
  getAggregateVotesInPollMessage,
  getContentType,
  getKeyAuthor,
  isPnUser,
  isRealMessage,
  jidNormalizedUser,
  makeCacheableSignalKeyStore,
  MiscMessageGenerationOptions,
  normalizeMessageContent,
  PresenceData,
  proto,
  SocketConfig,
  WABrowserDescription,
  WAMessageContent,
  WAMessageKey,
  WAMessageUpdate,
  WAVersion,
} from '@adiwajshing/baileys';
import { WACallEvent } from '@adiwajshing/baileys/lib/Types/Call';
import { BaileysEventMap } from '@adiwajshing/baileys/lib/Types/Events';
import { GroupMetadata } from '@adiwajshing/baileys/lib/Types/GroupMetadata';
import {
  Label as NOWEBLabel,
  LabelActionBody,
} from '@adiwajshing/baileys/lib/Types/Label';
import {
  ChatLabelAssociation,
  LabelAssociationType,
} from '@adiwajshing/baileys/lib/Types/LabelAssociation';
import { MessageUserReceiptUpdate } from '@adiwajshing/baileys/lib/Types/Message';
import type {
  MediaGenerationOptions,
  NewsletterFetchedUpdate,
} from '@adiwajshing/baileys/lib/Types';
import { ILogger } from '@adiwajshing/baileys/lib/Utils/logger';
import { isLidUser } from '@adiwajshing/baileys/lib/WABinary/jid-utils';
import { UnprocessableEntityException } from '@nestjs/common';
import { parseMessageCapping } from '@waha/core/abc/capping';
import {
  getChannelInviteLink,
  getPublicUrlFromDirectPath,
  WhatsappSession,
} from '@waha/core/abc/session.abc';
import {
  ToGroupJoinRequest,
  ToGroupJoinRequestResult,
  ToGroupParticipant,
  ToGroupV2JoinEvent,
  ToGroupV2LeaveEvent,
  ToGroupV2ParticipantsJoinRequestEvent,
  ToGroupV2Participants,
  ToGroupV2UpdateEvent,
} from '@waha/core/engines/noweb/groups.noweb';
import { sendButtonMessage } from '@waha/core/engines/noweb/noweb.buttons';
import {
  NOWEBNewsletterMetadata,
  toNewsletterMetadata,
} from '@waha/core/engines/noweb/noweb.newsletter';
import { NowebAuthFactoryCore } from '@waha/core/engines/noweb/NowebAuthFactoryCore';
import { NowebInMemoryStore } from '@waha/core/engines/noweb/store/NowebInMemoryStore';
import { NotImplementedByEngineError } from '@waha/core/exceptions';
import { toVcardV3 } from '@waha/core/vcard';
import { createAgentProxy } from '@waha/core/helpers.proxy';
import type { Agent } from 'https';
import {
  IMediaEngineProcessor,
  MediaContent,
} from '@waha/core/media/IMediaEngineProcessor';
import { MediaDownloadOptions } from '@waha/core/media/IMediaManager';
import { LottieMediaProcessorWrapper } from '@waha/core/media/LottieMediaProcessorWrapper';
import { QR } from '@waha/core/QR';
import { AckToStatus, StatusToAck } from '@waha/core/utils/acks';
import { pairs } from '@waha/utils/pairs';
import { ExtractMessageKeysForRead } from '@waha/core/utils/convertors';
import { parseMessageIdSerialized } from '@waha/core/utils/ids';
import {
  isJidNewsletter,
  jidsFromKey,
  toCusFormat,
  toJID,
} from '@waha/core/utils/jids';
import { DistinctAck, DistinctMessages } from '@waha/core/utils/reactive';
import {
  flipObject,
  parseBool,
  sortObjectByValues,
  splitAt,
} from '@waha/helpers';
import { PairingCodeResponse } from '@waha/structures/auth.dto';
import { CallData } from '@waha/structures/calls.dto';
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
  ChatSummary,
  GetChatMessageQuery,
  GetChatMessagesFilter,
  GetChatMessagesQuery,
  GetChatsOverviewParams,
  GetChatsParams,
  OverviewFilter,
  PinDuration,
  ReadChatMessagesQuery,
  ReadChatMessagesResponse,
} from '@waha/structures/chats.dto';
import { SendButtonsRequest } from '@waha/structures/chatting.buttons.dto';
import {
  ChatRequest,
  CheckNumberStatusQuery,
  EditMessageRequest,
  MessageContactVcardRequest,
  MessageDestination,
  MessageFileRequest,
  MessageForwardRequest,
  MessageImageRequest,
  MessageLinkCustomPreviewRequest,
  MessageLinkPreviewRequest,
  MessageLocationRequest,
  MessagePollRequest,
  MessageReactionRequest,
  MessageReplyRequest,
  MessageStarRequest,
  MessageStickerRequest,
  MessageTextRequest,
  MessageVideoRequest,
  MessageVoiceRequest,
  SendSeenRequest,
  WANumberExistResult,
} from '@waha/structures/chatting.dto';
import { SendListRequest } from '@waha/structures/chatting.list.dto';
import {
  ContactQuery,
  ContactRequest,
  ContactUpdateBody,
} from '@waha/structures/contacts.dto';
import {
  ACK_UNKNOWN,
  SECOND,
  WAHAEngine,
  WAHAEvents,
  WAHAPresenceStatus,
  WAHASessionStatus,
  WAMessageAck,
} from '@waha/structures/enums.dto';
import { BinaryFile, FileType, RemoteFile } from '@waha/structures/files.dto';
import {
  CreateGroupRequest,
  GroupJoinRequest,
  GroupJoinRequestResult,
  GroupParticipant,
  ParticipantsRequest,
  SettingsMemberAddMode,
  SettingsMembershipApproval,
  SettingsSecurityChangeInfo,
} from '@waha/structures/groups.dto';
import {
  Label,
  LabelChatAssociation,
  LabelDTO,
  LabelID,
} from '@waha/structures/labels.dto';
import { LidToPhoneNumber } from '@waha/structures/lids.dto';
import { WAMedia } from '@waha/structures/media.dto';
import { ReplyToMessage } from '@waha/structures/message.dto';
import { PaginationParams } from '@waha/structures/pagination.dto';
import {
  WAHAChatPresences,
  WAHAPresenceData,
} from '@waha/structures/presence.dto';
import {
  MessageSource,
  WAMessage,
  WAMessageReaction,
} from '@waha/structures/responses.dto';
import {
  MeInfo,
  MessageCappingData,
  ReachoutTimelockData,
  ReachoutTimelockEnforcementType,
} from '@waha/structures/sessions.dto';
import { EnsureSeconds } from '@waha/utils/timehelper';
import {
  BROADCAST_ID,
  DeleteStatusRequest,
  ImageStatus,
  StatusRequest,
  TextStatus,
  VideoStatus,
  VoiceStatus,
} from '@waha/structures/status.dto';
import {
  EnginePayload,
  PollVote,
  PollVotePayload,
  WAMessageAckBody,
  WAMessageEditedBody,
  WAMessageRevokedBody,
} from '@waha/structures/webhooks.dto';
import { LoggerBuilder } from '@waha/utils/logging';
import { promiseTimeout, sleep, waitUntil } from '@waha/utils/promiseTimeout';
import { exclude } from '@waha/utils/reactive/ops/exclude';
import { SingleDelayedJobRunner } from '@waha/utils/SingleDelayedJobRunner';
import { SinglePeriodicJobRunner } from '@waha/utils/SinglePeriodicJobRunner';
import { StatusTracker } from '@waha/utils/StatusTracker';
import * as lodash from 'lodash';
import * as NodeCache from 'node-cache';
import {
  filter,
  concatMap,
  fromEvent,
  groupBy,
  identity,
  merge,
  mergeAll,
  mergeMap,
  Observable,
  partition,
  share,
  tap,
} from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { NowebClient } from './NowebClient';
import { INowebStore } from './store/INowebStore';
import { NowebPersistentStore } from './store/NowebPersistentStore';
import { NowebStorageFactoryCore } from './store/NowebStorageFactoryCore';
import { buildMessageId, ensureNumber, extractMediaContent } from './utils';
import { Agents } from '@waha/core/engines/noweb/types';
import {
  IsEditedMessage,
  IsHistorySyncNotification,
  IsSecretEncryptedMessageEdit,
} from '@waha/core/utils/pwa';
import {
  decryptSecretEncryptedMessageEditProto,
  getOrigSenderJidForMsgSecret,
  jidToNonAD,
} from '@waha/core/utils/secretEncryptedMessageEdit';
import { extractWALocation } from '@waha/core/engines/waproto/locaiton';
import { extractVCards } from '@waha/core/engines/waproto/vcards';
import { WAMimeType } from '@waha/core/media/WAMimeType';
import {
  WAHA_CLIENT_BROWSER_NAME,
  WAHA_CLIENT_DEVICE_NAME,
} from '@waha/core/env';
import { detectMimetype } from '@waha/utils/files';
import esm from '@waha/vendor/esm';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { formatWaVersion } from '@waha/core/engines/noweb/waversion';

import { Activity } from '@waha/core/abc/session.hooks.activity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const promiseRetry = require('promise-retry');

axiosRetry(axios, { retries: 3 });

export const BaileysEvents = {
  CONNECTION_UPDATE: 'connection.update',
  CREDS_UPDATE: 'creds.update',
  MESSAGES_UPDATE: 'messages.update',
  MESSAGES_UPSERT: 'messages.upsert',
  MESSAGE_RECEIPT_UPDATE: 'message-receipt.update',
  GROUPS_UPSERT: 'groups.upsert',
  PRESENCE_UPDATE: 'presence.update',
};

const PresenceStatuses = {
  unavailable: WAHAPresenceStatus.OFFLINE,
  available: WAHAPresenceStatus.ONLINE,
  composing: WAHAPresenceStatus.TYPING,
  recording: WAHAPresenceStatus.RECORDING,
  paused: WAHAPresenceStatus.PAUSED,
};
const ToEnginePresenceStatus = flipObject(PresenceStatuses);

export interface NowebConfig {
  waVersion: WAVersion;
}

export class WhatsappSessionNoWebCore extends WhatsappSession {
  private START_ATTEMPT_DELAY_SECONDS = 2;
  private AUTO_RESTART_AFTER_SECONDS = 28 * 60;
  // how long to wait on stop for the WebSocket close handshake and store close before forcing it
  private CLOSE_TIMEOUT_MS = 3_000;

  engine = WAHAEngine.NOWEB;
  protected engineConfig: NowebConfig;
  authFactory = new NowebAuthFactoryCore();
  storageFactory = new NowebStorageFactoryCore();
  private startDelayedJob: SingleDelayedJobRunner;
  private shouldRestart: boolean;

  private autoRestartJob: SinglePeriodicJobRunner;
  private msgRetryCounterCache: NodeCache;
  private placeholderResendCache: NodeCache;
  protected engineLogger: ILogger;

  private authNOWEBStore: any;

  sock: ReturnType<typeof makeWASocket>;
  store: INowebStore;
  private qr: QR;

  private statusTracker = new StatusTracker();

  public constructor(config) {
    super(config);
    this.shouldRestart = true;

    this.qr = new QR();
    // external map to store retry counts of messages when decryption/encryption fails
    // keep this out of the socket itself, to prevent a message decryption/encryption loop across socket restarts
    this.msgRetryCounterCache = new NodeCache({
      stdTTL: 60 * 60, // 1 hour
      useClones: false,
    });
    this.placeholderResendCache = new NodeCache({
      stdTTL: 60 * 60, // 1 hour
      useClones: false,
    });

    this.engineLogger = this.loggerBuilder.child({
      name: 'NOWEBEngine',
    }) as unknown as ILogger;

    // Restart job if session failed
    this.startDelayedJob = new SingleDelayedJobRunner(
      'start-engine',
      this.START_ATTEMPT_DELAY_SECONDS * SECOND,
      this.logger,
    );

    // Enable auto-restart
    const shiftSeconds = Math.floor(Math.random() * 30);
    const delay = this.AUTO_RESTART_AFTER_SECONDS + shiftSeconds;
    this.autoRestartJob = new SinglePeriodicJobRunner(
      'auto-restart',
      delay * SECOND,
      this.logger,
    );
    this.authNOWEBStore = null;
  }

  protected set status(value: WAHASessionStatus) {
    this.statusTracker.track(value);
    super.status = value;
  }

  public get status() {
    return super.status;
  }

  async start() {
    this.status = WAHASessionStatus.STARTING;
    this.buildClient().catch((err) => {
      this.logger.error('Failed to start the client');
      this.logger.error(err, err.stack);
      this.status = WAHASessionStatus.FAILED;
      this.restartClient();
    });
  }

  async unpair() {
    this.unpairing = true;
    this.shouldRestart = false;
    await this.sock?.logout();
  }

  getSocketConfig(agents: Agents | undefined, state): Partial<SocketConfig> {
    // Detect browser
    let browser = ['Ubuntu', 'Chrome', '22.04.4'] as WABrowserDescription;
    let deviceName =
      this.sessionConfig?.client?.deviceName ?? WAHA_CLIENT_DEVICE_NAME;
    let browserName =
      this.sessionConfig?.client?.browserName ?? WAHA_CLIENT_BROWSER_NAME;
    if (browserName && !deviceName) {
      browser = Browsers.appropriate(browserName);
    } else if (!browserName && deviceName) {
      browser = [deviceName, 'Chrome', '22.04.4'];
    } else if (browserName && deviceName) {
      switch (deviceName) {
        case 'Mac OS':
        case 'MacOS':
        case 'macos':
          browser = Browsers.macOS(browserName);
          break;
        case 'ubuntu':
        case 'Ubuntu':
          browser = Browsers.ubuntu(browserName);
          break;
        case 'windows':
        case 'Windows':
          browser = Browsers.windows(browserName);
          break;
        default:
          browser = [deviceName, browserName, '22.04.4'];
      }
    }

    const fullSyncEnabled = this.sessionConfig?.noweb?.store?.fullSync || false;
    let markOnlineOnConnect = this.sessionConfig?.noweb?.markOnline;
    if (markOnlineOnConnect == undefined) {
      markOnlineOnConnect = true;
    }
    const version = this.engineConfig?.waVersion;
    return {
      version: version,
      agent: agents?.socket,
      // Baileys media upload uses Node https.request in Node runtime.
      fetchAgent: agents?.fetch as Agent,
      auth: state,
      printQRInTerminal: false,
      browser: browser,
      logger: this.engineLogger,
      mobile: false,
      defaultQueryTimeoutMs: 120_000,
      keepAliveIntervalMs: 30_000,
      getMessage: (key) => this.getMessage(key),
      syncFullHistory: fullSyncEnabled,
      msgRetryCounterCache: this.msgRetryCounterCache,
      placeholderResendCache: this.placeholderResendCache,
      markOnlineOnConnect: markOnlineOnConnect,
    };
  }

  async makeSocket(): Promise<any> {
    if (!this.authNOWEBStore) {
      const store = await this.authFactory.buildAuth(
        this.sessionStore,
        this.name,
      );
      /** caching makes the store faster to send/recv messages */
      store.state.keys = makeCacheableSignalKeyStore(
        store.state.keys,
        this.engineLogger,
      );
      this.authNOWEBStore = store;
    }
    const { state, saveCreds } = this.authNOWEBStore;
    const agents = this.makeProxyAgents();
    const socketConfig: SocketConfig = this.getSocketConfig(
      agents,
      state,
    ) as SocketConfig;
    this.logger.info(
      `Connecting using wa.version = ${formatWaVersion(socketConfig.version)}`,
    );
    const sock = makeWASocket(socketConfig);
    sock.ev.on('creds.update', saveCreds);
    return sock;
  }

  protected makeProxyAgents(): Agents | undefined {
    if (!this.proxyConfig) {
      return undefined;
    }
    return createAgentProxy(this.proxyConfig);
  }

  private async ensureStore() {
    if (this.store) {
      return;
    }

    this.logger.debug(`Making a new store...`);
    const storeEnabled = this.sessionConfig?.noweb?.store?.enabled || false;
    if (!storeEnabled) {
      this.logger.debug('Using NowebInMemoryStore');
      this.store = new NowebInMemoryStore();
      return;
    }

    this.logger.debug('Using NowebPersistentStore');
    const storage = this.storageFactory.createStorage(
      this.sessionStore,
      this.name,
    );
    this.store = new NowebPersistentStore(
      this.loggerBuilder.child({ name: NowebPersistentStore.name }),
      storage,
      this.jids,
    );
    await this.store.init();
  }

  connectStore() {
    this.logger.debug(`Connecting store...`);
    this.logger.debug(`Binding store to socket...`);
    this.store.bind(this.sock.ev, this.sock);
  }

  resubscribeToKnownPresences() {
    for (const jid in this.store.presences) {
      this.subscribePresence(jid);
    }
  }

  async buildClient() {
    this.shouldRestart = true;
    // @ts-ignore
    this.sock?.ev?.removeAllListeners();

    await this.ensureStore();
    this.sock = await this.makeSocket();

    this.fixMessages();
    this.issueMessageUpdateOnEdits();
    this.issueMessageUpdateOnPoll();
    this.issuePresenceUpdateOnMessageUpsert();
    if (this.isDebugEnabled()) {
      this.listenEngineEventsInDebugMode();
    }
    this.connectStore();
    this.listenConnectionEvents();
    this.subscribeEngineEvents2();
    this.listenContactsUpdatePictureProfile();
    // this.enableAutoRestart();
  }

  private enableAutoRestart() {
    this.autoRestartJob.start(async () => {
      this.logger.info('Auto-restarting the client connection...');
      if (this.sock?.ws?.isConnecting) {
        this.logger.warn('Auto-restart skipped, the client is connecting...');
        return;
      }
      this.sock?.end(undefined);
    });
  }

  protected async getMessage(
    key: WAMessageKey,
  ): Promise<WAMessageContent | undefined> {
    if (!this.store) {
      return proto.Message.create({});
    }
    const msg = await this.store.loadMessage(key.remoteJid, key.id);
    return msg?.message || undefined;
  }

  protected listenEngineEventsInDebugMode() {
    this.sock.ev.process((events) => {
      this.logger.debug({ events: events }, `NOWEB events`);
    });
  }

  private restartClient() {
    if (!this.shouldRestart) {
      this.logger.debug(
        'Should not restart the client, ignoring restart request',
      );
      return;
    }

    this.startDelayedJob.schedule(async () => {
      if (!this.shouldRestart) {
        this.logger.warn(
          'Should not restart the client, ignoring restart request',
        );
        return;
      }
      await this.end();
      await this.start();
    });
  }

  protected listenConnectionEvents() {
    this.logger.debug(`Start listening ${BaileysEvents.CONNECTION_UPDATE}...`);
    this.sock.ev.on('message-capping.update', (data) => {
      this.messageCapping.update(parseMessageCapping(data));
    });
    this.sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr, isNewLogin } = update;
      if (update.reachoutTimeLock) {
        this.updateReachoutTimelockFromState(update.reachoutTimeLock);
      }
      if (isNewLogin) {
        this.restartClient();
      } else if (connection === 'open') {
        this.qr.save('');
        this.status = WAHASessionStatus.WORKING;
        // Ask WhatsApp for the current reachout timelock state, so a restarted session learns about
        // an ongoing timelock without waiting for a push. The result arrives via 'connection.update'
        this.sock?.fetchAccountReachoutTimelock?.().catch((error) => {
          this.logger.warn(`Failed to fetch reachout timelock: ${error}`);
        });
        // Same for the new-chat message capping - there is no push on (re)connect, only on changes
        this.sock
          ?.fetchNewChatMessageCap?.()
          .then((data) => {
            this.messageCapping.update(parseMessageCapping(data));
          })
          .catch((error) => {
            this.logger.warn(`Failed to fetch message capping: ${error}`);
          });
        // Do we need to resubscribe?
        // Ideally not, we need to explicitly call interesting
        // jids every 1 minute
        // this.resubscribeToKnownPresences();
        return;
      } else if (connection === 'close') {
        this.qr.save('');
        const error = lastDisconnect.error as any;
        const statusCode = error?.output?.statusCode;

        // Restart required from the server
        const restartRequired = statusCode === DisconnectReason.restartRequired;
        if (restartRequired) {
          this.restartClient();
          return;
        }

        // Stuck in STARTING status
        if (this.statusTracker.isStuckInStarting()) {
          this.logger.error(
            'Session stuck in STARTING status, force stopping the session.',
          );
          await this.failed();
          return;
        }

        // Do not reconnect if the QR code has not been scanned yet
        if (this.status == WAHASessionStatus.SCAN_QR_CODE) {
          this.logger.warn(
            'QR code has not been scanned yet, force stopping the session.',
          );
          await this.failed();
          return;
        }

        // Reconnect if not logged out
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          if (lastDisconnect.error) {
            this.logger.info(
              `Connection closed due to '${lastDisconnect.error}', reconnecting...`,
            );
          }
          this.restartClient();
          return;
        }

        // Unknown error or logged out
        this.logger.error(
          `Connection closed due to '${lastDisconnect.error}', do not reconnect the session.`,
        );
        await this.failed();
      }

      // Save QR
      if (qr) {
        this.qr.save(qr);
        this.printQR(this.qr);
        this.status = WAHASessionStatus.SCAN_QR_CODE;
      }
    });
  }

  async stop() {
    this.shouldRestart = false;
    this.startDelayedJob.cancel();
    this.autoRestartJob.stop();

    const hasCreds = this.authNOWEBStore?.state?.creds;
    if (hasCreds && this.status == WAHASessionStatus.WORKING) {
      this.logger.info('Saving creds before stopping...');
      await this.authNOWEBStore.saveCreds().catch((e) => {
        this.logger.error('Failed to save creds');
        this.logger.error(e, e.stack);
      });
      this.logger.info('Creds saved');
    }
    await this.end();
    await this.closeStores();
    this.status = WAHASessionStatus.STOPPED;
    this.stopEvents();
    this.mediaManager.close();
  }

  protected async failed() {
    this.shouldRestart = false;
    this.startDelayedJob.cancel();
    this.autoRestartJob.stop();

    // We'll restart the client if it's in the process of unpairing
    this.status = WAHASessionStatus.FAILED;

    if (this.unpairing) {
      // Wait for unpairing to complete before ending the socket
      await sleep(1_000);
    }

    this.stopEvents();
    this.mediaManager.close();
    await this.end();
    await this.closeStores();
  }

  /**
   * Close the data and auth stores with a time bound - close() may flush pending writes,
   * and broken storage must not block session stop or process shutdown
   */
  private async closeStores() {
    if (this.store) {
      await promiseTimeout(this.CLOSE_TIMEOUT_MS, this.store.close()).catch(
        (err) => {
          this.logger.error('Failed to close NOWEB store');
          this.logger.error(err, err.stack);
        },
      );
    }
    if (this.authNOWEBStore) {
      await promiseTimeout(
        this.CLOSE_TIMEOUT_MS,
        this.authNOWEBStore.close(),
      ).catch((err) => {
        this.logger.error('Failed to close NOWEB auth store');
        this.logger.error(err, err.stack);
      });
    }
  }

  private fixMessages() {
    this.sock.ev.on('messages.upsert', ({ messages }) => {
      for (const message of messages) {
        // If no status - set it to WAMessageAck.DEVICE
        message.status = message.status ?? AckToStatus(WAMessageAck.DEVICE);

        // Fix fromMe in @lid addressed groups
        // https://github.com/devlikeapro/waha/issues/1350
        if (message.key.participant === this.getSessionMeInfo()?.lid) {
          message.key.fromMe = true;
        }
      }
    });
  }

  private issueMessageUpdateOnEdits() {
    // Remove it after it's been merged
    // https://github.com/WhiskeySockets/Baileys/pull/855/
    this.sock.ev.on('messages.upsert', ({ messages }) => {
      for (const message of messages) {
        if (IsEditedMessage(message.message)) {
          const content = normalizeMessageContent(message.message);
          const protocolMsg = content?.protocolMessage;
          this.sock?.ev.emit('messages.update', [
            {
              key: {
                ...message.key,
                id: protocolMsg.key.id,
              },
              update: { message: protocolMsg.editedMessage },
            },
          ]);
        }
      }
    });
  }

  private issueMessageUpdateOnPoll() {
    // Fix for https://github.com/devlikeapro/waha/issues/960
    this.sock.ev.on('messages.upsert', async ({ messages }) => {
      const me = this.getSessionMeInfo();
      if (!me) {
        this.logger.warn(
          'Cannot issue poll updates, session "me" info not found',
        );
        return;
      }

      for (const message of messages) {
        const content = normalizeMessageContent(message.message);
        if (!content?.pollUpdateMessage) {
          continue;
        }
        const creationMsgKey = content.pollUpdateMessage.pollCreationMessageKey;
        // we need to fetch the poll creation message to get the poll enc key
        const pkey = { ...creationMsgKey };
        pkey.remoteJid = null; // try to find message creation by id only
        const pollMsg = await this.getMessage(pkey);
        if (!pollMsg) {
          this.logger.warn(
            { creationMsgKey },
            'poll creation message not found, cannot decrypt update',
          );
          continue;
        }

        // Because of new @lid system it's hard to detect exactly how
        // the vote has been encrypted, so we'll iterator over all possible
        // not null combinations
        const key = message.key;
        const myIds = [jidNormalizedUser(me.id), jidNormalizedUser(me.lid)];
        const participantIds = [
          jidNormalizedUser(key?.participantAlt),
          jidNormalizedUser(key?.remoteJidAlt),
          jidNormalizedUser(key?.participant),
          jidNormalizedUser(key?.remoteJid),
        ];
        let creators: string[] = creationMsgKey.fromMe
          ? [...myIds, ...participantIds]
          : [...participantIds, ...myIds];
        let votes: string[] = key.fromMe
          ? [...myIds, ...participantIds]
          : [...participantIds, ...myIds];
        creators = lodash.uniq(creators.filter(Boolean));
        votes = lodash.uniq(votes.filter(Boolean));
        let found = false;
        for (const [pollCreatorJid, voterJid] of pairs(creators, votes)) {
          try {
            const pollEncKey = pollMsg.messageContextInfo?.messageSecret;
            const voteMsg = decryptPollVote(content.pollUpdateMessage.vote, {
              pollCreatorJid: pollCreatorJid,
              pollMsgId: creationMsgKey.id,
              pollEncKey: pollEncKey,
              voterJid: voterJid,
            });
            this.sock.ev.emit('messages.update', [
              {
                key: creationMsgKey,
                update: {
                  pollUpdates: [
                    {
                      pollUpdateMessageKey: message.key,
                      vote: voteMsg,
                      senderTimestampMs: (
                        content.pollUpdateMessage.senderTimestampMs as Long
                      ).toNumber(),
                    },
                  ],
                },
              },
            ]);
            found = true;
            break;
          } catch (err) {
            this.logger.trace(
              {
                err: err.message,
                key: key,
                creationsMsgKey: creationMsgKey,
                pollCreatorJid: pollCreatorJid,
                voterJid: voterJid,
              },
              'failed to decrypt poll vote using creator and voter',
            );
          }
        }
        if (!found) {
          this.logger.warn(
            {
              key: key,
              creationsMsgKey: creationMsgKey,
              creators: creators,
              voters: votes,
            },
            'failed to decrypt poll vote with any combination of creator/voter',
          );
        }
      }
    });
  }

  private issuePresenceUpdateOnMessageUpsert() {
    //
    // Fix for "typing" after sending a message
    // https://github.com/devlikeapro/waha/issues/379
    //
    this.sock.ev.on('messages.upsert', ({ messages }) => {
      const meId = this.sock?.authState?.creds?.me?.id;
      for (const message of messages) {
        if (!isRealMessage(message)) {
          continue;
        }
        if (message.key.fromMe) {
          continue;
        }
        const jid = message.key.remoteJid;
        const participant = message.key.participant || jid;
        const jidPresences = this.store?.presences?.[jid];
        const participantPresence = jidPresences?.[participant];
        if (participantPresence?.lastKnownPresence === 'composing') {
          this.logger.debug(
            `Fixing presence for '${participant}' in '${jid} since it's typing`,
          );
          const presence: PresenceData = { lastKnownPresence: 'available' };
          this.sock?.ev?.emit('presence.update', {
            id: jid,
            presences: { [participant]: presence },
          });
        }
      }
    });
  }

  private async end() {
    this.presence = null;
    this.autoRestartJob.stop();
    const sock = this.sock;
    // @ts-ignore
    sock?.ev?.removeAllListeners();
    sock?.ws?.removeAllListeners();
    // wait until connection is not connecting to avoid error:
    // "WebSocket was closed before the connection was established"
    await waitUntil(async () => !sock?.ws?.isConnecting, 1_000, 10_000);
    if (!sock) {
      return;
    }
    // sock.end() waits for the WebSocket close handshake - on a dead or already closed connection
    // it can hang forever, so bound it and destroy the raw TCP socket to let the process exit
    const closing = sock.end(undefined);
    try {
      await promiseTimeout(this.CLOSE_TIMEOUT_MS, closing);
    } catch (err) {
      this.logger.warn(
        `WebSocket did not close in ${this.CLOSE_TIMEOUT_MS}ms, terminating it: ${err}`,
      );
      this.terminate(sock);
    }
  }

  /**
   * Destroy the raw TCP socket behind Baileys WebSocket wrapper.
   * ws.terminate() skips the close handshake, so it works even on half-open connections.
   */
  private terminate(sock: ReturnType<typeof makeWASocket>) {
    // 'socket' is protected on Baileys WebSocketClient, reach it at runtime
    const raw = (sock.ws as any)?.socket;
    try {
      raw?.terminate?.();
    } catch (err) {
      this.logger.warn(`Failed to terminate WebSocket: ${err}`);
    }
  }

  getSessionMeInfo(): MeInfo | null {
    const me = this.sock?.authState?.creds?.me;
    if (!me) {
      return null;
    }
    const meId = jidNormalizedUser(me.id);
    return {
      id: toCusFormat(meId),
      pushName: me.name,
      lid: jidNormalizedUser(me.lid),
      reachoutTimelock: this.reachoutTimelock.value,
      messageCapping: this.messageCapping.value,
    };
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

  public async requestCode(
    phoneNumber: string,
    method: string,
    params?: any,
  ): Promise<PairingCodeResponse> {
    if (method) {
      const err = `NOWEB engine doesn't support any 'method', remove it and try again`;
      throw new UnprocessableEntityException(err);
    }

    if (this.status == WAHASessionStatus.STARTING) {
      this.logger.debug('Waiting for connection update...');
      await this.sock.waitForConnectionUpdate(async (update) => !!update.qr);
    }

    if (this.status != WAHASessionStatus.SCAN_QR_CODE) {
      const err = `Can request code only in SCAN_QR_CODE status. The current status is ${this.status}`;
      throw new UnprocessableEntityException(err);
    }

    this.logger.info(`Requesting pairing code for '${phoneNumber}'...`);
    const code: string = await this.sock.requestPairingCode(phoneNumber);
    // show it as ABCD-ABCD
    const parts = splitAt(code, 4);
    const codeRepr = parts.join('-');
    this.logger.info(`Your code: ${codeRepr}`);
    return { code: codeRepr };
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
    await this.sock.updateProfileName(name);
    return true;
  }

  @Activity()
  public async setProfileStatus(status: string): Promise<boolean> {
    await this.sock.updateProfileStatus(status);
    return true;
  }

  @Activity()
  protected async setProfilePicture(
    file: BinaryFile | RemoteFile,
  ): Promise<boolean> {
    const content: Buffer = await this.fileToBuffer(file);
    const me = this.getSessionMeInfo();
    await this.sock.updateProfilePicture(me.id, content);
    return true;
  }

  @Activity()
  protected async deleteProfilePicture(): Promise<boolean> {
    const me = this.getSessionMeInfo();
    await this.sock.removeProfilePicture(me.id);
    return true;
  }

  @Activity()
  public async fetchMessageCapping(): Promise<MessageCappingData> {
    const data = await this.sock.fetchNewChatMessageCap();
    const capping = parseMessageCapping(data);
    // Keep the tracker in sync so MeInfo and 'session.status' reflect the fetch
    this.messageCapping.update(capping);
    return capping;
  }

  @Activity()
  public async fetchReachoutTimelock(): Promise<ReachoutTimelockData> {
    const state = await this.sock.fetchAccountReachoutTimelock();
    return this.updateReachoutTimelockFromState(state);
  }

  private updateReachoutTimelockFromState(timelock: any): ReachoutTimelockData {
    const enforcementType =
      timelock.enforcementType ?? ReachoutTimelockEnforcementType.DEFAULT;
    let timeEnforcementEnds: number | null = null;
    if (timelock.timeEnforcementEnds) {
      timeEnforcementEnds = EnsureSeconds(
        timelock.timeEnforcementEnds.getTime(),
      );
    }
    const data: ReachoutTimelockData = {
      enforcementType: enforcementType as ReachoutTimelockEnforcementType,
      isActive: timelock.isActive === true,
      timeEnforcementEnds: timeEnforcementEnds,
    };
    this.reachoutTimelock.update(data);
    return data;
  }

  /**
   * Other methods
   */
  @Activity()
  async checkNumberStatus(
    request: CheckNumberStatusQuery,
  ): Promise<WANumberExistResult> {
    let phone = request.phone.split('@')[0];
    phone = phone.replace(/\+/g, '');
    const [result] = await this.sock.onWhatsApp(phone);
    if (!result || !result.exists) {
      return { numberExists: false };
    }
    return {
      numberExists: true,
      chatId: toCusFormat(result.jid),
    };
  }

  async generateNewMessageId(): Promise<string> {
    return this.generateMessageID();
  }

  @Activity()
  async rejectCall(from: string, id: string): Promise<void> {
    const jid = await this.hooks.wid.chat.promise(from, 'rejectCall');
    await this.sock.rejectCall(id, jid);
  }

  @Activity()
  async sendText(request: MessageTextRequest) {
    const chatId = await this.hooks.wid.chat.promise(
      request.chatId,
      'sendText',
    );
    let mentions: string[] | undefined;
    if (request.mentions) {
      mentions = await Promise.all(
        request.mentions.map((mention) =>
          this.hooks.wid.mention.promise(mention, 'sendText'),
        ),
      );
    }
    const message = {
      text: request.text,
      mentions: mentions,
      linkPreview: this.getLinkPreview(request),
    };
    const options: any = await this.getMessageOptions(request);
    options.linkPreviewHighQuality = request.linkPreviewHighQuality;
    return this.sock.sendMessage(chatId, message, options);
  }

  @Activity()
  public async deleteMessage(chatId: string, messageId: string) {
    const jid = await this.hooks.wid.chat.promise(chatId, 'deleteMessage');
    const key = parseMessageIdSerialized(messageId);
    const options = {
      messageId: this.generateMessageID(),
    };
    return this.sock.sendMessage(jid, { delete: key }, options);
  }

  @Activity()
  public async editMessage(
    chatId: string,
    messageId: string,
    request: EditMessageRequest,
  ) {
    const jid = await this.hooks.wid.chat.promise(chatId, 'editMessage');
    const key = parseMessageIdSerialized(messageId);
    const stored = await this.store
      ?.loadMessage(key.remoteJid, key.id)
      .catch(() => null);
    const content = extractMessageContent(stored?.message);
    let editedMessage = undefined;
    if (content?.imageMessage) {
      editedMessage = {
        imageMessage: {
          caption: request.text,
        },
      };
    } else if (content?.videoMessage) {
      editedMessage = {
        videoMessage: {
          caption: request.text,
        },
      };
    } else if (content?.documentMessage) {
      editedMessage = {
        documentMessage: {
          caption: request.text,
        },
      };
    } else if (content?.documentWithCaptionMessage?.message?.documentMessage) {
      editedMessage = {
        documentWithCaptionMessage: {
          message: {
            documentMessage: {
              caption: request.text,
            },
          },
        },
      };
    }
    let mentions: string[] | undefined;
    if (request.mentions) {
      mentions = await Promise.all(
        request.mentions.map((mention) =>
          this.hooks.wid.mention.promise(mention, 'editMessage'),
        ),
      );
    }
    let message: any = {
      text: request.text,
      mentions: mentions,
      edit: key,
      editedMessage: editedMessage,
      linkPreview: this.getLinkPreview(request),
      linkPreviewHighQuality: request.linkPreviewHighQuality,
    };
    const options = {
      messageId: this.generateMessageID(),
    };
    if (isJidNewsletter(jid)) {
      // Newsletter edits reuse the original message ID
      options.messageId = key.id;
    }
    return await this.sock.sendMessage(jid, message, options);
  }

  @Activity()
  async sendContactVCard(request: MessageContactVcardRequest) {
    const chatId = await this.hooks.wid.chat.promise(
      request.chatId,
      'sendContactVCard',
    );
    const contacts = request.contacts.map((el) => ({ vcard: toVcardV3(el) }));
    const options = await this.getMessageOptions(request);
    const msg = { contacts: { contacts: contacts } };
    return await this.sock.sendMessage(chatId, msg, options);
  }

  @Activity()
  async sendPoll(request: MessagePollRequest) {
    const requestPoll = request.poll;
    const poll = {
      name: requestPoll.name,
      values: requestPoll.options,
      selectableCount: requestPoll.multipleAnswers
        ? requestPoll.options.length
        : 1,
    };
    const message = { poll: poll };
    const remoteJid = await this.hooks.wid.chat.promise(
      request.chatId,
      'sendPoll',
    );
    const options = await this.getMessageOptions(request);
    const result = await this.sock.sendMessage(remoteJid, message, options);
    return await this.toWAMessage(result);
  }

  @Activity()
  async reply(request: MessageReplyRequest) {
    const chatId = await this.hooks.wid.chat.promise(request.chatId, 'reply');
    const options = await this.getMessageOptions(request);
    let mentions: string[] | undefined;
    if (request.mentions) {
      mentions = await Promise.all(
        request.mentions.map((mention) =>
          this.hooks.wid.mention.promise(mention, 'reply'),
        ),
      );
    }
    const message = {
      text: request.text,
      mentions: mentions,
    };
    return await this.sock.sendMessage(chatId, message, options);
  }

  @Activity()
  async sendImage(request: MessageImageRequest) {
    const message: any = await this.fileToMessage(
      request.file,
      'image',
      request.caption,
    );
    message.mimetype = message.mimetype || WAMimeType.IMAGE;
    const chatId = await this.hooks.wid.chat.promise(
      request.chatId,
      'sendImage',
    );
    // Baileys' newsletter media path skips thumbnail and dimension computation.
    // Pre-compute them so iOS renders the image with the correct aspect ratio.
    if (isJidNewsletter(chatId)) {
      try {
        const thumb = await esm.b.extractImageThumb(message.image, 72);
        message.jpegThumbnail = thumb.buffer;
        message.width = thumb.original.width;
        message.height = thumb.original.height;
      } catch (err) {
        this.logger.warn(
          { error: err },
          'Failed to generate thumbnail for newsletter image',
        );
      }
    }
    if (request.mentions?.length) {
      message.mentions = await Promise.all(
        request.mentions.map((mention) =>
          this.hooks.wid.mention.promise(mention, 'sendImage'),
        ),
      );
    }
    const options = await this.getMessageOptions(request);
    return this.sock.sendMessage(chatId, message, options);
  }

  @Activity()
  async sendFile(request: MessageFileRequest) {
    const message: any = await this.fileToMessage(
      request.file,
      'document',
      request.caption,
    );
    if (!message.mimetype) {
      message.mimetype = await detectMimetype(message['document']);
    }
    if (request.mentions?.length) {
      message.mentions = await Promise.all(
        request.mentions.map((mention) =>
          this.hooks.wid.mention.promise(mention, 'sendFile'),
        ),
      );
    }
    const chatId = await this.hooks.wid.chat.promise(
      request.chatId,
      'sendFile',
    );
    const options = await this.getMessageOptions(request);
    return this.sock.sendMessage(chatId, message, options);
  }

  @Activity()
  async sendVoice(request: MessageVoiceRequest) {
    const message: any = await this.fileToMessage(request.file, 'audio');
    message.mimetype = message.mimetype || WAMimeType.VOICE;
    if (request.convert) {
      message['audio'] = await this.mediaConverter.voice(message['audio']);
      message.mimetype = WAMimeType.VOICE;
    }
    const chatId = await this.hooks.wid.chat.promise(
      request.chatId,
      'sendVoice',
    );
    const options = await this.getMessageOptions(request);
    return this.sock.sendMessage(chatId, message, options);
  }

  @Activity()
  async sendVideo(request: MessageVideoRequest) {
    const message: any = await this.fileToMessage(
      request.file,
      'video',
      request.caption,
    );
    message.mimetype = message.mimetype || WAMimeType.VIDEO;
    if (request.convert) {
      message['video'] = await this.mediaConverter.video(message['video']);
      message.mimetype = WAMimeType.VIDEO;
    }
    if (request.mentions?.length) {
      message.mentions = await Promise.all(
        request.mentions.map((mention) =>
          this.hooks.wid.mention.promise(mention, 'sendVideo'),
        ),
      );
    }
    const duration = await esm.b
      .getAudioDuration(message['video'])
      .catch((err) => {
        this.logger.warn({ error: err }, 'Failed to get video duration');
        return undefined;
      });
    message.seconds = duration;
    const isGif = request.file?.mimetype === 'image/gif';
    if (isGif) {
      message.gifPlayback = true;
      message.externalShareFullVideoDurationInSeconds = 0;
    }
    const chatId = await this.hooks.wid.chat.promise(
      request.chatId,
      'sendVideo',
    );
    const options = await this.getMessageOptions(request);
    message.ptv = parseBool(request.asNote);
    return this.sock.sendMessage(chatId, message, options);
  }

  @Activity()
  async sendSticker(request: MessageStickerRequest) {
    const message: any = await this.fileToMessage(request.file, 'sticker');
    message.mimetype = message.mimetype || WAMimeType.STICKER;
    const chatId = await this.hooks.wid.chat.promise(
      request.chatId,
      'sendSticker',
    );
    const options = await this.getMessageOptions(request);
    return this.sock.sendMessage(chatId, message, options);
  }

  @Activity()
  async sendLinkCustomPreview(
    request: MessageLinkCustomPreviewRequest,
  ): Promise<any> {
    const chatId = await this.hooks.wid.chat.promise(
      request.chatId,
      'sendLinkCustomPreview',
    );
    const options = await this.getMessageOptions(request);
    const preview = request.preview;
    const urlInfo = {
      'matched-text': preview.url,
      title: preview.title,
      description: preview.description,
      jpegThumbnail: null,
      highQualityThumbnail: null,
    };

    if (request.preview.image) {
      const content: Buffer = await this.fileToBuffer(request.preview.image);
      if (!request.linkPreviewHighQuality) {
        // generate built-in thumbnail
        const thumbnail = await esm.b.extractImageThumb(content, 192);
        urlInfo.jpegThumbnail = thumbnail.buffer;
      } else {
        // upload HQ thumbnail
        // newsletters need the thumbnail uploaded unencrypted (plaintext path),
        // otherwise clients can not render it (white/blurred preview image)
        const uploadToServer = this.sock.waUploadToServer;
        const uploadThumbnail = async (encFilePath, opts) => {
          opts.newsletter = isJidNewsletter(chatId);
          return await uploadToServer(encFilePath, opts);
        };
        const { imageMessage } = await esm.b.prepareWAMessageMedia(
          { image: content },
          {
            upload: uploadThumbnail,
            mediaTypeOverride: 'thumbnail-link',
            options: { signal: AbortSignal.timeout(10_000) },
            jid: chatId,
          },
        );
        urlInfo.jpegThumbnail = imageMessage?.jpegThumbnail
          ? Buffer.from(imageMessage.jpegThumbnail)
          : undefined;
        urlInfo.highQualityThumbnail = imageMessage;
      }
    }

    const message = {
      text: request.text,
      linkPreview: urlInfo,
    };
    return this.sock.sendMessage(chatId, message as any, options);
  }

  protected async uploadMedia(
    file: RemoteFile | BinaryFile,
    type: any,
  ): Promise<any> {
    if (!file) {
      return;
    }
    if (!('url' in file || 'data' in file)) {
      return;
    }
    const message: any = await this.fileToMessage(file, type);
    const options: MediaGenerationOptions = {
      logger: this.engineLogger,
      upload: this.sock.waUploadToServer,
    };
    const { imageMessage } = await esm.b.prepareWAMessageMedia(
      message,
      options,
    );
    return imageMessage;
  }

  get client(): NowebClient {
    return new NowebClient(this.sock);
  }

  protected async fileToMessage(
    file: RemoteFile | BinaryFile,
    type: any,
    caption = '',
  ) {
    let content: Buffer;
    if ('url' in file) {
      content = await this.fetch(file.url);
    } else if ('data' in file) {
      content = Buffer.from(file.data, 'base64');
    } else {
      throw new UnprocessableEntityException(
        'Either "file.url" or "file.data" must be specified.',
      );
    }

    return {
      [type]: content,
      mimetype: file.mimetype,
      caption: caption,
      fileName: file.filename,
      ptt: type === 'audio',
    };
  }

  private async fileToBuffer(file: FileType): Promise<Buffer> {
    let content: Buffer;
    if ('data' in file) {
      content = Buffer.from(file.data, 'base64');
    } else if ('url' in file) {
      content = await this.fetch(file.url);
    } else {
      throw new UnprocessableEntityException(
        'Either file.url or file.data must be specified.',
      );
    }
    return content;
  }

  @Activity()
  async sendButtons(request: SendButtonsRequest) {
    const chatId = await this.hooks.wid.chat.promise(
      request.chatId,
      'sendButtons',
    );
    const headerImage = await this.uploadMedia(request.headerImage, 'image');
    return await sendButtonMessage(
      this.sock,
      chatId,
      request.buttons,
      request.header,
      headerImage,
      request.body,
      request.footer,
    );
  }

  @Activity()
  async sendList(request: SendListRequest): Promise<any> {
    const jid = await this.hooks.wid.chat.promise(request.chatId, 'sendList');
    if (!isLidUser(jid) && !isPnUser(jid)) {
      throw new UnprocessableEntityException(
        `List message can only be sent to a direct message chat.`,
      );
    }
    const message = request.message;
    const msg = {
      text: message.description || '',
      title: message.title,
      buttonText: message.button,
      footer: message.footer,
      sections: message.sections,
    } as any;
    const options = await this.getMessageOptions(request);
    return await this.sock.sendMessage(jid, msg, options);
  }

  @Activity()
  async sendLocation(request: MessageLocationRequest) {
    const chatId = await this.hooks.wid.chat.promise(
      request.chatId,
      'sendLocation',
    );
    const msg = {
      location: {
        name: request.title || null,
        degreesLatitude: request.latitude,
        degreesLongitude: request.longitude,
      },
    };
    const options = await this.getMessageOptions(request);
    return await this.sock.sendMessage(chatId, msg, options);
  }

  @Activity()
  async forwardMessage(request: MessageForwardRequest): Promise<WAMessage> {
    const key = parseMessageIdSerialized(request.messageId);
    const forwardMessage = await this.store.loadMessage(key.remoteJid, key.id);
    if (!forwardMessage) {
      throw new UnprocessableEntityException(
        `Message with id '${request.messageId}' not found`,
      );
    }
    const chatId = await this.hooks.wid.chat.promise(
      request.chatId,
      'forwardMessage',
    );
    const message = {
      forward: forwardMessage,
      force: true,
    };
    const options = await this.getMessageOptions(request);
    const result = await this.sock.sendMessage(chatId, message as any, options);
    return await this.toWAMessage(result);
  }

  @Activity()
  async sendLinkPreview(request: MessageLinkPreviewRequest) {
    const text = `${request.title}\n${request.url}`;
    const chatId = await this.hooks.wid.chat.promise(
      request.chatId,
      'sendLinkPreview',
    );
    const msg = { text: text };
    const options = await this.getMessageOptions(request);
    return this.sock.sendMessage(chatId, msg, options);
  }

  @Activity()
  async sendSeen(request: SendSeenRequest) {
    const keys = ExtractMessageKeysForRead(request);
    if (keys.length === 0) {
      return;
    }

    // Send read
    await this.sock.readMessages(keys);

    // Emit events for our reads
    const updates = keys.map((key) => ({
      key: key,
      update: { status: AckToStatus(WAMessageAck.READ) },
    }));
    this.sock?.ev.emit('messages.update', updates);
  }

  @Activity()
  async startTyping(request: ChatRequest): Promise<void> {
    const chatId = await this.hooks.wid.chat.promise(
      request.chatId,
      'startTyping',
    );
    await this.sock.sendPresenceUpdate('composing', chatId);
  }

  @Activity()
  async stopTyping(request: ChatRequest) {
    const chatId = await this.hooks.wid.chat.promise(
      request.chatId,
      'stopTyping',
    );
    return this.sock.sendPresenceUpdate('paused', chatId);
  }

  public async getChatMessages(
    chatId: string,
    query: GetChatMessagesQuery,
    filter: GetChatMessagesFilter,
  ) {
    const pagination = query as PaginationParams;
    const merge = query.merge ?? true;
    const jid = await this.hooks.wid.chat.promise(chatId, 'getChatMessages');
    const messages = await this.store.getMessagesByJid(
      jid,
      filter,
      pagination,
      merge,
    );

    const promises = [];
    const params = {
      download: query.downloadMedia,
      mimetypes: query.downloadMediaMimetypes,
    };
    const options = lodash.defaults({}, params, this.media.api);
    for (const msg of messages) {
      promises.push(this.processIncomingMessage(msg, options));
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
    const merge = query.merge ?? true;
    const jid = await this.hooks.wid.chat.promise(chatId, 'getChatMessage');
    const message = await this.store.getMessageById(jid, key.id, merge);
    if (!message) return null;
    const params = {
      download: query.downloadMedia,
      mimetypes: query.downloadMediaMimetypes,
    };
    const options = lodash.defaults({}, params, this.media.api);
    return await this.processIncomingMessage(message, options);
  }

  @Activity()
  public async pinMessage(
    chatId: string,
    messageId: string,
    duration: PinDuration,
  ): Promise<boolean> {
    const jid = await this.hooks.wid.chat.promise(chatId, 'pinMessage');
    const key = parseMessageIdSerialized(messageId);
    await this.sock.sendMessage(jid, {
      pin: key,
      type: proto.PinInChat.Type.PIN_FOR_ALL,
      time: duration,
    });
    return true;
  }

  @Activity()
  public async unpinMessage(
    chatId: string,
    messageId: string,
  ): Promise<boolean> {
    const jid = await this.hooks.wid.chat.promise(chatId, 'unpinMessage');
    const key = parseMessageIdSerialized(messageId);
    await this.sock.sendMessage(jid, {
      pin: key,
      type: proto.PinInChat.Type.UNPIN_FOR_ALL,
    });
    return true;
  }

  @Activity()
  async setReaction(request: MessageReactionRequest) {
    const key = parseMessageIdSerialized(request.messageId);
    if (isJidNewsletter(key.remoteJid)) {
      let serverId = Number(key.id);
      if (!serverId) {
        const msg = await this.store.getMessageById(key.remoteJid, key.id);
        if (msg) {
          // @ts-ignore
          serverId = Number(msg.key.server_id);
        }
      }
      if (!serverId) {
        throw new UnprocessableEntityException(
          `Unable to get server id for channel message '${key.id}'`,
        );
      }
      return this.sock.newsletterReactMessage(
        key.remoteJid,
        serverId.toString(),
        request.reaction,
      );
    } else {
      const reactionMessage = {
        react: {
          text: request.reaction,
          key: key,
        },
      };
      return this.sock.sendMessage(key.remoteJid, reactionMessage);
    }
  }

  @Activity()
  async setStar(request: MessageStarRequest) {
    const key = parseMessageIdSerialized(request.messageId);
    const jid = await this.hooks.wid.chat.promise(request.chatId, 'setStar');
    await this.sock.chatModify(
      {
        star: {
          messages: [{ id: key.id, fromMe: key.fromMe }],
          star: request.star,
        },
      },
      jid,
    );
  }

  /**
   * Chats methods
   */

  async getChats(pagination: PaginationParams) {
    const merge = (pagination as GetChatsParams).merge ?? true;
    const chats = await this.store.getChats(pagination, true, undefined, merge);
    // Remove unreadCount, it's not ready yet
    chats.forEach((chat) => delete chat.unreadCount);
    return chats;
  }

  public async getChatsOverview(
    pagination: PaginationParams,
    filter?: OverviewFilter,
  ): Promise<ChatSummary[]> {
    const merge = (pagination as GetChatsOverviewParams).merge ?? true;
    // Convert customer format IDs to JID format if filter is provided
    let jidFilter;
    if (filter?.ids && filter.ids.length > 0) {
      const ids = await Promise.all(
        filter.ids.map((id) =>
          this.hooks.wid.chat.promise(id, 'getChatsOverview'),
        ),
      );
      jidFilter = {
        ids: ids,
      };
    }

    const chats = await this.store.getChats(
      pagination,
      false,
      jidFilter,
      merge,
    );
    // Remove unreadCount, it's not ready yet
    chats.forEach((chat) => delete chat.unreadCount);

    const promises = [];
    for (const chat of chats) {
      promises.push(this.fetchChatSummary(chat, merge));
    }
    const result = await Promise.all(promises);
    return result;
  }

  protected async fetchChatSummary(
    chat: Chat,
    merge: boolean,
  ): Promise<ChatSummary> {
    const id = toCusFormat(chat.id);
    let name = chat.name;
    if (!name) {
      // Get name by contact
      const jid = toJID(chat.id);
      const contact = await this.store.getContactById(jid);
      name = contact?.name || contact?.notify;
    }
    const picture = await this.getContactProfilePicture(chat.id, false);
    const lastMessageQuery: GetChatMessagesQuery = {
      limit: 1,
      offset: 0,
      downloadMedia: false,
      merge: merge,
    };
    const messages = await this.getChatMessages(chat.id, lastMessageQuery, {});
    const message = messages.length > 0 ? messages[0] : null;
    return {
      id: id,
      name: name || null,
      picture: picture,
      lastMessage: message,
      _chat: chat,
    };
  }

  @Activity()
  protected async chatsPutArchive(
    chatId: string,
    archive: boolean,
  ): Promise<any> {
    const jid = await this.hooks.wid.chat.promise(chatId, 'chatsPutArchive');
    const messages = await this.store.getMessagesByJid(jid, {}, { limit: 1 });
    return await this.sock.chatModify(
      { archive: archive, lastMessages: messages },
      jid,
    );
  }

  @Activity()
  public chatsArchiveChat(chatId: string): Promise<any> {
    return this.chatsPutArchive(chatId, true);
  }

  @Activity()
  public chatsUnarchiveChat(chatId: string): Promise<any> {
    return this.chatsPutArchive(chatId, false);
  }

  @Activity()
  public async chatsUnreadChat(chatId: string): Promise<any> {
    const jid = await this.hooks.wid.chat.promise(chatId, 'chatsUnreadChat');
    const messages = await this.store.getMessagesByJid(jid, {}, { limit: 1 });
    return await this.sock.chatModify(
      { markRead: false, lastMessages: messages },
      jid,
    );
  }

  /**
   * Labels methods
   */

  public async getLabels(): Promise<Label[]> {
    const labels = await this.store.getLabels();
    return labels.map(this.toLabel);
  }

  @Activity()
  public async createLabel(label: LabelDTO): Promise<Label> {
    const labels = await this.store.getLabels();
    const highestLabelId = lodash.max(
      labels.map((label) => parseInt(label.id)),
    );
    const labelId = highestLabelId ? highestLabelId + 1 : 1;
    const labelAction: LabelActionBody = {
      id: labelId.toString(),
      name: label.name,
      color: label.color,
      deleted: false,
      predefinedId: undefined,
    };
    await this.sock.addLabel(undefined, labelAction);

    return {
      id: labelId.toString(),
      name: label.name,
      color: label.color,
      colorHex: Label.toHex(label.color),
    };
  }

  @Activity()
  public async updateLabel(label: Label): Promise<Label> {
    const labelAction: LabelActionBody = {
      id: label.id,
      name: label.name,
      color: label.color,
      deleted: false,
      predefinedId: undefined,
    };
    await this.sock.addLabel(undefined, labelAction);
    return label;
  }

  @Activity()
  public async deleteLabel(label: Label): Promise<void> {
    const labelAction: LabelActionBody = {
      id: label.id,
      name: label.name,
      color: label.color,
      deleted: true,
      predefinedId: undefined,
    };
    await this.sock.addLabel(undefined, labelAction);
  }

  public async getChatsByLabelId(labelId: string) {
    const chats = await this.store.getChatsByLabelId(labelId);
    // Remove unreadCount, it's not ready yet
    chats.forEach((chat) => delete chat.unreadCount);
    return chats;
  }

  public async getChatLabels(chatId: string): Promise<Label[]> {
    const jid = await this.hooks.wid.chat.promise(chatId, 'getChatLabels');
    const labels = await this.store.getChatLabels(jid);
    return labels.map(this.toLabel);
  }

  @Activity()
  public async putLabelsToChat(chatId: string, labels: LabelID[]) {
    const jid = await this.hooks.wid.chat.promise(chatId, 'putLabelsToChat');
    const labelsIds = labels.map((label) => label.id);
    const currentLabels = await this.store.getChatLabels(jid);
    const currentLabelsIds = currentLabels.map((label) => label.id);
    const addLabelsIds = lodash.difference(labelsIds, currentLabelsIds);
    const removeLabelsIds = lodash.difference(currentLabelsIds, labelsIds);
    for (const labelId of addLabelsIds) {
      await this.sock.addChatLabel(jid, labelId);
    }
    for (const labelId of removeLabelsIds) {
      await this.sock.removeChatLabel(jid, labelId);
    }
  }

  protected toLabel(label: NOWEBLabel): Label {
    const color = label.color;
    return {
      id: label.id,
      name: label.name,
      color: color,
      colorHex: Label.toHex(color),
    };
  }

  private async toLabelChatAssociation(
    association: ChatLabelAssociation,
  ): Promise<LabelChatAssociation> {
    const labelData = await this.store.getLabelById(association.labelId);
    const label = labelData ? this.toLabel(labelData) : null;
    return {
      labelId: association.labelId,
      chatId: toCusFormat(association.chatId),
      label: label,
    };
  }

  /**
   * Contacts methods
   */

  @Activity()
  public async upsertContact(chatId: string, body: ContactUpdateBody) {
    const jid = await this.hooks.wid.chat.promise(chatId, 'upsertContact');
    let fullName = body.firstName;
    if (body.lastName) {
      fullName = `${body.firstName} ${body.lastName}`;
    }
    const action = {
      fullName: fullName,
      firstName: body.firstName,
      saveOnPrimaryAddressbook: true,
    };
    await this.sock.addOrEditContact(jid, action);
    const updates: Partial<Contact>[] = [
      {
        id: jid,
        name: fullName,
      },
    ];
    this.sock.ev.emit('contacts.update', updates);
  }

  async getContact(query: ContactQuery) {
    const jid = await this.hooks.wid.chat.promise(
      query.contactId,
      'getContact',
    );
    const contact = await this.store.getContactById(jid);
    if (!contact) {
      return null;
    }
    return this.toWAContact(contact);
  }

  async getContacts(pagination: PaginationParams) {
    const contacts = await this.store.getContacts(pagination);
    return contacts.map(this.toWAContact);
  }

  @Activity()
  public async fetchContactProfilePicture(id: string) {
    const contact = await this.hooks.wid.chat.promise(
      id,
      'fetchContactProfilePicture',
    );
    try {
      const url = await this.sock.profilePictureUrl(contact, 'image');
      return url;
    } catch (err) {
      if (err.message == 'item-not-found') {
        return null;
      }
      if (err.message == 'not-authorized') {
        return null;
      }
      throw err;
    }
  }

  public async blockContact(request: ContactRequest) {
    throw new NotImplementedByEngineError();
  }

  public async unblockContact(request: ContactRequest) {
    throw new NotImplementedByEngineError();
  }

  /**
   * Lid to Phone Number methods
   */
  public async getAllLids(
    pagination: PaginationParams,
  ): Promise<Array<LidToPhoneNumber>> {
    const lids = await this.store.getAllLids(pagination);
    return lids.map((value) => {
      return {
        lid: value.lid,
        pn: toCusFormat(value.pn),
      };
    });
  }

  public async getLidsCount(): Promise<number> {
    return this.store.getLidsCount();
  }

  public async findPNByLid(lid: string): Promise<LidToPhoneNumber> {
    const pn = await this.store.findPNByLid(lid);
    return {
      lid: lid,
      pn: pn ? toCusFormat(pn) : null,
    };
  }

  public async findLIDByPhoneNumber(
    phoneNumber: string,
  ): Promise<LidToPhoneNumber> {
    const pn = await this.hooks.wid.chat.promise(
      phoneNumber,
      'findLIDByPhoneNumber',
    );
    const lid = await this.store.findLidByPN(pn);
    return {
      lid: lid || null,
      pn: toCusFormat(pn),
    };
  }

  /**
   * Group methods
   */
  @Activity()
  protected async setGroupPicture(
    id: string,
    file: BinaryFile | RemoteFile,
  ): Promise<boolean> {
    const content: Buffer = await this.fileToBuffer(file);
    await this.sock.updateProfilePicture(id, content);
    return true;
  }

  @Activity()
  protected async deleteGroupPicture(id: string): Promise<boolean> {
    await this.sock.removeProfilePicture(id);
    return true;
  }

  @Activity()
  public createGroup(request: CreateGroupRequest) {
    const participants = request.participants.map(getId);
    return this.sock.groupCreate(request.name, participants);
  }

  @Activity()
  public joinGroup(code: string) {
    return this.sock.groupAcceptInvite(code);
  }

  @Activity()
  public joinInfoGroup(code: string) {
    return this.sock.groupGetInviteInfo(code);
  }

  public async getGroups(pagination: PaginationParams) {
    const groups = await this.store.getGroups(pagination);
    // return {id: group} mapping for backward compatability
    return lodash.keyBy(groups, 'id');
  }

  protected removeGroupsFieldParticipant(group: any) {
    delete group.participants;
  }

  @Activity()
  public async refreshGroups(): Promise<boolean> {
    this.store.resetGroupsCache();
    await this.store.getGroups({});
    return true;
  }

  public async getGroup(id) {
    const groups = await this.getGroups({});
    const group = groups[id];
    if (!group) {
      throw new Error(`Group with id '${id}' not found`);
    }
    return group;
  }

  public async getGroupParticipants(id: string): Promise<GroupParticipant[]> {
    const group = (await this.getGroup(id)) as GroupMetadata;
    if (!group?.participants?.length) {
      return [];
    }
    return group.participants.map(ToGroupParticipant);
  }

  public async deleteGroup(id) {
    throw new NotImplementedByEngineError();
  }

  public async getInfoAdminsOnly(id): Promise<SettingsSecurityChangeInfo> {
    const group = await this.getGroup(id);
    return { adminsOnly: group.restrict };
  }

  @Activity()
  public async setInfoAdminsOnly(id, value) {
    const setting = value ? 'locked' : 'unlocked';
    return await this.sock.groupSettingUpdate(id, setting);
  }

  public async getMessagesAdminsOnly(id): Promise<SettingsSecurityChangeInfo> {
    const group = await this.getGroup(id);
    return { adminsOnly: group.announce };
  }

  @Activity()
  public async setMessagesAdminsOnly(id, value) {
    const setting = value ? 'announcement' : 'not_announcement';
    return await this.sock.groupSettingUpdate(id, setting);
  }

  public async getMemberAddMode(id): Promise<SettingsMemberAddMode> {
    const group = await this.getGroup(id);
    return { membersCanAddNewMember: group.memberAddMode };
  }

  @Activity()
  public async setMemberAddMode(id, value) {
    const mode = value ? 'all_member_add' : 'admin_add';
    return await this.sock.groupMemberAddMode(id, mode);
  }

  public async getMembershipApprovalMode(
    id: string,
  ): Promise<SettingsMembershipApproval> {
    const group = await this.getGroup(id);
    return { newMembersApprovalRequired: !!group.joinApprovalMode };
  }

  @Activity()
  public async setMembershipApprovalMode(
    id: string,
    value: boolean,
  ): Promise<boolean> {
    const mode = value ? 'on' : 'off';
    await this.sock.groupJoinApprovalMode(id, mode);
    return true;
  }

  @Activity()
  public async getGroupJoinRequests(id: string): Promise<GroupJoinRequest[]> {
    const requests = await this.sock.groupRequestParticipantsList(id);
    return requests.map(ToGroupJoinRequest);
  }

  @Activity()
  public async approveGroupJoinRequests(
    id: string,
    request: ParticipantsRequest,
  ): Promise<GroupJoinRequestResult[]> {
    return await this.updateGroupJoinRequests(id, request, 'approve');
  }

  @Activity()
  public async rejectGroupJoinRequests(
    id: string,
    request: ParticipantsRequest,
  ): Promise<GroupJoinRequestResult[]> {
    return await this.updateGroupJoinRequests(id, request, 'reject');
  }

  private async updateGroupJoinRequests(
    id: string,
    request: ParticipantsRequest,
    action: 'approve' | 'reject',
  ): Promise<GroupJoinRequestResult[]> {
    const participants = request.participants.map(getId);
    const results = await this.sock.groupRequestParticipantsUpdate(
      id,
      participants,
      action,
    );
    return results.map(ToGroupJoinRequestResult);
  }

  @Activity()
  public async leaveGroup(id) {
    return this.sock.groupLeave(id);
  }

  @Activity()
  public async setDescription(id, description) {
    return this.sock.groupUpdateDescription(id, description);
  }

  @Activity()
  public async setSubject(id, subject) {
    return this.sock.groupUpdateSubject(id, subject);
  }

  @Activity()
  public async getInviteCode(id): Promise<string> {
    return this.sock.groupInviteCode(id);
  }

  @Activity()
  public async revokeInviteCode(id): Promise<string> {
    await this.sock.groupRevokeInvite(id);
    return this.sock.groupInviteCode(id);
  }

  public async getParticipants(id) {
    const groups = await this.sock.groupFetchAllParticipating();
    return groups[id].participants;
  }

  @Activity()
  public async addParticipants(id, request: ParticipantsRequest) {
    const participants = request.participants.map(getId);
    return this.sock.groupParticipantsUpdate(id, participants, 'add');
  }

  @Activity()
  public async removeParticipants(id, request: ParticipantsRequest) {
    const participants = request.participants.map(getId);
    return this.sock.groupParticipantsUpdate(id, participants, 'remove');
  }

  @Activity()
  public async promoteParticipantsToAdmin(id, request: ParticipantsRequest) {
    const participants = request.participants.map(getId);
    return this.sock.groupParticipantsUpdate(id, participants, 'promote');
  }

  @Activity()
  public async demoteParticipantsToUser(id, request: ParticipantsRequest) {
    const participants = request.participants.map(getId);
    return this.sock.groupParticipantsUpdate(id, participants, 'demote');
  }

  public async setPresence(presence: WAHAPresenceStatus, chatId?: string) {
    switch (presence) {
      case WAHAPresenceStatus.TYPING:
      case WAHAPresenceStatus.RECORDING:
      case WAHAPresenceStatus.PAUSED:
        await this.hooks.activity.promise('setPresence');
    }
    const enginePresence = ToEnginePresenceStatus[presence];
    if (!enginePresence) {
      throw new NotImplementedByEngineError(
        `NOWEB engine doesn't support '${presence}' presence.`,
      );
    }
    if (chatId) {
      chatId = await this.hooks.wid.chat.promise(chatId, 'setPresence');
    }
    await this.sock.sendPresenceUpdate(enginePresence, chatId);
    this.presence = presence;
  }

  public async getPresences(): Promise<WAHAChatPresences[]> {
    const result: WAHAChatPresences[] = [];
    for (const remoteJid in this.store.presences) {
      const storedPresences = this.store.presences[remoteJid];
      result.push(this.toWahaPresences(remoteJid, storedPresences));
    }
    return result;
  }

  public async getPresence(chatId: string): Promise<WAHAChatPresences> {
    const jid = await this.hooks.wid.chat.promise(chatId, 'getPresence');
    await this.subscribePresence(jid);
    if (!(jid in this.store.presences)) {
      this.store.presences[jid] = {};
      await sleep(1000);
    }
    const result = this.store.presences[jid];
    return this.toWahaPresences(jid, result);
  }

  @Activity()
  public async subscribePresence(id: string): Promise<void> {
    const jid = await this.hooks.wid.chat.promise(id, 'subscribePresence');
    return this.sock.presenceSubscribe(jid);
  }

  /**
   * Status methods
   */
  @Activity()
  public async sendStatusMessage(
    message: any,
    options: any,
    jids: string[],
    batchSize?: number,
  ) {
    if (!batchSize || batchSize == 0) {
      batchSize = 5_000;
    }
    const chunks = lodash.chunk(jids, batchSize);
    if (chunks.length == 0) {
      throw new UnprocessableEntityException('No participants to send status');
    }

    const logger = this.logger.child({
      'message.id': options.messageId,
      chunks: chunks.length,
      size: batchSize,
    });
    logger.info(`Sending status message to ${jids.length} participants`);
    let result = null;
    for (const [index, participants] of chunks.entries()) {
      const batchOptions = { ...options };
      batchOptions.statusJidList = participants;
      const r = await this.sendStatusMessageOneChunk(
        message,
        batchOptions,
        logger,
        index,
      );
      result = result || r;
    }
    logger.info(
      `Sending status message to ${jids.length} participants - success`,
    );
    return result;
  }

  private async sendStatusMessageOneChunk(
    message: any,
    options: any,
    logger: any,
    index: number,
  ) {
    // https://github.com/IndigoUnited/node-promise-retry
    const retryOptions = {
      retries: 5,
      minTimeout: 1000,
      maxTimeout: 6000,
    };
    try {
      const resp = await promiseRetry((retry, number) => {
        return this.sock
          .sendMessage(BROADCAST_ID, message, options)
          .catch(retry);
      }, retryOptions);
      logger.info(`Sending status message (${index + 1} chunk) - success`);
      return resp;
    } catch (err) {
      logger.error(`Sending status message (${index + 1} chunk - failed`);
      logger.error(err, err.stack);
      throw err;
    }
  }

  @Activity()
  public async sendTextStatus(status: TextStatus) {
    const message = {
      text: status.text,
      linkPreview: this.getLinkPreview(status),
    };
    const jids = await this.prepareJidsForStatus(status.contacts);
    if (!status.id) {
      this.upsertMeInJIDs(jids);
    }
    const messageId = this.prepareMessageIdForStatus(status);
    const options: MiscMessageGenerationOptions = {
      backgroundColor: status.backgroundColor,
      font: status.font,
      linkPreviewHighQuality: status.linkPreviewHighQuality,
      messageId: messageId,
    };
    return await this.sendStatusMessage(
      message,
      options,
      jids,
      status.contacts?.length,
    );
  }

  @Activity()
  public async sendImageStatus(status: ImageStatus) {
    const message: any = await this.fileToMessage(
      status.file,
      'image',
      status.caption,
    );
    message.mimetype = message.mimetype || WAMimeType.IMAGE;
    const jids = await this.prepareJidsForStatus(status.contacts);
    if (!status.id) {
      this.upsertMeInJIDs(jids);
    }
    const messageId = this.prepareMessageIdForStatus(status);
    const options = {
      messageId: messageId,
    };
    return await this.sendStatusMessage(
      message,
      options,
      jids,
      status.contacts?.length,
    );
  }

  @Activity()
  public async sendVoiceStatus(status: VoiceStatus) {
    const message: any = await this.fileToMessage(status.file, 'audio');
    message.mimetype = message.mimetype || WAMimeType.VOICE;
    if (status.convert) {
      message['audio'] = await this.mediaConverter.voice(message['audio']);
      message.mimetype = WAMimeType.VOICE;
    }
    const jids = await this.prepareJidsForStatus(status.contacts);
    if (!status.id) {
      this.upsertMeInJIDs(jids);
    }
    const messageId = this.prepareMessageIdForStatus(status);
    const options = {
      backgroundColor: status.backgroundColor,
      messageId: messageId,
    };
    return await this.sendStatusMessage(
      message,
      options,
      jids,
      status.contacts?.length,
    );
  }

  @Activity()
  public async sendVideoStatus(status: VideoStatus) {
    const message: any = await this.fileToMessage(
      status.file,
      'video',
      status.caption,
    );
    message.mimetype = message.mimetype || WAMimeType.VIDEO;
    if (status.convert) {
      message['video'] = await this.mediaConverter.video(message['video']);
      message.mimetype = WAMimeType.VIDEO;
    }
    const jids = await this.prepareJidsForStatus(status.contacts);
    if (!status.id) {
      this.upsertMeInJIDs(jids);
    }
    const messageId = this.prepareMessageIdForStatus(status);
    const options = {
      statusJidList: jids,
      messageId: messageId,
    };
    return await this.sendStatusMessage(
      message,
      options,
      jids,
      status.contacts?.length,
    );
  }

  protected prepareMessageIdForStatus(status: StatusRequest) {
    if (status.id) {
      this.hooks.message.sent.call(status.id);
      return status.id;
    }
    return this.generateMessageID();
  }

  protected async prepareJidsForStatus(contacts: string[]) {
    let jids: string[];
    if (contacts?.length > 0) {
      jids = await Promise.all(
        contacts.map((contact) =>
          this.hooks.wid.chat.promise(contact, 'prepareJidsForStatus'),
        ),
      );
    } else {
      jids = await this.fetchMyContactsJids();
    }
    return jids;
  }

  protected async fetchMyContactsJids() {
    const contacts = await this.store.getContacts({});
    const jids = contacts.map((contact) => contact.id);
    return jids.filter((jid) => jid.endsWith('@s.whatsapp.net'));
  }

  @Activity()
  public async deleteStatus(request: DeleteStatusRequest) {
    const messageId = request.id;
    const key = parseMessageIdSerialized(messageId, true);
    key.fromMe = true;
    key.remoteJid = BROADCAST_ID;
    const jids = await this.prepareJidsForStatus(request.contacts);
    this.upsertMeInJIDs(jids);
    const newMessageId = this.generateMessageID();
    const options = {
      statusJidList: jids,
      messageId: newMessageId,
    };
    return await this.sendStatusMessage(
      { delete: key },
      options,
      jids,
      request.contacts?.length,
    );
  }

  protected upsertMeInJIDs(jids: string[]) {
    if (!this.sock?.authState?.creds?.me) {
      return;
    }
    const myJID = jidNormalizedUser(this.sock.authState.creds.me.id);
    if (!jids.includes(myJID)) {
      // insert my jid first
      jids.unshift(myJID);
    }
  }

  /**
   * Channels methods
   */
  @Activity()
  public async searchChannelsByView(
    query: ChannelSearchByView,
  ): Promise<ChannelListResult> {
    const response = await this.client.searchChannelsByView(query);
    const channels: Channel[] = response.newsletters.map(
      this.toChannel.bind(this),
    );
    return {
      page: response.page,
      channels: channels,
    };
  }

  @Activity()
  public async searchChannelsByText(
    query: ChannelSearchByText,
  ): Promise<ChannelListResult> {
    const response = await this.client.searchChannelsByText(query);
    const channels: Channel[] = response.newsletters.map(
      this.toChannel.bind(this),
    );
    return {
      page: response.page,
      channels: channels,
    };
  }

  @Activity()
  public async previewChannelMessages(
    inviteCode: string,
    query: PreviewChannelMessages,
  ): Promise<ChannelMessage[]> {
    const updates = await this.sock.newsletterFetchPreviewMessages(
      'invite',
      inviteCode,
      query.limit,
      null,
    );
    const promises = [];
    const params = {
      download: query.downloadMedia,
      mimetypes: query.downloadMediaMimetypes,
    };
    const options = lodash.defaults({}, params, this.media.api);
    for (const update of updates) {
      promises.push(
        this.NewsletterFetchedUpdateToChannelMessage(update, options),
      );
    }
    let result = await Promise.all(promises);
    result = result.filter(Boolean);
    return result;
  }

  private async NewsletterFetchedUpdateToChannelMessage(
    update: NewsletterFetchedUpdate,
    options: MediaDownloadOptions,
  ): Promise<ChannelMessage> {
    let reactions: any = Object.fromEntries(
      update.reactions.map(({ code, count }) => [code, count]),
    );
    reactions = sortObjectByValues(reactions) || {};
    const message = await this.processIncomingMessage(update.message, options);
    return {
      message: message,
      reactions: reactions,
      viewCount: update.views,
    };
  }

  protected toChannel(newsletter: NOWEBNewsletterMetadata): Channel {
    const role =
      newsletter.viewer_metadata?.role ||
      (newsletter.viewer_metadata?.view_role as ChannelRole) ||
      ChannelRole.GUEST;
    const preview = newsletter.preview
      ? getPublicUrlFromDirectPath(newsletter.preview)
      : null;
    const picture = newsletter.picture
      ? getPublicUrlFromDirectPath(newsletter.picture)
      : null;
    return {
      id: newsletter.id,
      name: newsletter.name,
      description: newsletter.description,
      invite: getChannelInviteLink(newsletter.invite),
      preview: preview || picture,
      picture: picture || preview,
      verified: newsletter.verification === 'VERIFIED',
      role: role,
      subscribersCount: newsletter.subscribers,
    };
  }

  @Activity()
  public async channelsList(query: ListChannelsQuery): Promise<Channel[]> {
    const newsletters = await this.sock.newsletterSubscribed();
    let channels = newsletters
      .map(toNewsletterMetadata)
      .filter(Boolean)
      .map(this.toChannel);
    if (query.role) {
      // @ts-ignore
      channels = channels.filter((channel) => channel.role === query.role);
    }
    return channels;
  }

  @Activity()
  public async channelsCreateChannel(request: CreateChannelRequest) {
    const newsletter = await this.sock.newsletterCreate(
      request.name,
      request.description,
    );
    const channel = this.toChannel(toNewsletterMetadata(newsletter));

    if (request.picture) {
      let file = request.picture;
      let picture: any;
      // @ts-ignore
      if (file.url) {
        file = file as RemoteFile;
        picture = await esm.b.getStream({ url: file.url });
        // @ts-ignore
      } else if (file.data) {
        file = file as BinaryFile;
        picture = Buffer.from(file.data, 'base64');
      }
      await this.sock.newsletterUpdatePicture(channel.id, picture);
    }
    return channel;
  }

  @Activity()
  public async channelsGetChannel(id: string) {
    const newsletter = await this.sock.newsletterMetadata('jid', id);
    return this.toChannel(toNewsletterMetadata(newsletter));
  }

  @Activity()
  public async channelsGetChannelByInviteCode(inviteCode: string) {
    const newsletter = await this.sock.newsletterMetadata('invite', inviteCode);
    return this.toChannel(toNewsletterMetadata(newsletter));
  }

  @Activity()
  public async channelsDeleteChannel(id: string) {
    return await this.sock.newsletterDelete(id);
  }

  @Activity()
  public async channelsFollowChannel(id: string): Promise<any> {
    return await this.sock.newsletterFollow(id);
  }

  @Activity()
  public async channelsUnfollowChannel(id: string): Promise<any> {
    return await this.sock.newsletterUnfollow(id);
  }

  @Activity()
  public async channelsMuteChannel(id: string): Promise<any> {
    return await this.sock.newsletterMute(id);
  }

  @Activity()
  public async channelsUnmuteChannel(id: string): Promise<any> {
    return await this.sock.newsletterUnmute(id);
  }

  subscribeEngineEvents2() {
    //
    // All
    //
    const all$ = new Observable<EnginePayload>((subscriber) => {
      return this.sock.ev.process((events) => {
        // iterate over keys
        for (const event in events) {
          const data = events[event];
          subscriber.next({ event: event, data: data });
        }
      });
    });
    this.events2.get(WAHAEvents.ENGINE_EVENT).switch(all$);

    //
    // Messages
    //
    const messagesUpsert$ = fromEvent(this.sock.ev, 'messages.upsert').pipe(
      map((event: BaileysEventMap['messages.upsert']) => event.messages),
      mergeAll(),
      filter((msg) => this.jids.include(msg.key.remoteJid)),
      share(),
    );
    let [messagesFromMe$, messagesFromOthers$] = partition(
      messagesUpsert$,
      isMine,
    );
    messagesFromMe$ = messagesFromMe$.pipe(
      mergeMap((msg) => this.processIncomingMessage(msg, this.media.events)),
      filter(Boolean),
      DistinctMessages(),
      share(), // share it so we don't process twice in message.any
    );
    messagesFromOthers$ = messagesFromOthers$.pipe(
      mergeMap((msg) => this.processIncomingMessage(msg, this.media.events)),
      filter(Boolean),
      DistinctMessages(),
      share(), // share it so we don't process twice in message.any
    );
    const messagesFromAll$ = merge(messagesFromMe$, messagesFromOthers$);
    this.events2.get(WAHAEvents.MESSAGE).switch(messagesFromOthers$);
    this.events2.get(WAHAEvents.MESSAGE_ANY).switch(messagesFromAll$);

    const messagesRevoked$ = messagesUpsert$.pipe(
      // @ts-ignore
      filter(
        (message) =>
          message.message?.protocolMessage?.type ===
          proto.Message.ProtocolMessage.Type.REVOKE,
      ),
      mergeMap(async (message): Promise<WAMessageRevokedBody> => {
        const afterMessage = await this.toWAMessage(message);
        // Extract the revoked message ID from protocolMessage.key
        const revokedMessageId = message.message.protocolMessage.key?.id;
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
    const messagesEdited$ = messagesUpsert$.pipe(
      filter(
        (message) =>
          IsEditedMessage(message.message) ||
          IsSecretEncryptedMessageEdit(message.message),
      ),
      mergeMap(async (message): Promise<WAMessageEditedBody> => {
        const waMessage = await this.toWAMessage(message);
        let body = '';
        let editedMessageId: string | undefined;
        if (IsEditedMessage(message.message)) {
          const content = normalizeMessageContent(message.message);
          body = extractBody(content.protocolMessage.editedMessage) || '';
          editedMessageId = content.protocolMessage.key?.id;
        } else if (IsSecretEncryptedMessageEdit(message.message)) {
          const sem = message.message.secretEncryptedMessage;
          editedMessageId = sem.targetMessageKey?.id;
          body =
            (await this.tryDecryptNOWEBSecretMessageEdit(message, sem)) || '';
        }
        return {
          ...waMessage,
          body: body,
          editedMessageId: editedMessageId,
          _data: message,
        };
      }),
    );
    this.events2.get(WAHAEvents.MESSAGE_EDITED).switch(messagesEdited$);

    //
    // Message Reactions
    //
    const messageReactions$ = messagesUpsert$.pipe(
      concatMap((message) => this.processMessageReaction(message)),
      filter(Boolean),
    );
    this.events2.get(WAHAEvents.MESSAGE_REACTION).switch(messageReactions$);

    //
    // Message Ack
    //
    const messageUpdates$: Observable<WAMessageUpdate> = fromEvent(
      this.sock.ev,
      'messages.update',
    ).pipe(
      // @ts-ignore
      mergeAll(),
      filter((update) => this.jids.include(update.key.remoteJid)),
      share(),
    );
    const messageAckDirect$ = messageUpdates$.pipe(
      filter(isMine), // ack comes only for MY messages
      filter(isAckUpdateMessageEvent),
      map(this.convertMessageUpdateToMessageAck.bind(this)),
    );
    const messageReceiptUpdate$: Observable<MessageUserReceiptUpdate> =
      fromEvent(this.sock.ev, 'message-receipt.update').pipe(
        // @ts-ignore
        mergeAll(),
        filter((update) => this.jids.include(update.key.remoteJid)),
        share(),
      );

    const messageAckGroups$ = messageReceiptUpdate$.pipe(
      filter(isMine), // ack comes only for MY messages
      map(this.convertMessageReceiptUpdateToMessageAck.bind(this)),
    );
    const messageAckDirectFinal$ = messageAckDirect$.pipe(DistinctAck());
    const messageAckGroupsFinal$ = messageAckGroups$.pipe(DistinctAck());

    this.events2.get(WAHAEvents.MESSAGE_ACK).switch(messageAckDirectFinal$);
    this.events2
      .get(WAHAEvents.MESSAGE_ACK_GROUP)
      .switch(messageAckGroupsFinal$);

    //
    // Other
    //
    this.events2
      .get(WAHAEvents.STATE_CHANGE)
      .switch(fromEvent(this.sock.ev, 'connection.update').pipe(share()));

    const groupsUpsert$: Observable<GroupMetadata> = fromEvent(
      this.sock.ev,
      'groups.upsert',
    ).pipe(
      // @ts-ignore
      mergeAll(),
      share(),
    );
    const groupsUpdate$: Observable<Partial<GroupMetadata>> = fromEvent(
      this.sock.ev,
      'groups.update',
    ).pipe(
      // @ts-ignore
      mergeAll(),
      share(),
    );
    const groupsParticipantsUpdate$: Observable<any> = fromEvent(
      this.sock.ev,
      'group-participants.update',
    ).pipe(share());

    this.events2.get(WAHAEvents.GROUP_JOIN).switch(groupsUpsert$);

    const groupV2Join$ = groupsUpsert$.pipe(
      map((group) => ToGroupV2JoinEvent(group)),
    );
    this.events2.get(WAHAEvents.GROUP_V2_JOIN).switch(groupV2Join$);

    const groupV2Update$ = merge(groupsUpdate$).pipe(map(ToGroupV2UpdateEvent));
    this.events2.get(WAHAEvents.GROUP_V2_UPDATE).switch(groupV2Update$);

    const groupV2Participants$ = groupsParticipantsUpdate$.pipe(
      map(ToGroupV2Participants),
    );
    this.events2
      .get(WAHAEvents.GROUP_V2_PARTICIPANTS)
      .switch(groupV2Participants$);

    const groupV2Leave$ = groupsParticipantsUpdate$.pipe(
      map((group) =>
        ToGroupV2LeaveEvent(this.sock?.authState?.creds?.me, group),
      ),
      filter(Boolean),
    );
    this.events2.get(WAHAEvents.GROUP_V2_LEAVE).switch(groupV2Leave$);

    const groupV2ParticipantsJoinRequest$: Observable<any> = fromEvent(
      this.sock.ev,
      'group.join-request',
    ).pipe(
      map((event: any) => ToGroupV2ParticipantsJoinRequestEvent(event)),
      filter(Boolean),
    );
    this.events2
      .get(WAHAEvents.GROUP_V2_PARTICIPANTS_JOIN_REQUEST)
      .switch(groupV2ParticipantsJoinRequest$);

    this.events2.get(WAHAEvents.PRESENCE_UPDATE).switch(
      fromEvent(this.sock.ev, 'presence.update').pipe(
        filter((presence: any) => this.jids.include(presence.id)),
        map((data: any) => this.toWahaPresences(data.id, data.presences)),
        share(),
      ),
    );

    //
    // Poll votes
    //
    this.events2
      .get(WAHAEvents.POLL_VOTE)
      .switch(
        messageUpdates$.pipe(
          mergeMap(this.handleMessagesUpdatePollVote.bind(this)),
          filter(Boolean),
        ),
      );
    this.events2
      .get(WAHAEvents.POLL_VOTE_FAILED)
      .switch(
        messagesUpsert$.pipe(
          mergeMap(this.handleMessageUpsertPollVoteFailed.bind(this)),
          filter(Boolean),
        ),
      );

    //
    // Calls
    //
    // @ts-ignore
    const calls$: Observable<WACallEvent[]> = fromEvent(this.sock.ev, 'call');
    const call$ = calls$.pipe(
      mergeMap(identity),
      filter((call: WACallEvent) =>
        this.jids.include(call.groupJid || call.chatId),
      ),
      share(),
    );

    const acceptedCallIds = new Set<string>();
    this.events2.get(WAHAEvents.CALL_RECEIVED).switch(
      call$.pipe(
        filter((call: WACallEvent) => call.status === 'offer'),
        map(this.toCallData.bind(this)),
      ),
    );
    this.events2.get(WAHAEvents.CALL_ACCEPTED).switch(
      call$.pipe(
        filter((call: WACallEvent) => call.status === 'accept'),
        tap((call: WACallEvent) => acceptedCallIds.add(call.id)),
        map(this.toCallData.bind(this)),
      ),
    );
    this.events2.get(WAHAEvents.CALL_REJECTED).switch(
      call$.pipe(
        filter(
          (call: WACallEvent) =>
            call.status === 'reject' || call.status === 'terminate',
        ),
        // Skip rejections when the call was accepted earlier (local or other device)
        exclude((call: WACallEvent) => {
          const shouldSkip = acceptedCallIds.has(call.id);
          if (call.status === 'terminate') {
            acceptedCallIds.delete(call.id);
          }
          return shouldSkip;
        }),
        // We get two "reject" events, one with null isGroup property, ignore it
        exclude((call: WACallEvent) => call.isGroup == null),
        groupBy((call: WACallEvent) => call.id || 'unknown'),
        mergeMap((group$) =>
          group$.pipe(
            debounceTime(1_000),
            tap((call: WACallEvent) => acceptedCallIds.delete(call.id)),
          ),
        ),
        map(this.toCallData.bind(this)),
      ),
    );

    //
    // Labels
    //
    // @ts-ignore
    const labelsEdit$: Observable<NOWEBLabel> = fromEvent(
      this.sock.ev,
      'labels.edit',
    ).pipe(share());
    this.events2.get(WAHAEvents.LABEL_UPSERT).switch(
      labelsEdit$.pipe(
        exclude((data: NOWEBLabel) => data.deleted),
        map(this.toLabel.bind(this)),
      ),
    );
    this.events2.get(WAHAEvents.LABEL_DELETED).switch(
      labelsEdit$.pipe(
        filter((data: NOWEBLabel) => data.deleted),
        map(this.toLabel.bind(this)),
      ),
    );
    const labelsAssociation$ = fromEvent(
      this.sock.ev,
      'labels.association',
    ).pipe(share());
    const labelsAssociationAdd$: Observable<ChatLabelAssociation> =
      labelsAssociation$.pipe(
        filter(({ type }: any) => type === 'add'),
        map((data) => data.association),
        filter(
          (association: any) => association.type === LabelAssociationType.Chat,
        ),
      );

    const labelsAssociationRemove$: Observable<ChatLabelAssociation> =
      labelsAssociation$.pipe(
        filter(({ type }: any) => type === 'remove'),
        map((data) => data.association),
        filter(
          (association: any) => association.type === LabelAssociationType.Chat,
        ),
      );
    this.events2
      .get(WAHAEvents.LABEL_CHAT_ADDED)
      .switch(
        labelsAssociationAdd$.pipe(
          mergeMap(this.toLabelChatAssociation.bind(this)),
        ),
      );
    this.events2
      .get(WAHAEvents.LABEL_CHAT_DELETED)
      .switch(
        labelsAssociationRemove$.pipe(
          mergeMap(this.toLabelChatAssociation.bind(this)),
        ),
      );
  }

  protected listenContactsUpdatePictureProfile() {
    this.sock.ev.on('contacts.update', async (updates) => {
      for (const update of updates) {
        if (update.imgUrl !== 'changed') {
          continue;
        }

        this.logger.debug({ jid: update.id }, 'Profile picture updated');
        const url = await this.refreshProfilePicture(update.id);
        if (isPnUser(update.id) || isLidUser(update.id)) {
          // update 123@c.us and 123 profiles as well
          const cus = toCusFormat(update.id);
          this.profilePictures.set(cus, url);
          const phone = update.id.split('@')[0];
          this.profilePictures.set(phone, url);
        }
      }
    });
  }

  /**
   * END - Methods for API
   */

  private async processMessageReaction(
    message,
  ): Promise<WAMessageReaction | null> {
    if (!message) return null;
    if (!message.message) return null;
    if (!message.message.reactionMessage) return null;

    const id = buildMessageId(message.key);
    const fromToParticipant = getFromToParticipant(message.key);
    const reactionMessage = message.message.reactionMessage;
    const messageId = buildMessageId(reactionMessage.key);
    let source = await this.hooks.message.source.promise(message.key.id);
    source = source ?? MessageSource.APP;
    const reaction: WAMessageReaction = {
      id: id,
      timestamp: ensureNumber(message.messageTimestamp),
      from: toCusFormat(fromToParticipant.from),
      fromMe: message.key.fromMe,
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

  shouldProcessIncomingMessage(message): boolean {
    // if there is no text or media message
    if (!message) return;
    // View-once (self-destructing) messages arrive with key.isViewOnce=true but
    // no message content (burned by sender). Allow them through so a webhook
    // is still fired with key/timestamp metadata.
    if (!message.message && !message.key?.isViewOnce) return;
    // Ignore reactions, we have dedicated handler for that
    if (message.message?.reactionMessage) return;
    // Ignore poll votes, we have dedicated handler for that
    if (message.message?.pollUpdateMessage) return;
    // Ignore calls, we have dedicated handler for that
    if (message.message?.call?.callKey) return;
    // Ignore revoke, we have a dedicated event for that
    if (
      message.message?.protocolMessage?.type ===
      proto.Message.ProtocolMessage.Type.REVOKE
    )
      return;
    // Ignore edit, we have a dedicated event for that
    if (IsEditedMessage(message.message)) return;
    // Ignore secret-encrypted message edits (mobile app format), dedicated handler routes them
    if (IsSecretEncryptedMessageEdit(message.message)) return;

    // Ignore history sync notifications
    if (IsHistorySyncNotification(message.message)) return;

    if (
      message.message?.protocolMessage?.type ===
      proto.Message.ProtocolMessage.Type.EPHEMERAL_SYNC_RESPONSE
    )
      return;
    if (
      message.message?.protocolMessage?.type ===
      proto.Message.ProtocolMessage.Type
        .PEER_DATA_OPERATION_REQUEST_RESPONSE_MESSAGE
    )
      return;

    const normalizedContent = normalizeMessageContent(message.message);
    const contentType = getContentType(normalizedContent);
    // Ignore device sent message
    if (contentType == 'deviceSentMessage') {
      return;
    }
    const hasSomeContent = !!contentType;
    if (!hasSomeContent) {
      // Ignore key distribution messages
      if (message?.message?.senderKeyDistributionMessage) return;
    }
    return true;
  }

  protected async tryDecryptNOWEBSecretMessageEdit(
    editMessage: proto.IWebMessageInfo,
    sem: proto.Message.ISecretEncryptedMessage,
  ): Promise<string> {
    const targetKey = sem.targetMessageKey;
    const origMsgId = targetKey?.id;
    if (!origMsgId) {
      return '';
    }
    const editKey = editMessage.key as WAMessageKey | undefined;
    const jidsToTry = [
      targetKey.remoteJid,
      editKey?.remoteJid,
      editKey?.remoteJidAlt,
    ].filter(Boolean);
    let stored: proto.IWebMessageInfo | undefined;
    for (const jid of jidsToTry) {
      stored = await this.store?.loadMessage(jid, origMsgId);
      if (stored) {
        break;
      }
    }
    if (!stored) {
      this.logger.debug(
        { origMsgId: origMsgId },
        'NOWEB message edit decrypt: original message not found in store',
      );
      return '';
    }
    const secretBytes =
      normalizeMessageContent(stored.message)?.messageContextInfo
        ?.messageSecret ?? stored.message?.messageContextInfo?.messageSecret;
    if (!secretBytes || secretBytes.length !== 32) {
      this.logger.debug(
        { origMsgId: origMsgId },
        'NOWEB message edit decrypt: missing messageSecret on original',
      );
      return '';
    }
    const origSecret = Buffer.from(secretBytes);
    const encPayload = sem.encPayload ? Buffer.from(sem.encPayload) : null;
    const encIv = sem.encIv ? Buffer.from(sem.encIv) : null;
    if (!encPayload || !encIv) {
      return '';
    }

    // The editor ("modification sender").
    let modificationSenderJids: Array<string | null | undefined>;
    if (editKey?.fromMe) {
      // Try both user lid and c.us
      modificationSenderJids = [this.sock?.user?.lid, this.sock?.user?.id];
    } else {
      const editJids = editKey ? jidsFromKey(editKey) : null;
      modificationSenderJids = [
        editKey?.participant || editKey?.remoteJid,
        editJids?.lid,
        editJids?.pn,
      ];
    }
    modificationSenderJids = lodash
      .chain(modificationSenderJids)
      .filter(Boolean)
      .map(jidToNonAD)
      .uniq()
      .value();
    if (modificationSenderJids.length === 0) {
      modificationSenderJids.push('');
    }

    const remoteNonAD = targetKey.remoteJid
      ? jidToNonAD(targetKey.remoteJid)
      : '';
    const participantNonAD = targetKey.participant
      ? jidToNonAD(targetKey.participant)
      : '';

    // Map dedupes by key and keeps the first-insertion order
    const attempts = new Map<
      string,
      { origSenderJid: string; modificationSenderJid: string }
    >();
    for (const modificationSenderJid of modificationSenderJids) {
      const primaryOrigSenderJid = getOrigSenderJidForMsgSecret(
        { Chat: editKey?.remoteJid, Sender: modificationSenderJid },
        {
          fromMe: targetKey.fromMe,
          remoteJID: targetKey.remoteJid,
          participant: targetKey.participant,
        },
      );
      const origSenderJids = [
        primaryOrigSenderJid,
        remoteNonAD,
        participantNonAD,
      ].filter(Boolean);
      for (const origSenderJid of origSenderJids) {
        // Avoid duplicates in attemps
        const attemptKey = `${origSenderJid}|${modificationSenderJid}`;
        attempts.set(attemptKey, {
          origSenderJid: origSenderJid,
          modificationSenderJid: modificationSenderJid,
        });
      }
    }

    let lastErr: unknown;
    for (const attempt of attempts.values()) {
      try {
        const decoded = decryptSecretEncryptedMessageEditProto({
          encPayload: encPayload,
          encIv: encIv,
          origMsgId: origMsgId,
          origSenderJid: attempt.origSenderJid,
          modificationSenderJid: attempt.modificationSenderJid,
          origMsgSecret: origSecret,
        });
        const text = extractBody(decoded) || '';
        if (text) {
          return text;
        }
      } catch (err) {
        lastErr = err;
      }
    }
    this.logger.debug(
      {
        err: lastErr,
        origMsgId: origMsgId,
        attempts: Array.from(attempts.keys()),
      },
      'NOWEB message edit decrypt: AES-GCM or protobuf decode failed',
    );
    return '';
  }

  protected async processIncomingMessage(
    message,
    options: MediaDownloadOptions,
  ): Promise<WAMessage | null> {
    // Filter
    if (!this.shouldProcessIncomingMessage(message)) {
      return null;
    }
    // Convert
    const wamessage = await this.toWAMessageSafe(message);
    if (!wamessage) {
      return null;
    }
    // Media
    wamessage.media = await this.downloadMediaSafe(message, options);

    if (wamessage.replyTo?.hasMedia) {
      const mediaContent = extractMediaContent(wamessage.replyTo._data);
      const m = {
        message: wamessage.replyTo._data,
        key: {
          id:
            wamessage.replyTo.id ||
            mediaContent.fileSha256 ||
            mediaContent.fileEncSha256 ||
            mediaContent.mediaKeyTimestamp,
          remoteJid: message.key.remoteJid,
        },
      };
      wamessage.replyTo.media = await this.downloadMediaSafe(m, options);
    }
    return wamessage;
  }

  protected async toWAMessageSafe(message): Promise<WAMessage | null> {
    try {
      return await this.toWAMessage(message);
    } catch (error) {
      this.logger.error('Failed to process incoming message');
      this.logger.error(error);
      return null;
    }
  }

  protected async toWAMessage(message): Promise<WAMessage> {
    const fromToParticipant = getFromToParticipant(message.key);
    const id = buildMessageId(message.key);
    const body = extractBody(message.message);
    const replyTo = this.extractReplyTo(message.message);
    const ack = message.ack || StatusToAck(message.status);
    const mediaContent = extractMediaContent(message.message);
    let source = await this.hooks.message.source.promise(message.key.id);
    source = source ?? MessageSource.APP;
    const waproto = message.message;
    return {
      id: id,
      timestamp: ensureNumber(message.messageTimestamp),
      from: toCusFormat(fromToParticipant.from),
      fromMe: message.key.fromMe,
      source: source,
      body: body || null,
      to: toCusFormat(fromToParticipant.to),
      participant: toCusFormat(fromToParticipant.participant),
      // Media
      hasMedia: Boolean(mediaContent),
      media: null,
      mediaUrl: message.media?.url,
      // @ts-ignore
      ack: ack,
      // @ts-ignore
      ackName: WAMessageAck[ack] || ACK_UNKNOWN,
      location: extractWALocation(waproto),
      vCards: extractVCards(waproto),
      replyTo: replyTo,
      _data: message,
    };
  }

  protected extractReplyTo(message): ReplyToMessage | null {
    if (!message) return null;
    const msgType = getContentType(message);
    const contextInfo = message[msgType]?.contextInfo;
    if (!contextInfo) {
      return null;
    }
    const quotedMessage = contextInfo.quotedMessage;
    if (!quotedMessage) {
      return null;
    }
    const body = extractBody(quotedMessage);
    const mediaContent = extractMediaContent(quotedMessage);
    return {
      id: contextInfo.stanzaId,
      participant: toCusFormat(contextInfo.participant),
      body: body,
      // Media
      hasMedia: Boolean(mediaContent),
      media: null,
      // Data
      _data: quotedMessage,
    };
  }

  protected toWAContact(contact: Contact) {
    contact.id = toCusFormat(contact.id);
    // @ts-ignore
    contact.pushname = contact.notify;
    // @ts-ignore
    delete contact.notify;
    return contact;
  }

  protected convertMessageUpdateToMessageAck(event): WAMessageAckBody {
    const message = event;
    const fromToParticipant = getFromToParticipant(message.key);
    const id = buildMessageId(message.key);
    const ack = StatusToAck(message.update.status);
    const body: WAMessageAckBody = {
      id: id,
      from: toCusFormat(fromToParticipant.from),
      to: toCusFormat(fromToParticipant.to),
      participant: toCusFormat(fromToParticipant.participant),
      fromMe: message.key.fromMe,
      ack: ack,
      ackName: WAMessageAck[ack] || ACK_UNKNOWN,
    };
    return body;
  }

  protected convertMessageReceiptUpdateToMessageAck(event): WAMessageAckBody {
    const fromToParticipant = getFromToParticipant(event.key);

    const receipt = event.receipt;
    let ack;
    if (receipt.receiptTimestamp) {
      ack = WAMessageAck.SERVER;
    } else if (receipt.playedTimestamp) {
      ack = WAMessageAck.PLAYED;
    } else if (receipt.readTimestamp) {
      ack = WAMessageAck.READ;
    }

    const key = { ...event.key };
    if (key.fromMe) {
      key.participant = this.getSessionMeInfo()?.id;
    } else {
      key.participant = event.receipt.userJid;
    }
    const id = buildMessageId(key);

    const body: WAMessageAckBody = {
      id: id,
      from: toCusFormat(fromToParticipant.from),
      to: toCusFormat(fromToParticipant.to),
      participant: toCusFormat(fromToParticipant.participant),
      fromMe: event.key.fromMe,
      ack: ack,
      ackName: WAMessageAck[ack] || ACK_UNKNOWN,
      _data: event,
    };
    return body;
  }

  protected async handleMessagesUpdatePollVote(event) {
    const { key, update } = event;
    const pollUpdates = update?.pollUpdates;
    if (!pollUpdates) {
      return;
    }

    const pollCreationMessageKey = key;
    const pkey = { ...key };
    pkey.remoteJid = null; // try to find message creation by id only
    const pollCreationMessage = await this.getMessage(pkey);
    if (!pollCreationMessage) {
      this.logger.warn(
        { pollCreationMessageKey },
        'poll creation message not found, cannot aggregate votes',
      );
      return;
    }
    // Handle updates one by one, so we can get Vote Message for the specific vote
    for (const pollUpdate of pollUpdates) {
      const votes = getAggregateVotesInPollMessage({
        message: pollCreationMessage,
        pollUpdates: [pollUpdate],
      });

      // Get selected options for the author
      const selectedOptions = [];
      for (const voteAggregation of votes) {
        for (const voter of voteAggregation.voters) {
          if (voter === getKeyAuthor(pollUpdate.pollUpdateMessageKey)) {
            selectedOptions.push(voteAggregation.name);
          }
        }
      }

      // Build payload and call the handler
      const voteDestination = getDestination(pollUpdate.pollUpdateMessageKey);
      const pollVote: PollVote = {
        ...voteDestination,
        selectedOptions: selectedOptions,
        timestamp: ensureNumber(pollUpdate.senderTimestampMs),
      };
      const payload: PollVotePayload = {
        vote: pollVote,
        poll: getDestination(pollCreationMessageKey),
      };
      return payload;
    }
  }

  protected async handleMessageUpsertPollVoteFailed(message) {
    const pollUpdateMessage = message.message?.pollUpdateMessage;
    if (!pollUpdateMessage) {
      return;
    }
    const pollCreationMessageKey = pollUpdateMessage.pollCreationMessageKey;
    const pkey = { ...pollCreationMessageKey };
    pkey.remoteJid = null; // try to find message creation by id only
    const pollCreationMessage = await this.getMessage(pkey);
    if (pollCreationMessage) {
      // We found message, so later the engine will issue a message.update message
      return;
    }

    // We didn't find the creation message, so send failed one
    const pollUpdateMessageKey = message.key;
    const voteDestination = getDestination(pollUpdateMessageKey);
    const pollVote: PollVote = {
      ...voteDestination,
      selectedOptions: [],
      // change to below line when the PR merged, so we have the same timestamps
      // https://github.com/WhiskeySockets/Baileys/pull/348
      // Or without toNumber() - it depends on the PR above
      // timestamp: pollUpdateMessage.senderTimestampMs.toNumber()
      timestamp: ensureNumber(message.messageTimestamp),
    };
    const payload: PollVotePayload = {
      vote: pollVote,
      poll: getDestination(pollCreationMessageKey),
    };
    return payload;
  }

  private toCallData(call: WACallEvent): CallData {
    // call.date can be either string 2024-07-18T09:45:55.000Z or Date
    const date = new Date(call.date);
    // convert to timestamp in seconds
    const timestamp: number = date.getTime() / 1000;
    return {
      id: call.id,
      from: toCusFormat(call.from),
      timestamp: timestamp,
      isVideo: call.isVideo,
      isGroup: call.isGroup,
      _data: call,
    };
  }

  private toWahaPresences(
    remoteJid: string,
    storedPresences: { [participant: string]: PresenceData },
  ): WAHAChatPresences {
    const presences: WAHAPresenceData[] = [];
    for (const participant in storedPresences) {
      const data: PresenceData = storedPresences[participant];
      const lastKnownPresence = lodash.get(
        PresenceStatuses,
        data.lastKnownPresence,
        data.lastKnownPresence,
      );
      const presence: WAHAPresenceData = {
        participant: toCusFormat(participant),
        // @ts-ignore
        lastKnownPresence: lastKnownPresence,
        lastSeen: data.lastSeen || null,
      };
      presences.push(presence);
    }
    const chatId = toCusFormat(remoteJid);
    return { id: chatId, presences: presences };
  }

  protected async downloadMediaSafe(
    message,
    options: MediaDownloadOptions,
  ): Promise<WAMedia | null> {
    try {
      let processor: IMediaEngineProcessor<any> = new NOWEBEngineMediaProcessor(
        this,
        this.loggerBuilder,
      );
      processor = new LottieMediaProcessorWrapper(processor, this.logger);
      return await this.mediaManager.processMedia(processor, message, options);
    } catch (e) {
      this.logger.error('Failed when tried to download media for a message');
      this.logger.error(e, e.stack);
    }
    return null;
  }

  protected async getMessageOptions(request: {
    id?: string;
    chatId: string;
    reply_to?: string;
  }) {
    const jid = await this.hooks.wid.chat.promise(
      request.chatId,
      'getMessageOptions',
    );

    let quoted;
    if (request.reply_to) {
      const key = parseMessageIdSerialized(request.reply_to, true);
      quoted = await this.store.loadMessage(jid, key.id);
    }
    const chat = await this.store.getChat(jid);
    const messageId = request.id ? request.id : this.generateMessageID();
    this.hooks.message.sent.call(messageId);
    return {
      quoted: quoted,
      ephemeralExpiration: chat?.ephemeralExpiration,
      messageId: messageId,
    };
  }

  protected getLinkPreview(request): any {
    // NOWEB works this way
    // If it's undefined - it'll generate it
    // If it's false - it will not generate it
    let linkPreview: boolean | undefined;
    switch (request.linkPreview) {
      case false:
        linkPreview = false;
        break;
      case true:
      default:
        linkPreview = undefined;
    }
    return linkPreview;
  }

  protected generateMessageID() {
    const id = generateMessageIDV2(this.sock.user?.id);
    this.hooks.message.sent.call(id);
    return id;
  }
}

function hasPath(url: string) {
  if (!url) {
    return false;
  }
  try {
    const urlObj = new URL(url);
    return urlObj.pathname !== '/';
  } catch (error) {
    return false;
  }
}

export class NOWEBEngineMediaProcessor implements IMediaEngineProcessor<any> {
  private readonly logger: ILogger;

  constructor(
    public session: WhatsappSessionNoWebCore,
    loggerBuilder: LoggerBuilder,
  ) {
    this.logger = loggerBuilder.child({
      name: NOWEBEngineMediaProcessor.name,
    }) as unknown as ILogger;
  }

  hasMedia(message: any): boolean {
    return Boolean(extractMediaContent(message.message));
  }

  getMessageId(message: any): string {
    return message.key.id;
  }

  getChatId(message: any): string {
    return toCusFormat(message.key.remoteJid);
  }

  getMimetype(message: any): string {
    const content = extractMediaContent(message.message);
    return content.mimetype;
  }

  async getMediaContent(message: any): Promise<MediaContent | null> {
    const buffer = await this.getMediaBuffer(message);
    if (!buffer) {
      return null;
    }
    return { buffer: buffer };
  }

  private async getMediaBuffer(message: any): Promise<Buffer | null> {
    const content = extractMediaContent(message.message);
    const url = content.url;
    // Fix Stickers
    // https://github.com/devlikeapro/waha/issues/504
    // Set it to null so the engine handles it right
    if (!hasPath(url)) {
      content.url = null;
    }
    // Fix Newsletter
    // directPath has the unencrypted path
    if (isJidNewsletter(message.key.remoteJid) && content.directPath) {
      content.url = null;
    }

    // Use 'stream' mode instead of 'buffer' to fix 0-byte audio files
    // 'buffer' mode silently returns empty buffer for audio/voice messages
    // See: https://github.com/devlikeapro/waha/issues/1996
    const stream = await downloadMediaMessage(
      message,
      'stream',
      {},
      {
        logger: this.logger,
        reuploadRequest: this.session.sock.updateMediaMessage,
      },
    ).finally(() => {
      // Set url back in case we removed it
      content.url = url;
    });
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  getFilename(message: any): string | null {
    const content = extractMessageContent(message.message);
    return content?.documentMessage?.fileName || null;
  }
}

export const ALL_JID = 'all@s.whatsapp.net';

function getId(object) {
  return object.id;
}

function isMine(message) {
  return message?.key?.fromMe;
}

function isNotMine(message) {
  return !message?.key?.fromMe;
}

function isAckUpdateMessageEvent(event) {
  return event?.update.status != null;
}

export function getFromToParticipant(key) {
  const isGroupMessage = Boolean(key.participant);
  let participant: string;
  let to: string;
  if (isGroupMessage) {
    participant = key.participant;
    to = key.remoteJid;
  }
  const from = key.remoteJid;
  return {
    from: from,
    to: to,
    participant: participant,
  };
}

function getTo(key, meId = undefined) {
  // For group - always to group JID
  const isGroupMessage = Boolean(key.participant);
  if (isGroupMessage) {
    return key.remoteJid;
  }
  if (key.fromMe) {
    return key.remoteJid;
  }
  return meId || 'me';
}

function getFrom(key, meId) {
  // For group - always from participant
  const isGroupMessage = Boolean(key.participant);
  if (isGroupMessage) {
    return key.participant;
  }
  if (key.fromMe) {
    return meId || 'me';
  }
  return key.remoteJid;
}

export function getDestination(key, meId = undefined): MessageDestination {
  return {
    id: buildMessageId(key),
    to: toCusFormat(getTo(key, meId)),
    from: toCusFormat(getFrom(key, meId)),
    fromMe: key.fromMe,
  };
}

export function extractBody(message): string | null {
  if (!message) {
    return null;
  }
  const content = extractMessageContent(message);
  if (!content) {
    return null;
  }
  let body = content.conversation || null;
  if (!body) {
    // Some of the messages have no conversation, but instead have text in extendedTextMessage
    // https://github.com/devlikeapro/waha/issues/90
    body = content.extendedTextMessage?.text;
  }
  if (!body) {
    // Populate from caption
    const mediaContent = extractMediaContent(content);
    // @ts-ignore - AudioMessage doesn't have caption field
    body = mediaContent?.caption;
  }
  if (!body && content.protocolMessage?.editedMessage) {
    body = extractBody(content.protocolMessage.editedMessage);
  }
  if (!body && content.associatedChildMessage?.message) {
    body = extractBody(content.associatedChildMessage.message);
  }
  // Response for buttons
  if (!body) {
    body = content.templateButtonReplyMessage?.selectedDisplayText;
  }
  if (!body) {
    body = content.buttonsResponseMessage?.selectedDisplayText;
  }

  // List message
  if (!body) {
    const type = getContentType(content);
    if (type == 'listMessage') {
      const list = content.listMessage;
      const parts = [list.title, list.description, list.footerText];
      body = parts.filter(Boolean).join('\n');
    } else if (type === 'listResponseMessage') {
      const response = content.listResponseMessage;
      const parts = [response.title, response.description];
      body = parts.filter(Boolean).join('\n');
    }
  }

  return body;
}
