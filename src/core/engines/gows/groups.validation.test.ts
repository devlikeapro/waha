import { BadRequestException } from '@nestjs/common';
import { assertGowsGroupTextIsNotEmpty } from '@waha/core/engines/gows/groups.validation';

describe('assertGowsGroupTextIsNotEmpty', () => {
  it('allows non-empty group text', () => {
    expect(() =>
      assertGowsGroupTextIsNotEmpty('New description', 'description'),
    ).not.toThrow();
  });

  it('rejects empty group descriptions', () => {
    expect(() => assertGowsGroupTextIsNotEmpty('', 'description')).toThrow(
      BadRequestException,
    );
  });

  it('rejects blank group subjects', () => {
    expect(() => assertGowsGroupTextIsNotEmpty('   ', 'subject')).toThrow(
      'GOWS does not support empty group subject.',
    );
  });
});
