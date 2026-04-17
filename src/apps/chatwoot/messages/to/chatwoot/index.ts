import { WAMessage } from '@waha/structures/responses.dto';
import type { proto } from '@adiwajshing/baileys';
import { ChatWootMessagePartial } from '@waha/apps/chatwoot/consumers/waha/base';

export { TextMessage } from './TextMessage';
export { LocationMessage } from './LocationMessage';
export { ShareContactMessage } from './ShareContactMessage';
export { UnsupportedMessage } from './UnsupportedMessage';
export { MessageEdited } from './MessageEdited';
export { FacebookAdMessage } from './FacebookAdMessage';
export { PollMessage } from './PollMessage';
export { EventMessage } from './EventMessage';
export { PixMessage } from './PixMessage';
export { ListMessage } from './ListMessage';
export { AlbumMessage } from './AlbumMessage';
export { StatusReplyMessage } from './StatusReplyMessage';

export type Awaitable<T> = T | Promise<T>;

export interface MessageToChatWootConverter {
  convert(
    payload: WAMessage,
    protoMessage: proto.Message | null,
  ): Awaitable<ChatWootMessagePartial | null>;
}
export { resolveProtoMessage } from '@waha/core/engines/gows/waproto';
