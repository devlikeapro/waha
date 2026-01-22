import { ensureSuffix } from '@waha/core/abc/session.abc';
import { isJidGroup } from '@waha/core/utils/jids';

export interface ParsedMentions {
  text: string;
  mentions?: string[];
}

/**
 * Parse mentions from text message
 * Supports:
 * - @all - mentions all group participants
 * - @558591203123 - mentions specific phone number
 *
 * @param text - The message text
 * @returns Parsed mentions with cleaned text
 */
export function parseMentionsFromText(
  text: string | null | undefined,
): ParsedMentions {
  if (!text) {
    return {
      text: text,
      mentions: null,
    };
  }
  const mentions: string[] = [];
  let content = text;

  // Regex to match @all (case-insensitive, word boundary)
  // Use separate regex instances to avoid lastIndex issues with global flag
  const allRegexTest = /(^|\s)@all\b/gi;
  if (allRegexTest.test(text)) {
    mentions.push('all');
    // Remove @all from text - WAHA endpoint doesn't display it, only mentions all participants
    // Create a new regex instance for replace to avoid lastIndex issues
    const allRegexReplace = /(^|\s)@all\b/gi;
    content = content.replace(allRegexReplace, '$1').trim();
  }

  const lidRegex = /(^|\s)@(\d{6,15})@lid\b/g;
  const lidMatches = text.matchAll(lidRegex);

  for (const match of lidMatches) {
    const lidNumber = match[2];
    const formattedLid = `${lidNumber}@lid`;
    if (!mentions.includes(formattedLid)) {
      mentions.push(formattedLid);
    }
  }
  if (mentions.length > 0) {
    const lidRegexReplace = /(^|\s)@(\d{6,15})@lid\b/g;
    content = content.replace(lidRegexReplace, '$1@$2').trim();
  }

  // Regex to match @ followed by phone number
  // Matches: @558591203123, @5585991203123, etc.
  // Phone numbers: 7-15 digits (international format)
  const phoneRegex = /(^|\s)@(\d{7,15})(?!@lid)\b/g;
  const phoneMatches = text.matchAll(phoneRegex);

  for (const match of phoneMatches) {
    const phoneNumber = match[2];
    // Format phone number to @c.us format
    const formattedJid = ensureSuffix(phoneNumber);
    if (!mentions.includes(formattedJid)) {
      mentions.push(formattedJid);
    }
  }

  if (mentions.length == 0) {
    // Nothing found
    return {
      text: text,
      mentions: null,
    };
  }

  // Ensure text is not empty when there are mentions
  // If text becomes empty after removing mentions, use a default message
  content = content.trim();
  if (content === '') {
    // When only mentions are present, use a minimal text to satisfy DTO requirements
    // The mentions array will handle the actual mentions
    content = ' ';
  }
  return {
    text: content,
    mentions: mentions,
  };
}
