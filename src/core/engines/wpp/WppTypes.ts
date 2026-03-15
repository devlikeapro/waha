import { Whatsapp as WPPWhatsapp } from '@wppconnect-team/wppconnect';
import type {
  PoolMessageOptions,
  TextMessageOptions,
} from '@wppconnect/wa-js/dist/chat';
import type { EditMessageOptions } from '@wppconnect/wa-js/dist/chat/functions/editMessage';
import type { TextStatusOptions } from '@wppconnect/wa-js/dist/status/functions/sendTextStatus';

//
// Event data types extracted directly from wppconnect on* method signatures.
// Using Parameters<> keeps these automatically in sync with wppconnect:
// if an inline type changes upstream, TypeScript will catch mismatches here.
//

// Extracts the last parameter of a function (handles overloaded on* methods
// that accept an optional id filter as the first arg before the callback).
type LastParam<F extends (...args: any[]) => any> = Parameters<F> extends [
  ...any[],
  infer Last,
]
  ? Last
  : never;

// Extracts the event data type: first arg of the (last) callback parameter.
type WppEventData<Method extends (...args: any[]) => any> =
  LastParam<Method> extends (...args: any[]) => any
    ? Parameters<LastParam<Method>>[0]
    : never;

type WppTextMessageOptions = TextMessageOptions;
type WppMentionedList = WppTextMessageOptions extends {
  mentionedList?: infer Value;
}
  ? Value
  : string[];

export type WppPresenceEvent = WppEventData<WPPWhatsapp['onPresenceChanged']>;
export type WppParticipantEvent = WppEventData<
  WPPWhatsapp['onParticipantsChanged']
>;

export enum WppParticipantAction {
  ADD = 'add',
  JOIN = 'join',
  REMOVE = 'remove',
  LEAVE = 'leave',
  LEAVER = 'leaver',
  PROMOTE = 'promote',
  DEMOTE = 'demote',
}

export enum WppParticipantOperation {
  ADD = 'add',
  REMOVE = 'remove',
  PROMOTE = 'promote',
  DEMOTE = 'demote',
}

export type WppReactionEvent = WppEventData<WPPWhatsapp['onReactionMessage']>;
export type WppRevokedMessageEvent = WppEventData<
  WPPWhatsapp['onRevokedMessage']
>;
export type WppPollResponseEvent = WppEventData<WPPWhatsapp['onPollResponse']>;
export type WppUpdateLabelEvent = WppEventData<WPPWhatsapp['onUpdateLabel']>;
export type WppIncomingCallEvent = WppEventData<WPPWhatsapp['onIncomingCall']>;
export type WppSendPollOptions = PoolMessageOptions;
export type WppSendTextOptions = WppTextMessageOptions;
export type WppSendTextStatusOptions = Omit<
  TextStatusOptions,
  'backgroundColor'
> & {
  backgroundColor?: string;
};
export type WppEditMessageOptions = EditMessageOptions & {
  mentions?: WppMentionedList;
};

// onMessageEdit callback has three separate args: (chat: Wid, id: string, msg: Message).
// fromWppCallback packs them into a tuple since args.length > 1.
export type WppMessageEditArgs = Parameters<
  LastParam<WPPWhatsapp['onMessageEdit']>
>;
