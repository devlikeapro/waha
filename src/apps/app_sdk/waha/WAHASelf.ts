import { Channel } from '@waha/structures/channels.dto';
import {
  GetChatMessagesFilter,
  GetChatMessagesQuery,
} from '@waha/structures/chats.dto';
import {
  ChatRequest,
  MessageFileRequest,
  MessageImageRequest,
  MessageTextRequest,
  MessageVideoRequest,
  MessageVoiceRequest,
  WANumberExistResult,
} from '@waha/structures/chatting.dto';
import { SessionInfo } from '@waha/structures/sessions.dto';
import axios, { AxiosInstance } from 'axios';
import { Auth } from '@waha/core/auth/config';
import { ContactSortField } from '@waha/structures/contacts.dto';
import { PaginationParams } from '@waha/structures/pagination.dto';

export interface RequestOptions {
  signal?: AbortSignal;
}

export class WAHASelf {
  public client: AxiosInstance;

  constructor() {
    // Set 'X-Api-Key'
    const key = Auth.keyplain.value;
    const port =
      parseInt(process.env.PORT) ||
      parseInt(process.env.WHATSAPP_API_PORT) ||
      3000;
    const url = `http://localhost:${port}`;
    this.client = axios.create({
      baseURL: url,
      headers: {
        'X-Api-Key': key,
        'Content-Type': 'application/json',
      },
    });
  }

  async fetch(url: string, opts?: RequestOptions): Promise<Buffer> {
    const response = await this.client.get(url, {
      responseType: 'arraybuffer',
      signal: opts?.signal,
    });
    return Buffer.from(response.data);
  }

  async qr(session: string, opts?: RequestOptions): Promise<Buffer> {
    const url = `/api/${session}/auth/qr`;
    return await this.fetch(url, opts);
  }

  async screenshot(session: string, opts?: RequestOptions): Promise<Buffer> {
    const url = `/api/screenshot?session=${session}`;
    return await this.fetch(url, opts);
  }

  async restart(session: string, opts?: RequestOptions): Promise<any> {
    const url = `/api/sessions/${session}/restart`;
    return await this.client.post(url, undefined, { signal: opts?.signal });
  }

  async logout(session: string, opts?: RequestOptions): Promise<any> {
    const url = `/api/sessions/${session}/logout`;
    return await this.client.post(url, undefined, { signal: opts?.signal });
  }

  async stop(session: string, opts?: RequestOptions): Promise<any> {
    const url = `/api/sessions/${session}/stop`;
    return await this.client.post(url, undefined, { signal: opts?.signal });
  }

  async get(session: string, opts?: RequestOptions): Promise<SessionInfo> {
    const url = `/api/sessions/${session}/`;
    return await this.client
      .get(url, { signal: opts?.signal })
      .then((response) => response.data);
  }

  async getChats(
    session: string,
    page: PaginationParams,
    opts?: RequestOptions,
  ) {
    const url = `/api/${session}/chats`;
    const params = {
      ...page,
    };
    return await this.client
      .get(url, { params: params, signal: opts?.signal })
      .then((response) => response.data);
  }

  async getContacts(
    session: string,
    page: PaginationParams,
    opts?: RequestOptions,
  ) {
    const url = `/api/contacts/all`;
    const params = {
      session: session,
      ...page,
      sortBy: ContactSortField.ID,
      sortOrder: ContactSortField.ID,
    };
    return await this.client
      .get(url, { params: params, signal: opts?.signal })
      .then((response) => response.data);
  }

  async getContact(session: string, contactId: string, opts?: RequestOptions) {
    const url = `/api/contacts`;
    const params = {
      session: session,
      contactId: contactId,
    };
    return await this.client
      .get(url, { params: params, signal: opts?.signal })
      .then((response) => response.data);
  }

  async contactCheckExists(
    session: string,
    phone: string,
    opts?: RequestOptions,
  ): Promise<WANumberExistResult> {
    const url = `/api/contacts/check-exists`;
    const params = {
      phone: phone,
      session: session,
    };
    return await this.client
      .get(url, { params: params, signal: opts?.signal })
      .then((response) => response.data);
  }

  async getGroup(session: string, groupId: string, opts?: RequestOptions) {
    const url = `/api/${session}/groups/${groupId}`;
    return await this.client
      .get(url, { signal: opts?.signal })
      .then((response) => response.data);
  }

  async getGroupParticipants(
    session: string,
    groupId: string,
    opts?: RequestOptions,
  ) {
    const url = `/api/${session}/groups/${groupId}/participants/v2`;
    return await this.client
      .get(url, { signal: opts?.signal })
      .then((response) => response.data);
  }

  async getChannel(
    session: string,
    channelId: string,
    opts?: RequestOptions,
  ): Promise<Channel> {
    const url = `/api/${session}/channels/${channelId}`;
    return await this.client
      .get(url, { signal: opts?.signal })
      .then((response) => response.data);
  }

  async getChatPicture(
    session: string,
    chatId: string,
    opts?: RequestOptions,
  ): Promise<string | null> {
    const url = `/api/${session}/chats/${chatId}/picture`;
    return await this.client
      .get(url, { signal: opts?.signal })
      .then((response) => response.data?.url);
  }

  async sendText(
    body: MessageTextRequest,
    opts?: RequestOptions,
  ): Promise<any> {
    const url = `/api/sendText`;
    return await this.client
      .post(url, body, { signal: opts?.signal })
      .then((response) => response.data);
  }

  async sendImage(
    body: MessageImageRequest,
    opts?: RequestOptions,
  ): Promise<any> {
    const url = `/api/sendImage`;
    return await this.client
      .post(url, body, { signal: opts?.signal })
      .then((response) => response.data);
  }

  async sendVideo(
    body: MessageVideoRequest,
    opts?: RequestOptions,
  ): Promise<any> {
    const url = `/api/sendVideo`;
    return await this.client
      .post(url, body, { signal: opts?.signal })
      .then((response) => response.data);
  }

  async sendVoice(
    body: MessageVoiceRequest,
    opts?: RequestOptions,
  ): Promise<any> {
    const url = `/api/sendVoice`;
    return await this.client
      .post(url, body, { signal: opts?.signal })
      .then((response) => response.data);
  }

  async sendFile(
    body: MessageFileRequest,
    opts?: RequestOptions,
  ): Promise<any> {
    const url = `/api/sendFile`;
    return await this.client
      .post(url, body, { signal: opts?.signal })
      .then((response) => response.data);
  }

  async deleteMessage(
    session: string,
    chatId: string,
    messageId: string,
    opts?: RequestOptions,
  ) {
    const url = `/api/${session}/chats/${chatId}/messages/${messageId}`;
    return await this.client
      .delete(url, { signal: opts?.signal })
      .then((response) => response.data);
  }

  async startTyping(body: ChatRequest, opts?: RequestOptions) {
    const url = `/api/startTyping`;
    return await this.client
      .post(url, body, { signal: opts?.signal })
      .then((response) => response.data);
  }

  async stopTyping(body: ChatRequest, opts?: RequestOptions) {
    const url = `/api/stopTyping`;
    return await this.client.post(url, body, { signal: opts?.signal });
  }

  async readMessages(session: string, chatId: string, opts?: RequestOptions) {
    const url = `/api/${session}/chats/${chatId}/messages/read`;
    return await this.client
      .post(url, undefined, { signal: opts?.signal })
      .then((response) => response.data);
  }

  async getMessages(
    session: string,
    chatId: string,
    query: GetChatMessagesQuery,
    filter: GetChatMessagesFilter,
    opts?: RequestOptions,
  ) {
    const url = `/api/${session}/chats/${chatId}/messages`;
    const params = {
      ...query,
      ...filter,
    };
    return await this.client
      .get(url, { params: params, signal: opts?.signal })
      .then((response) => response.data);
  }

  async getMessageById(
    session: string,
    chatId: string,
    messageId: string,
    media: boolean,
    opts?: RequestOptions,
  ) {
    const url = `/api/${session}/chats/${chatId}/messages/${messageId}`;
    const params = {
      downloadMedia: media,
    };
    return await this.client
      .get(url, { params: params, signal: opts?.signal })
      .then((response) => response.data);
  }

  async findPNByLid(
    session: string,
    lid: string,
    opts?: RequestOptions,
  ): Promise<string | null> {
    const url = `/api/${session}/lids/${lid}`;
    return await this.client
      .get(url, { signal: opts?.signal })
      .then((response) => response.data.pn);
  }

  async findLIDByPN(
    session: string,
    pn: string,
    opts?: RequestOptions,
  ): Promise<string | null> {
    const url = `/api/${session}/lids/pn/${pn}`;
    return await this.client
      .get(url, { signal: opts?.signal })
      .then((response) => response.data.lid);
  }

  /**
   * Get the server version
   * @returns Server version information
   */
  async serverVersion(opts?: RequestOptions): Promise<any> {
    const url = `/api/server/version`;
    return await this.client
      .get(url, { signal: opts?.signal })
      .then((response) => response.data);
  }

  /**
   * Get the server status
   * @returns Server status information
   */
  async serverStatus(opts?: RequestOptions): Promise<any> {
    const url = `/api/server/status`;
    return await this.client
      .get(url, { signal: opts?.signal })
      .then((response) => response.data);
  }

  /**
   * Reboot the server
   * @param force Whether to force reboot (true) or gracefully reboot (false)
   * @returns Server stop response
   */
  async serverReboot(
    force: boolean = false,
    opts?: RequestOptions,
  ): Promise<any> {
    const url = `/api/server/stop`;
    return await this.client
      .post(url, { force }, { signal: opts?.signal })
      .then((response) => response.data);
  }
}

export class WAHASessionAPI {
  constructor(
    private session: string,
    private api: WAHASelf,
  ) {}

  getChats(page: PaginationParams, opts?: RequestOptions) {
    return this.api.getChats(this.session, page, opts);
  }

  getContacts(page: PaginationParams, opts?: RequestOptions): Promise<any> {
    return this.api.getContacts(this.session, page, opts);
  }

  getContact(contactId: string, opts?: RequestOptions): Promise<any> {
    return this.api.getContact(this.session, contactId, opts);
  }

  contactCheckExists(
    phone: string,
    opts?: RequestOptions,
  ): Promise<WANumberExistResult> {
    return this.api.contactCheckExists(this.session, phone, opts);
  }

  getGroup(groupId: string, opts?: RequestOptions): Promise<any> {
    return this.api.getGroup(this.session, groupId, opts);
  }

  getGroupParticipants(groupId: string, opts?: RequestOptions): Promise<any> {
    return this.api.getGroupParticipants(this.session, groupId, opts);
  }

  getChannel(channelId: string, opts?: RequestOptions): Promise<Channel> {
    return this.api.getChannel(this.session, channelId, opts);
  }

  getChatPicture(
    chatId: string,
    opts?: RequestOptions,
  ): Promise<string | null> {
    return this.api.getChatPicture(this.session, chatId, opts);
  }

  sendText(body: MessageTextRequest, opts?: RequestOptions): Promise<any> {
    body.session = this.session;
    return this.api.sendText(body, opts);
  }

  sendImage(body: MessageImageRequest, opts?: RequestOptions): Promise<any> {
    body.session = this.session;
    return this.api.sendImage(body, opts);
  }

  sendVideo(body: MessageVideoRequest, opts?: RequestOptions): Promise<any> {
    body.session = this.session;
    return this.api.sendVideo(body, opts);
  }

  sendVoice(body: MessageVoiceRequest, opts?: RequestOptions): Promise<any> {
    body.session = this.session;
    return this.api.sendVoice(body, opts);
  }

  sendFile(body: MessageFileRequest, opts?: RequestOptions): Promise<any> {
    body.session = this.session;
    return this.api.sendFile(body, opts);
  }

  deleteMessage(chatId: string, messageId: string, opts?: RequestOptions) {
    return this.api.deleteMessage(this.session, chatId, messageId, opts);
  }

  startTyping(body: ChatRequest, opts?: RequestOptions) {
    body.session = this.session;
    return this.api.startTyping(body, opts);
  }

  stopTyping(body: ChatRequest, opts?: RequestOptions) {
    body.session = this.session;
    return this.api.stopTyping(body, opts);
  }

  readMessages(chatId: string, opts?: RequestOptions) {
    return this.api.readMessages(this.session, chatId, opts);
  }

  async getMessages(
    chatId: string,
    query: GetChatMessagesQuery,
    filter: GetChatMessagesFilter,
    opts?: RequestOptions,
  ) {
    return this.api.getMessages(this.session, chatId, query, filter, opts);
  }

  async getMessageById(
    chatId: string,
    messageId: string,
    media: boolean,
    opts?: RequestOptions,
  ) {
    return this.api.getMessageById(
      this.session,
      chatId,
      messageId,
      media,
      opts,
    );
  }

  //
  // Lids
  //
  findPNByLid(lid: string, opts?: RequestOptions) {
    return this.api.findPNByLid(this.session, lid, opts);
  }

  findLIDByPN(pn: string, opts?: RequestOptions) {
    return this.api.findLIDByPN(this.session, pn, opts);
  }

  getSessionInfo(opts?: RequestOptions) {
    return this.api.get(this.session, opts);
  }
}
