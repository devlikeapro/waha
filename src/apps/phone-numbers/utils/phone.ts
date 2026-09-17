import {
  isJidBroadcast,
  isJidGroup,
  isJidMetaAI,
  isJidNewsletter,
  isLidUser,
} from '@waha/core/utils/jids';

export function extractPhoneDigits(value: string): string {
  if (!value) {
    return '';
  }
  const local = value.split('@')[0] ?? value;
  return local.split(':')[0].replace(/\D/g, '');
}

/**
 * Chats that are not phone numbers - groups, lids, newsletters, etc.
 */
export function shouldSkipPhoneNormalization(chatId: string): boolean {
  if (!chatId) {
    return true;
  }
  if (isJidGroup(chatId)) {
    return true;
  }
  if (isJidBroadcast(chatId)) {
    return true;
  }
  if (isLidUser(chatId)) {
    return true;
  }
  if (isJidNewsletter(chatId)) {
    return true;
  }
  if (isJidMetaAI(chatId)) {
    return true;
  }
  if (chatId === 'me') {
    return true;
  }
  return false;
}
