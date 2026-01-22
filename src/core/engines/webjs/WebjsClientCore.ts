import { exposeFunctionIfAbsent } from '@waha/core/engines/webjs/Puppeteer';
import { WebJSPresence } from '@waha/core/engines/webjs/types';
import { GetChatMessagesFilter } from '@waha/structures/chats.dto';
import { Label } from '@waha/structures/labels.dto';
import { LidToPhoneNumber } from '@waha/structures/lids.dto';
import { PaginationParams } from '@waha/structures/pagination.dto';
import { TextStatus } from '@waha/structures/status.dto';
import { sleep } from '@waha/utils/promiseTimeout';
import { EventEmitter } from 'events';
import * as lodash from 'lodash';
import { Page } from 'puppeteer';
import { Client, Events } from 'whatsapp-web.js';
import { Message } from 'whatsapp-web.js/src/structures';

import { CallErrorEvent, PAGE_CALL_ERROR_EVENT, WPage } from './WPage';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { LoadWAHA } = require('./_WAHA.js');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { LoadLodash } = require('./_lodash.js');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { LoadPaginator } = require('./_Paginator.js');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ChatFactory = require('whatsapp-web.js/src/factories/ChatFactory');

export class WebjsClientCore extends Client {
  public events = new EventEmitter();
  private wpage: WPage = null;

  constructor(
    options,
    protected tags: boolean,
  ) {
    super(options);
    // Wait until it's READY and inject more utils
    this.on(Events.AUTHENTICATED, async () => {
      await this.attachCustomEventListeners();
      await this.injectWaha();
    });
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
    await this.pupPage.evaluate(LoadWAHA);
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
      // @ts-ignore
      window.decodeStanzaBack = window.Store.SocketWap.decodeStanza;
      // @ts-ignore
      window.Store.SocketWap.decodeStanza = async (...args) => {
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
    await this.pupPage.evaluate(async (pushName) => {
      return await window['WAHA'].WAWebSetPushnameConnAction.setPushname(
        pushName,
      );
    }, name);
    if (this.info) {
      this.info.pushname = name;
    }
  }

  async unpair() {
    await this.pupPage.evaluate(async () => {
      if (
        // @ts-ignore
        window.Store &&
        // @ts-ignore
        window.Store.AppState &&
        // @ts-ignore
        typeof window.Store.AppState.logout === 'function'
      ) {
        // @ts-ignore
        await window.Store.AppState.logout();
      }
    });
  }

  async createLabel(name: string, color: number): Promise<number> {
    const labelId: number = (await this.pupPage.evaluate(
      async (name, color) => {
        // @ts-ignore
        return await window.WAHA.WAWebBizLabelEditingAction.labelAddAction(
          name,
          color,
        );
      },
      name,
      color,
    )) as any;
    return labelId;
  }

  async deleteLabel(label: Label) {
    return await this.pupPage.evaluate(async (label) => {
      // @ts-ignore
      return await window.WAHA.WAWebBizLabelEditingAction.labelDeleteAction(
        label.id,
        label.name,
        label.color,
      );
    }, label);
  }

  async updateLabel(label: Label) {
    return await this.pupPage.evaluate(async (label) => {
      // @ts-ignore
      return await window.WAHA.WAWebBizLabelEditingAction.labelEditAction(
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

    // Get paginated chats
    pagination.limit ||= Infinity;
    pagination.offset ||= 0;

    const chats = await this.pupPage.evaluate(
      async (pagination, filter) => {
        // @ts-ignore
        return await window.WAHA.getChats(pagination, filter);
      },
      pagination,
      filter,
    );

    return chats.map((chat) => ChatFactory.create(this, chat));
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
      // @ts-ignore
      await window.Store.SendStatus.sendStatusTextMsgAction(status);
      // @ts-ignore
      const meUser = window.Store.User.getMaybeMePnUser();
      // @ts-ignore
      const myStatus = window.Store.Status.getModelsArray().findLast(
        (x) => x.id == meUser,
      );
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
        let msgs = chat.msgs.getModelsArray().filter(msgFilter);

        while (msgs.length < pagination.limit + pagination.offset) {
          const loadedMessages =
            // @ts-ignore
            await window.Store.ConversationMsgs.loadEarlierMsgs(chat);
          if (!loadedMessages || loadedMessages.length == 0) break;

          msgs = [...loadedMessages.filter(msgFilter), ...msgs];
          msgs = msgs.sort((a, b) => b.t - a.t);

          // Check if the earliest message is already outside the timerange filter
          const earliest = msgs[msgs.length - 1];
          if (earliest.t < (filter['filter.timestamp.gte'] || Infinity)) {
            // Add only messages that pass the filter and stop loading more
            break;
          }
        }

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

        // @ts-ignore
        const WAWebApiContact = window.Store.LidUtils;

        await WAWebApiContact.warmUpAllLidPnMappings();
        const lidMap = WAWebApiContact.lidPnCache['$1'];
        const values = Array.from(lidMap.values());
        const result = values.map((map) => {
          return {
            // @ts-ignore
            lid: map.lid._serialized,
            // @ts-ignore
            pn: map.phoneNumber._serialized,
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
      // @ts-ignore
      const WAWebApiContact = window.Store.LidUtils;

      await WAWebApiContact.warmUpAllLidPnMappings();
      const lidMap = WAWebApiContact.lidPnCache['$1'];
      return lidMap.size;
    })) as any;
    return count;
  }

  public async findPNByLid(lid: string): Promise<string> {
    const pn = await this.pupPage.evaluate(async (lid) => {
      // @ts-ignore
      const WAWebApiContact = window.Store.LidUtils;
      // @ts-ignore
      const WAWebWidFactory = window.Store.WidFactory;

      const wid = WAWebWidFactory.createWid(lid);
      const result = WAWebApiContact.getPhoneNumber(wid);
      return result ? result._serialized : null;
    }, lid);
    return pn;
  }

  public async findLIDByPhoneNumber(phoneNumber: string): Promise<string> {
    const lid: string = (await this.pupPage.evaluate(async (pn) => {
      // @ts-ignore
      const WAWebApiContact = window.Store.LidUtils;
      // @ts-ignore
      const WAWebWidFactory = window.Store.WidFactory;

      const wid = WAWebWidFactory.createWid(pn);
      const result = WAWebApiContact.getCurrentLid(wid);
      return result ? result._serialized : null;
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
          participant: chatstate.id._serialized,
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
}
