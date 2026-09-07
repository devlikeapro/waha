import { WebJSPresence } from '@waha/core/engines/webjs/types';
import { GetSerialized } from '@waha/core/utils/serialized';
import { GetChatMessagesFilter } from '@waha/structures/chats.dto';
import { Label } from '@waha/structures/labels.dto';
import { LidToPhoneNumber } from '@waha/structures/lids.dto';
import { PaginationParams } from '@waha/structures/pagination.dto';
import { TextStatus } from '@waha/structures/status.dto';
import { sleep } from '@waha/utils/promiseTimeout';
import { EventEmitter } from 'events';
import * as lodash from 'lodash';
import { Logger } from 'pino';
import { Page } from 'puppeteer';
import { Client, Events, Message as WebjsMessage } from 'whatsapp-web.js';
import { Message } from 'whatsapp-web.js/src/structures';
import { Message as MessageInstance } from 'whatsapp-web.js/src/structures';

import { CallErrorEvent, PAGE_CALL_ERROR_EVENT, WPage } from './WPage';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { LoadLodash } = require('./_lodash.js');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { LoadPaginator } = require('./_Paginator.js');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ChatFactory = require('whatsapp-web.js/src/factories/ChatFactory');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  exposeFunctionIfAbsent,
} = require('whatsapp-web.js/src/util/Puppeteer');

export interface WebjsChannelMessage {
  message: WebjsMessage;
  reactions: ChannelMessageReaction[];
  viewCount: number;
}

class ChannelMessageReaction {
  reaction: string;
  count: number;
}

interface _Id {
  id: string;
  fromMe: boolean;
  remote: string;
  _serialized: string;
}

/**
 *     "parentMsgKey": {
 *         "fromMe": false,
 *         "remote": "111111111111111111@newsletter",
 *         "id": "AAAAAAAAAAAAAAAAAAAA",
 *         "_serialized": "false_111111111111111111@newsletter_AAAAAAAAAAAAAAAAAAAA"
 *     },
 *     "serverTimestamp": 1738536731,
 *     "emojiCountMap": {emoji=>count}
 */
interface _NewsletterReaction {
  parentMsgKey: _Id;
  serverTimestamp: number;
  emojiCountMap: any;
}

interface _GetNewsletterPreviewDataResponse {
  ids: any[];
  newsletterMetadata: any;
  newsletterMessages: any[];
  newsletterReactions: _NewsletterReaction[];
  timestamp: number;
}

function extractReactionsByMessageKey(
  newsletterReactions: _NewsletterReaction[],
): Map<string, ChannelMessageReaction[]> {
  const reactions = new Map();
  for (const reaction of newsletterReactions) {
    const key = GetSerialized(reaction.parentMsgKey);
    const emojiCountMap = reaction.emojiCountMap;
    const reactionList: ChannelMessageReaction[] = [];
    for (const emoji in emojiCountMap) {
      reactionList.push({
        reaction: emoji,
        count: emojiCountMap[emoji],
      });
    }
    reactions.set(key, reactionList);
  }
  return reactions;
}

export class WebjsClientCore extends Client {
  public events = new EventEmitter();
  private wpage: WPage = null;
  private injecting: Promise<void> = null;

  constructor(
    options,
    protected tags: boolean,
    protected logger: Logger,
  ) {
    super(options);
    // Wait until it's READY and inject more utils
    // AUTHENTICATED and READY fire back to back - run one injection for both
    this.on(Events.AUTHENTICATED, () => this.injectUtils());
    this.on(Events.READY, () => this.injectUtils());
  }

  private injectUtils(): Promise<void> {
    if (this.injecting) {
      return this.injecting;
    }
    this.injecting = this.attachCustomEventListeners()
      .then(() => this.injectWaha())
      .catch((err) => this.logger.error(err, 'Failed to inject utils'))
      .finally(() => {
        this.injecting = null;
      });
    return this.injecting;
  }

  async initialize() {
    const result = await super.initialize();
    if (this.pupPage && !(this.pupPage instanceof WPage)) {
      this.wpage = new WPage(this.pupPage);
      this.wpage.on(PAGE_CALL_ERROR_EVENT as any, (event: CallErrorEvent) => {
        this.events.emit(PAGE_CALL_ERROR_EVENT as any, event);
      });
      this.pupPage = this.wpage as any as Page;
    }
    return result;
  }

  async injectWaha() {
    await this.pupPage.evaluate(LoadLodash);
    await this.pupPage.evaluate(LoadPaginator);
  }

  /**
   * @result indicating whether the UX fresh look was successfully hidden.
   */
  hideUXFreshLook(): Promise<boolean> {
    return this.pupPage.evaluate(() => {
      const WAWebUserPrefsUiRefresh = window.require('WAWebUserPrefsUiRefresh');
      if (!WAWebUserPrefsUiRefresh) {
        return false;
      }
      if (WAWebUserPrefsUiRefresh.getUiRefreshNuxAcked()) {
        return false;
      }
      WAWebUserPrefsUiRefresh.incrementNuxViewCount();
      WAWebUserPrefsUiRefresh.setUiRefreshNuxAcked(true);
      const WAWebModalManager = window.require('WAWebModalManager');
      WAWebModalManager.ModalManager.close();
      return true;
    });
  }

  /**
   * @result indicating whether the "What's New" auto-modal was prevented or dismissed.
   */
  hideWhatsNewModal(): Promise<boolean> {
    return this.pupPage.evaluate(() => {
      // Module registry is not available until the app bundle has loaded
      if (typeof window.require !== 'function') {
        return false;
      }
      const WAWebWhatsNewNux = window.require('WAWebWhatsNewNux');
      if (!WAWebWhatsNewNux) {
        return false;
      }
      // user prefs are not writable before login
      const WAWebUserPrefsMeUser = window.require('WAWebUserPrefsMeUser');
      if (!WAWebUserPrefsMeUser.getMaybeMePnUser()) {
        return false;
      }
      const nux = WAWebWhatsNewNux.createWhatsNewNux();
      if (!nux.shouldShow()) {
        return false;
      }
      // Bump the dismiss count and start the cool-off, so the app never auto-opens the modal
      nux.dismiss();
      // If the modal has already opened - close the topmost modal (no-op when nothing is open)
      const WAWebModalManager = window.require('WAWebModalManager');
      WAWebModalManager.ModalManager.close();
      return true;
    });
  }

  async attachCustomEventListeners() {
    await exposeFunctionIfAbsent(
      this.pupPage,
      'onNewMessageId',
      (messageId: string) => {
        this.events.emit('message.id', { id: messageId });
        return;
      },
    );
    if (this.tags) {
      await this.attachTagsEvents();
    }
  }

  async attachTagsEvents() {
    await this.pupPage.evaluate(() => {
      // @ts-ignore
      if (window.decodeStanzaBack) {
        return;
      }

      const tags = ['receipt', 'presence', 'chatstate'];
      const WAWap = window.require('WAWap');
      // @ts-ignore
      window.decodeStanzaBack = WAWap.decodeStanza;
      WAWap.decodeStanza = async (...args) => {
        // @ts-ignore
        const result = await window.decodeStanzaBack(...args);
        if (tags.includes(result?.tag)) {
          // @ts-ignore
          setTimeout(() => window.onTag(result), 0);
        }
        return result;
      };
    });
  }

  async destroy() {
    this.events.removeAllListeners();
    this.wpage?.removeAllListeners();
    await super.destroy();
  }

  async setPushName(name: string) {
    await this.ensureWahaInjected();
    await this.pupPage.evaluate(async (pushName) => {
      return await window
        .require('WAWebSetPushnameConnAction')
        .setPushname(pushName);
    }, name);
    if (this.info) {
      this.info.pushname = name;
    }
  }

  async unpair() {
    await this.pupPage.evaluate(async () => {
      const Socket = window.require('WAWebSocketModel')?.Socket;
      if (Socket && typeof Socket.logout === 'function') {
        await Socket.logout();
      }
    });
  }

  async createLabel(name: string, color: number): Promise<number> {
    await this.ensureWahaInjected();
    const labelId: number = (await this.pupPage.evaluate(
      async (name, color) => {
        return await window
          .require('WAWebBizLabelEditingAction')
          .labelAddAction(name, color);
      },
      name,
      color,
    )) as any;
    return labelId;
  }

  async deleteLabel(label: Label) {
    await this.ensureWahaInjected();
    return await this.pupPage.evaluate(async (label) => {
      return await window
        .require('WAWebBizLabelEditingAction')
        .labelDeleteAction(label.id, label.name, label.color);
    }, label);
  }

  async updateLabel(label: Label) {
    await this.ensureWahaInjected();
    return await this.pupPage.evaluate(async (label) => {
      return await window.require('WAWebBizLabelEditingAction').labelEditAction(
        label.id,
        label.name,
        undefined, // predefinedId
        label.color,
      );
    }, label);
  }

  async getChats(pagination?: PaginationParams, filter?: { ids?: string[] }) {
    if (lodash.isEmpty(pagination)) {
      return await super.getChats();
    }

    await this.ensureWahaInjected();

    // Get paginated chats
    pagination.limit ||= Infinity;
    pagination.offset ||= 0;

    const chats = await this.pupPage.evaluate(
      async (pagination, filter) => {
        let chats = window
          .require('WAWebCollections')
          .Chat.getModelsArray()
          .slice();

        // Filter chats by IDs if filter is provided
        if (filter && filter.ids && filter.ids.length > 0) {
          chats = chats.filter((chat) =>
            // @ts-ignore
            filter.ids.includes(window.WWebJS.GetSerialized(chat.id)),
          );
        }

        // @ts-ignore
        const paginator = new window.Paginator(pagination);
        chats = paginator.apply(chats);
        const chatPromises = chats.map((chat) =>
          // @ts-ignore
          window.WWebJS.getChatModel(chat),
        );
        return await Promise.all(chatPromises);
      },
      pagination,
      filter,
    );

    return chats.map((chat) => ChatFactory.create(this, chat));
  }

  protected async ensureWahaInjected() {
    const hasWaha = await this.pupPage.evaluate(() => {
      // @ts-ignore
      return Boolean(window.Paginator);
    });
    if (!hasWaha) {
      await this.injectWaha();
    }
  }

  async sendTextStatus(status: TextStatus) {
    // Convert from hex to number
    const waColor = 'FF' + status.backgroundColor.replace('#', '');
    const color = parseInt(waColor, 16);

    const textStatus = {
      text: status.text,
      color: color,
      font: status.font,
    };
    const sentMsg = await this.pupPage.evaluate(async (status) => {
      await window
        .require('WAWebSendStatusMsgAction')
        .sendStatusTextMsgAction(status);
      const meUser = window.require('WAWebUserPrefsMeUser').getMaybeMePnUser();
      const myStatus = window
        .require('WAWebCollections')
        .Status.getModelsArray()
        .findLast((x) => x.id == meUser);
      if (!myStatus) {
        return undefined;
      }
      // @ts-ignore
      const msg = myStatus.msgs.last();
      // @ts-ignore
      return msg ? window.WWebJS.getMessageModel(msg) : undefined;
    }, textStatus);

    return sentMsg ? new Message(this, sentMsg) : undefined;
  }

  async getMessages(
    chatId: string,
    filter: GetChatMessagesFilter,
    pagination: PaginationParams,
  ) {
    const messages = await this.pupPage.evaluate(
      async (chatId, filter, pagination) => {
        pagination.limit ||= Infinity;
        pagination.offset ||= 0;

        const msgFilter = (m) => {
          if (m.isNotification) {
            return false;
          }
          if (
            filter['filter.fromMe'] != null &&
            m.id.fromMe !== filter['filter.fromMe']
          ) {
            return false;
          }
          if (
            filter['filter.timestamp.gte'] != null &&
            m.t < filter['filter.timestamp.gte']
          ) {
            return false;
          }
          if (
            filter['filter.timestamp.lte'] != null &&
            m.t > filter['filter.timestamp.lte']
          ) {
            return false;
          }
          if (filter['filter.ack'] != null && m.ack !== filter['filter.ack']) {
            return false;
          }
          return true;
        };

        // @ts-ignore
        const chat = await window.WWebJS.getChat(chatId, { getAsModel: false });
        if (!chat) return [];

        let msgs = [];

        // Try new WhatsApp API (>= 2.3000.1034162388) which replaced loadEarlierMsgs
        // @ts-ignore
        const WAWebDBMessageFindLocal = window.require(
          'WAWebDBMessageFindLocal',
        );
        if (WAWebDBMessageFindLocal?.msgFindByDirection) {
          const BATCH_SIZE = 20;

          // Construct the initial anchor the same way wa-js does:
          // serialize to string then reconstruct via MsgKey.fromString so the
          // object has the exact shape msgFindByDirection expects.
          // @ts-ignore
          const lastReceivedSerialized = window.WWebJS.GetSerialized(
            chat.lastReceivedKey,
          );
          if (!lastReceivedSerialized) return [];
          let currentAnchorKey = window
            .require('WAWebMsgKey')
            .fromString(lastReceivedSerialized);

          // msgFindByDirection is exclusive of the anchor; include the anchor
          // message itself (the most recent message in the chat) upfront
          const anchorMsg = window
            .require('WAWebCollections')
            .Msg.get(lastReceivedSerialized);
          if (anchorMsg) {
            msgs.push(anchorMsg);
          }

          const neededFiltered = Number.isFinite(
            pagination.limit + pagination.offset,
          )
            ? pagination.limit + pagination.offset
            : Infinity;

          // @ts-ignore
          const toModel = (m) => {
            if (m && typeof m.serialize === 'function') return m;
            // @ts-ignore
            const serializedId = window.WWebJS.GetSerialized(m?.id);
            const Msg = window.require('WAWebCollections').Msg;
            if (serializedId) {
              const stored = Msg.get(serializedId);
              if (stored) return stored;
            }
            return new Msg.modelClass(m);
          };

          while (true) {
            const result = await WAWebDBMessageFindLocal.msgFindByDirection({
              anchor: currentAnchorKey,
              count: BATCH_SIZE,
              direction: 'before',
            });

            const batch = Array.isArray(result)
              ? result
              : result?.messages || [];
            if (!batch || batch.length === 0) break;

            const batchModels = batch.map(toModel);

            // msgFindByDirection returns newest-first (descending) so prepend
            // to keep the accumulated list in approximate ascending order
            msgs = [...batchModels, ...msgs];

            // Deduplicate by serialized id — the same Backbone model object can
            // appear in multiple batches when anchors overlap
            const seenIds = new Set();
            msgs = msgs.filter((m) => {
              // @ts-ignore
              const sid = window.WWebJS.GetSerialized(m?.id);
              if (!sid || seenIds.has(sid)) return false;
              seenIds.add(sid);
              return true;
            });

            // Stop once we have enough messages that pass the filter
            if (msgs.filter(msgFilter).length >= neededFiltered) break;

            // Stop if the oldest message in this batch is already before the
            // lower timestamp bound - no earlier messages can be in range
            if (filter['filter.timestamp.gte'] != null) {
              const batchMinT = batchModels.reduce(
                (min, m) => Math.min(min, m.t ?? Infinity),
                Infinity,
              );
              if (batchMinT < filter['filter.timestamp.gte']) break;
            }

            // No more messages available
            if (batch.length < BATCH_SIZE) break;

            // msgFindByDirection returns newest-first, so the LAST element is
            // the oldest message in this batch — use it as the next anchor to
            // walk further back in history without overlap
            const oldestInBatch = batchModels[batchModels.length - 1];
            // @ts-ignore
            const oldestSerialized = window.WWebJS.GetSerialized(
              oldestInBatch?.id,
            );
            if (!oldestSerialized) break;
            currentAnchorKey = window
              .require('WAWebMsgKey')
              .fromString(oldestSerialized);
          }
        } else {
          // Legacy fallback: loadEarlierMsgs loop
          msgs = chat.msgs.getModelsArray();
          while (msgs.length < pagination.limit + pagination.offset) {
            const loadedMessages = await window
              .require('WAWebChatLoadMessages')
              .loadEarlierMsgs(chat, chat.msgs);
            if (!loadedMessages || loadedMessages.length == 0) break;

            msgs = [...loadedMessages, ...msgs];
            msgs = msgs.sort((a, b) => b.t - a.t);

            const earliest = msgs[msgs.length - 1];
            if (earliest.t < (filter['filter.timestamp.gte'] || Infinity)) {
              break;
            }
          }
        }

        msgs = msgs.filter(msgFilter);

        // Always sort newest first before applying the pagination window.
        msgs = msgs.sort((a, b) => b.t - a.t);

        const offset = Math.max(0, pagination.offset);
        const limit = pagination.limit;

        if (Number.isFinite(limit)) {
          const end = Math.min(offset + limit, msgs.length);
          msgs = msgs.slice(offset, end);
        } else if (offset > 0) {
          // When the limit is unbounded we still need to respect the offset.
          msgs = msgs.slice(offset);
        }

        // @ts-ignore
        return msgs.map((m) => window.WWebJS.getMessageModel(m));
      },
      chatId,
      filter,
      pagination,
    );

    return messages.map((m) => new Message(this, m));
  }

  public async getAllLids(
    pagination: PaginationParams,
  ): Promise<Array<LidToPhoneNumber>> {
    const lids: Array<LidToPhoneNumber> = (await this.pupPage.evaluate(
      async (pagination) => {
        pagination.limit ||= Infinity;
        pagination.offset ||= 0;
        pagination.sortBy ||= 'lid';

        const WAWebApiContact = window.require('WAWebApiContact');

        await WAWebApiContact.warmUpAllLidPnMappings();
        const lidMap = WAWebApiContact.lidPnCache['$1'];
        const values = Array.from(lidMap.values());
        const result = values.map((map) => {
          return {
            // @ts-ignore
            lid: window.WWebJS.GetSerialized(map.lid),
            // @ts-ignore
            pn: window.WWebJS.GetSerialized(map.phoneNumber),
          };
        });
        // @ts-ignore
        const paginator = new window.Paginator(pagination);
        const page = paginator.apply(result);
        return page;
      },
      pagination,
    )) as any;
    return lids;
  }

  public async getLidsCount(): Promise<number> {
    const count: number = (await this.pupPage.evaluate(async () => {
      const WAWebApiContact = window.require('WAWebApiContact');

      await WAWebApiContact.warmUpAllLidPnMappings();
      const lidMap = WAWebApiContact.lidPnCache['$1'];
      return lidMap.size;
    })) as any;
    return count;
  }

  public async findPNByLid(lid: string): Promise<string> {
    const pn = await this.pupPage.evaluate(async (lid) => {
      const WAWebApiContact = window.require('WAWebApiContact');
      const WAWebWidFactory = window.require('WAWebWidFactory');

      const wid = WAWebWidFactory.createWid(lid);
      const result = WAWebApiContact.getPhoneNumber(wid);
      // @ts-ignore
      return window.WWebJS.GetSerialized(result);
    }, lid);
    return pn;
  }

  public async findLIDByPhoneNumber(phoneNumber: string): Promise<string> {
    const lid: string = (await this.pupPage.evaluate(async (pn) => {
      const WAWebApiContact = window.require('WAWebApiContact');
      const WAWebWidFactory = window.require('WAWebWidFactory');

      const wid = WAWebWidFactory.createWid(pn);
      const result = WAWebApiContact.getCurrentLid(wid);
      // @ts-ignore
      return window.WWebJS.GetSerialized(result);
    }, phoneNumber)) as any;
    return lid;
  }

  /**
   * Presences methods
   */
  public async subscribePresence(chatId: string): Promise<void> {
    await this.pupPage.evaluate(async (chatId) => {
      const d = require;
      const WidFactory = d('WAWebWidFactory');

      const wid = WidFactory.createWidFromWidLike(chatId);
      const chat = d('WAWebChatCollection').ChatCollection.get(wid);
      const tc = chat == null ? void 0 : chat.getTcToken();
      await d('WAWebContactPresenceBridge').subscribePresence(wid, tc);
    }, chatId);
  }

  private async getCurrentPresence(chatId: string): Promise<WebJSPresence[]> {
    const result = await this.pupPage.evaluate(async (chatId) => {
      const d = require;
      const WidFactory = d('WAWebWidFactory');
      const PresenceCollection = d(
        'WAWebPresenceCollection',
      ).PresenceCollection;
      const wid = WidFactory.createWidFromWidLike(chatId);
      const presence = PresenceCollection.get(wid);
      if (!presence) {
        return [];
      }
      let chatstates = [];
      if (chatId.endsWith('@c.us')) {
        chatstates = [presence.chatstate];
      } else {
        chatstates = presence.chatstates.getModelsArray();
      }
      return chatstates.map((chatstate) => {
        return {
          // @ts-ignore
          participant: window.WWebJS.GetSerialized(chatstate.id),
          lastSeen: chatstate.t,
          state: chatstate.type,
        };
      });
    }, chatId);
    return result;
  }

  public async getPresence(chatId: string): Promise<WebJSPresence[]> {
    await this.sendPresenceAvailable();
    await this.subscribePresence(chatId);
    await sleep(3_000);
    return await this.getCurrentPresence(chatId);
  }

  /**
   * Channels methods
   */
  async channelFetchMessageByInvite(
    inviteCode: string,
    limit: number,
  ): Promise<WebjsChannelMessage[]> {
    const response: _GetNewsletterPreviewDataResponse =
      await this.pupPage.evaluate(
        async (code, limit) => {
          // Overwrite the server-side message count so the preview fetches
          // exactly `limit` messages
          window.require(
            'WAWebNewsletterGatingUtils',
          ).getMaxMsgCountFromServer = () => limit;

          const result = await window
            .require('WAWebNewsletterPreviewJob')
            .getNewsletterPreviewData(code, 'guest');
          for (const newsletterReaction of result.newsletterReactions) {
            // puppeter doesn't support Map,
            // so we need to convert it to object
            newsletterReaction.emojiCountMap = Object.fromEntries(
              newsletterReaction.emojiCountMap,
            );
          }

          // Fetch one more time to save in database so we can fetch media later
          await window
            .require('WAWebLoadNewsletterPreviewChatAction')
            .loadNewsletterPreviewChat(code);
          return result;
        },
        inviteCode,
        limit,
      );
    const messageInstances = response.newsletterMessages
      .filter((msg) => msg.type != 'revoked')
      .map((msg) => {
        return new MessageInstance(this, msg);
      });
    const reactions = extractReactionsByMessageKey(
      response.newsletterReactions,
    );

    const messages: WebjsChannelMessage[] = messageInstances.map((msg) => {
      return {
        message: msg,
        reactions: reactions.get(GetSerialized(msg.id)) || [],
        viewCount: msg.rawData.viewCount,
      };
    });
    return messages;
  }

  /**
   * Channels Search methods
   */
  async searchChannelsView(params: any): Promise<any> {
    const newsletters: any = await this.pupPage.evaluate(async (params) => {
      return await window
        .require('WAWebNewsletterDirectorySearchJob')
        .getNewsletterDirectoryList(params);
    }, params);
    return newsletters;
  }

  async searchChannelsText(params: any): Promise<any> {
    const newsletters: any = await this.pupPage.evaluate(async (params) => {
      return await window
        .require('WAWebNewsletterDirectorySearchJob')
        .getNewsletterDirectorySearchResults(params);
    }, params);
    return newsletters;
  }
}
