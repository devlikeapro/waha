import { UnprocessableEntityException } from '@nestjs/common';
import { PhoneNumbersAppService } from '@waha/apps/phone-numbers/services/PhoneNumbersAppService';

describe('PhoneNumbersAppService.validate', () => {
  const service = new PhoneNumbersAppService(null as any);

  function validate(rules: any[]) {
    return () => service.validate({ config: { rules: rules } } as any);
  }

  it('accepts regexp rules with and without replace', () => {
    expect(
      validate([
        { regexp: '^52' },
        { regexp: '^52(\\d{10})$', replace: '521$1' },
      ]),
    ).not.toThrow();
    expect(() => service.validate({ config: {} } as any)).not.toThrow();
  });

  it('rejects an invalid regexp', () => {
    expect(validate([{ regexp: '(' }])).toThrow(UnprocessableEntityException);
  });
});
