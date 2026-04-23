import type { proto } from '@adiwajshing/baileys';
import { WAMessage } from '@waha/structures/responses.dto';
import { SimpleVCardInfo } from '@waha/core/vcard';
import { CallData } from '@waha/structures/calls.dto';

export enum TKey {
  LOCALE_NAME = 'locale.name',

  //
  // Jobs
  //
  JOB_REPORT_ERROR = 'job.report.error',
  JOB_REPORT_SUCCEEDED = 'job.report.succeeded',
  JOB_SCHEDULED_ERROR_HEADER = 'job.scheduled.error.header',

  //
  // WhatsApp Message Status
  //
  WHATSAPP_MESSAGE_SENDING_ERROR = 'whatsapp.message.sending.error',
  WHATSAPP_MESSAGE_RECEIVING_ERROR = 'whatsapp.message.receiving.error',
  WHATSAPP_MESSAGE_REMOVING_ERROR = 'whatsapp.message.removing.error',

  //
  // WhatsApp Messages
  //
  MESSAGE_FROM_WHATSAPP = 'message.from.whatsapp',
  MESSAGE_FROM_API = 'message.from.api',
  MESSAGE_REMOVED_IN_WHATSAPP = 'message.removed.in.whatsapp',
  MESSAGE_EDITED_IN_WHATSAPP = 'message.edited.in.whatsapp',
  WHATSAPP_GROUP_MESSAGE = 'whatsapp.group.message',
  WHATSAPP_REACTION_ADDED = 'whatsapp.reaction.added',
  WHATSAPP_REACTION_REMOVED = 'whatsapp.reaction.removed',

  //
  // Contact Suffixes
  //
  WHATSAPP_CONTACT_GROUP_SUFFIX = 'whatsapp.contact.group.suffix',
  WHATSAPP_CONTACT_CHANNEL_SUFFIX = 'whatsapp.contact.channel.suffix',
  WHATSAPP_CONTACT_BROADCAST_SUFFIX = 'whatsapp.contact.broadcast.suffix',
  WHATSAPP_CONTACT_STATUS_NAME = 'whatsapp.contact.status.name',

  //
  // ChatWoot to WhatsApp
  //
  CW_TO_WA_MESSAGE_TEXT = 'chatwoot.to.whatsapp.message.text',
  CW_TO_WA_MESSAGE_MEDIA_CAPTION = 'chatwoot.to.whatsapp.message.media.caption',

  //
  // WhatsApp to ChatWoot
  //
  WA_TO_CW_MESSAGE = 'whatsapp.to.chatwoot.message',
  WA_TO_CW_MESSAGE_CONTACTS = 'whatsapp.to.chatwoot.message.contacts',
  WA_TO_CW_MESSAGE_LOCATION = 'whatsapp.to.chatwoot.message.location',
  WA_TO_CW_MESSAGE_POLL = 'whatsapp.to.chatwoot.message.poll',
  WA_TO_CW_MESSAGE_EVENT = 'whatsapp.to.chatwoot.message.event',
  WA_TO_CW_MESSAGE_PIX = 'whatsapp.to.chatwoot.message.pix',
  WA_TO_CW_MESSAGE_STATUS_REPLY = 'whatsapp.to.chatwoot.message.status.reply',
  WA_TO_CW_MESSAGE_UNSUPPORTED = 'whatsapp.to.chatwoot.message.unsupported',
  WA_TO_CW_MESSAGE_FACEBOOK_AD = 'whatsapp.to.chatwoot.message.facebook.ad',
  WA_TO_CW_MESSAGE_LIST = 'whatsapp.to.chatwoot.message.list',
  WA_TO_CW_MESSAGE_ALBUM = 'whatsapp.to.chatwoot.message.album',
  WA_TO_CW_CALL_RECEIVED = 'whatsapp.to.chatwoot.call.received',
  WA_TO_CW_CALL_ACCEPTED = 'whatsapp.to.chatwoot.call.accepted',
  WA_TO_CW_CALL_REJECTED = 'whatsapp.to.chatwoot.call.rejected',

  //
  // App Inbox
  //
  APP_INBOX_CONTACT_NAME = 'app.inbox.contact.name',
  APP_INBOX_CONTACT_AVATAR_URL = 'app.inbox.contact.avatar.url',

  //
  // App Status
  //
  APP_CONNECTED_MESSAGE = 'app.connected.message',
  APP_DISCONNECTED_MESSAGE = 'app.disconnected.message',
  APP_UPDATED_MESSAGE = 'app.updated.message',

  //
  // App Session Status
  //
  APP_SESSION_STATUS_CHANGE = 'app.session.status.change',
  APP_SESSION_CURRENT_STATUS = 'app.session.current.status',
  APP_SESSION_STATUS_WORKING = 'app.session.status.working',
  APP_SESSION_STATUS_ERROR = 'app.session.status.error',
  APP_SESSION_SCAN_QR_CODE = 'app.session.scan.qr.code',

  //
  // App Commands
  //
  APP_HELP_REMINDER = 'app.help.reminder',
  APP_SERVER_VERSION_AND_STATUS = 'app.server.version.and.status',
  APP_SERVER_REBOOT = 'app.server.reboot',
  APP_SERVER_REBOOT_FORCE = 'app.server.reboot.force',
  APP_LOGOUT_SUCCESS = 'app.logout.success',

  // CLI
  ['cli.cmd.disabled'] = 'cli.cmd.disabled',

  //
  // App Inbox
  //
  WAHA_NEW_VERSION_AVAILABLE = 'waha.new.version.available',
  WAHA_CORE_VERSION_USED = 'waha.core.version.used',
}

// Define payload types
interface Link {
  text: string;
  url: string;
}

export interface FacebookAdTemplateData {
  title: string;
  body: string;
  thumbnailUrl: string;
  originalImageUrl: string;
  sourceUrl: string;
  sourceId: string;
}

export interface PollOption {
  optionName?: string;
}

export interface PollCreationMessage {
  name?: string;
  options?: Array<PollOption>;
}

export interface PixTemplatePayload {
  merchantName?: string;
  key?: string;
  keyType?: string;
  currency?: string;
  totalAmount?: number;
  totalAmountFormatted?: string;
  referenceId?: string;
}

export type TemplatePayloads = {
  [TKey.LOCALE_NAME]: void;
  [TKey.APP_INBOX_CONTACT_NAME]: void;
  [TKey.APP_INBOX_CONTACT_AVATAR_URL]: void;
  [TKey.MESSAGE_FROM_WHATSAPP]: { text: string };
  [TKey.MESSAGE_FROM_API]: { text: string };
  [TKey.MESSAGE_REMOVED_IN_WHATSAPP]: void;
  [TKey.MESSAGE_EDITED_IN_WHATSAPP]: { text: string };
  [TKey.WHATSAPP_GROUP_MESSAGE]: { text: string; participant: string };
  [TKey.WHATSAPP_REACTION_ADDED]: { emoji: string };
  [TKey.WHATSAPP_REACTION_REMOVED]: void;
  [TKey.WHATSAPP_MESSAGE_SENDING_ERROR]: void;
  [TKey.WHATSAPP_MESSAGE_RECEIVING_ERROR]: void;
  [TKey.WHATSAPP_MESSAGE_REMOVING_ERROR]: void;
  [TKey.WHATSAPP_CONTACT_GROUP_SUFFIX]: void;
  [TKey.WHATSAPP_CONTACT_CHANNEL_SUFFIX]: void;
  [TKey.WHATSAPP_CONTACT_BROADCAST_SUFFIX]: void;
  [TKey.WHATSAPP_CONTACT_STATUS_NAME]: void;
  [TKey.CW_TO_WA_MESSAGE_TEXT]: {
    content: string;
    chatwoot: any;
  };
  [TKey.CW_TO_WA_MESSAGE_MEDIA_CAPTION]: {
    content: string;
    chatwoot: any;
    singleAttachment: boolean;
  };
  [TKey.WA_TO_CW_MESSAGE]: {
    payload: WAMessage;
  };
  [TKey.WA_TO_CW_MESSAGE_CONTACTS]: { contacts: SimpleVCardInfo[] };
  [TKey.WA_TO_CW_MESSAGE_LOCATION]: { payload: any; message: proto.Message };
  [TKey.WA_TO_CW_MESSAGE_POLL]: {
    payload: WAMessage;
    poll: PollCreationMessage;
    message: proto.Message;
  };
  [TKey.WA_TO_CW_MESSAGE_EVENT]: {
    payload: WAMessage;
    message: {
      eventMessage: Record<string, unknown>;
    };
  };
  [TKey.WA_TO_CW_MESSAGE_LIST]: {
    payload: WAMessage;
    message: proto.Message;
  };
  [TKey.WA_TO_CW_MESSAGE_PIX]: {
    payload: WAMessage;
    message: proto.Message | null;
    pixData: PixTemplatePayload;
  };
  [TKey.WA_TO_CW_MESSAGE_STATUS_REPLY]: {
    type: string;
    quotedText?: string;
    content: string;
  };
  [TKey.WA_TO_CW_MESSAGE_UNSUPPORTED]: { details: Link };
  [TKey.WA_TO_CW_MESSAGE_FACEBOOK_AD]: {
    payload: WAMessage;
    adData: FacebookAdTemplateData;
  };
  [TKey.WA_TO_CW_MESSAGE_ALBUM]: {
    expectedImageCount: number;
    expectedVideoCount: number;
    totalCount: number;
  };
  [TKey.WA_TO_CW_CALL_RECEIVED]: { call: CallData };
  [TKey.WA_TO_CW_CALL_ACCEPTED]: { call: CallData };
  [TKey.WA_TO_CW_CALL_REJECTED]: { call: CallData };
  [TKey.JOB_SCHEDULED_ERROR_HEADER]: void;
  [TKey.JOB_REPORT_ERROR]: {
    header: string;
    error: string;
    details: Link;
    attempts: {
      current: number;
      max: number;
      nextDelay?: number;
    };
  };
  [TKey.JOB_REPORT_SUCCEEDED]: {
    details: Link;
    attempts: {
      current: number;
      max: number;
    };
  };
  [TKey.APP_CONNECTED_MESSAGE]: { name: string };
  [TKey.APP_DISCONNECTED_MESSAGE]: { name: string };
  [TKey.APP_UPDATED_MESSAGE]: { name: string };
  [TKey.APP_SESSION_STATUS_CHANGE]: {
    emoji: string;
    session: string;
    status: string;
  };
  [TKey.APP_SESSION_CURRENT_STATUS]: {
    emoji: string;
    session: string;
    status: string;
    name: string;
    id: string;
  };
  [TKey.APP_SESSION_STATUS_WORKING]: { name: string; id: string };
  [TKey.APP_SESSION_STATUS_ERROR]: void;
  [TKey.APP_SESSION_SCAN_QR_CODE]: void;
  [TKey.APP_HELP_REMINDER]: void;
  ['cli.cmd.disabled']: { command: string };
  [TKey.APP_SERVER_VERSION_AND_STATUS]: {
    version: string;
    status: string;
  };
  [TKey.APP_SERVER_REBOOT]: void;
  [TKey.APP_SERVER_REBOOT_FORCE]: void;
  [TKey.APP_LOGOUT_SUCCESS]: void;
  [TKey.WAHA_NEW_VERSION_AVAILABLE]: {
    currentVersion: string;
    newVersion: string;
    changelogUrl: string;
  };
  [TKey.WAHA_CORE_VERSION_USED]: {
    supportUrl: string;
  };
  [key: string]: unknown;
};
