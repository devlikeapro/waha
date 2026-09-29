import { UnprocessableEntityException } from '@nestjs/common';
import { NotImplementedByEngineError } from '@waha/core/exceptions';
import { isJidBroadcast, isJidStatusBroadcast } from '@waha/core/utils/jids';

/**
 * A broadcast list a user created on their phone - as opposed to
 * 'status@broadcast', which is the WhatsApp Status feed.
 */
export function isBroadcastListJid(jid: string): boolean {
  return isJidBroadcast(jid) && !isJidStatusBroadcast(jid);
}

/**
 * 'participants' is only meaningful for broadcast lists: WhatsApp doesn't
 * let a linked device read who is on a list created on the phone, so the
 * caller has to provide the recipients themselves. Reject the request early
 * with a clear message instead of silently ignoring it or sending to the
 * wrong chat.
 */
export function validateBroadcastListParticipants(request: {
  chatId: string;
  participants?: string[];
}) {
  const isList = isBroadcastListJid(request.chatId);
  if (request.participants && request.participants.length > 0) {
    if (!isList) {
      throw new UnprocessableEntityException(
        `"participants" can be used only when sending to a broadcast list ('<id>@broadcast'), not to '${request.chatId}'.`,
      );
    }
    return;
  }
  if (isList) {
    throw new UnprocessableEntityException(
      `Sending to a broadcast list ('${request.chatId}') requires "participants" - ` +
        `the members of a list created on the phone can't be read from a linked device.`,
    );
  }
}

/**
 * Engines other than GOWS have no way to fan a message out to explicit
 * broadcast list participants, so fail loudly instead of dropping them.
 */
export function rejectUnsupportedBroadcastListParticipants(request: {
  participants?: string[];
}) {
  if (request.participants && request.participants.length > 0) {
    throw new NotImplementedByEngineError(
      'Sending to a broadcast list with "participants" is not supported.',
    );
  }
}
