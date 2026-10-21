import { registerDecorator, ValidationOptions } from 'class-validator';

// Same characters WhatsApp rejects: · @ # $ % / ~ \, control, zero-width and bidi characters
const FORBIDDEN_CHARS = /[·@#$%/~\\\p{Cc}​-‏‪-‮⁠-⁤﻿]/u;

export const GROUP_MEMBER_TAG_MIN_LENGTH = 2;
export const GROUP_MEMBER_TAG_MAX_LENGTH = 30;

/**
 * Check a group member tag the way WhatsApp does.
 * Empty (or null) is valid and means "remove the tag", otherwise 2..30 UTF-16 units without forbidden characters.
 */
export function isGroupMemberTagValid(value: any): boolean {
  if (value === null || value === undefined || value === '') {
    return true;
  }
  if (typeof value !== 'string') {
    return false;
  }
  if (
    value.length < GROUP_MEMBER_TAG_MIN_LENGTH ||
    value.length > GROUP_MEMBER_TAG_MAX_LENGTH
  ) {
    return false;
  }
  return !FORBIDDEN_CHARS.test(value);
}

export function IsGroupMemberTag(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isGroupMemberTag',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return isGroupMemberTagValid(value);
        },
        defaultMessage() {
          return (
            `must be ${GROUP_MEMBER_TAG_MIN_LENGTH}-${GROUP_MEMBER_TAG_MAX_LENGTH} characters ` +
            'without · @ # $ % / ~ \\ or control characters, or empty to remove the tag.'
          );
        },
      },
    });
  };
}
