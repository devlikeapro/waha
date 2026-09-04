import { CommaSeparatedStrings } from './CommaSeparatedStrings';

describe('CommaSeparatedStrings', () => {
  it('should convert a single value to an array', () => {
    // ?a=image/jpeg
    expect(CommaSeparatedStrings({ value: 'image/jpeg' })).toEqual([
      'image/jpeg',
    ]);
  });

  it('should keep the repeated form as is', () => {
    // ?a=image/jpeg&a=image/png
    expect(
      CommaSeparatedStrings({ value: ['image/jpeg', 'image/png'] }),
    ).toEqual(['image/jpeg', 'image/png']);
  });

  it('should split comma separated values', () => {
    // ?a=image/jpeg,image/png
    expect(CommaSeparatedStrings({ value: 'image/jpeg,image/png' })).toEqual([
      'image/jpeg',
      'image/png',
    ]);
  });

  it('should split comma separated values in the repeated form', () => {
    // ?a=image/jpeg,image/png&a=video/mp4
    expect(
      CommaSeparatedStrings({ value: ['image/jpeg,image/png', 'video/mp4'] }),
    ).toEqual(['image/jpeg', 'image/png', 'video/mp4']);
  });

  it('should trim values and remove empty ones', () => {
    // ?a=image/jpeg, image/png,
    expect(CommaSeparatedStrings({ value: 'image/jpeg, image/png,' })).toEqual([
      'image/jpeg',
      'image/png',
    ]);
  });

  it('should keep null and undefined as is', () => {
    expect(CommaSeparatedStrings({ value: null })).toBeNull();
    expect(CommaSeparatedStrings({ value: undefined })).toBeUndefined();
  });
});
