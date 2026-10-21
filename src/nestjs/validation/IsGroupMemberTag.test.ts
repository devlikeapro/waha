import { validate } from 'class-validator';

import { IsGroupMemberTag, isGroupMemberTagValid } from './IsGroupMemberTag';

describe('isGroupMemberTagValid', () => {
  it('accepts empty values as "remove the tag"', () => {
    expect(isGroupMemberTagValid('')).toBe(true);
    expect(isGroupMemberTagValid(null)).toBe(true);
    expect(isGroupMemberTagValid(undefined)).toBe(true);
  });

  it('accepts 2..30 characters', () => {
    expect(isGroupMemberTagValid('Ma')).toBe(true);
    expect(isGroupMemberTagValid('Manager')).toBe(true);
    expect(isGroupMemberTagValid('a'.repeat(30))).toBe(true);
    expect(isGroupMemberTagValid('Отдел продаж')).toBe(true);
  });

  it('rejects wrong length', () => {
    expect(isGroupMemberTagValid('M')).toBe(false);
    expect(isGroupMemberTagValid('a'.repeat(31))).toBe(false);
    // Astral characters count as two UTF-16 units, like in WhatsApp
    expect(isGroupMemberTagValid('😀'.repeat(15))).toBe(true);
    expect(isGroupMemberTagValid('😀'.repeat(16))).toBe(false);
  });

  it('rejects forbidden characters', () => {
    for (const char of ['·', '@', '#', '$', '%', '/', '~', '\\']) {
      expect(isGroupMemberTagValid(`Man${char}ager`)).toBe(false);
    }
    expect(isGroupMemberTagValid('Man\u0000ager')).toBe(false);
    expect(isGroupMemberTagValid('Man​ager')).toBe(false);
    expect(isGroupMemberTagValid('Man‮ager')).toBe(false);
    expect(isGroupMemberTagValid('Man﻿ager')).toBe(false);
  });

  it('rejects non-strings', () => {
    expect(isGroupMemberTagValid(123)).toBe(false);
    expect(isGroupMemberTagValid({})).toBe(false);
  });
});

class TagDto {
  @IsGroupMemberTag()
  tag: any;
}

describe('IsGroupMemberTag', () => {
  it('passes for a valid tag', async () => {
    const dto = new TagDto();
    dto.tag = 'Manager';
    expect(await validate(dto)).toHaveLength(0);
  });

  it('fails for an invalid tag with a helpful message', async () => {
    const dto = new TagDto();
    dto.tag = 'Man@ger';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints.isGroupMemberTag).toContain('2-30 characters');
  });
});
