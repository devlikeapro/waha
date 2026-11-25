import { WAHAValidationPipe } from '@waha/nestjs/pipes/WAHAValidationPipe';
import { SendPixRequest } from '@waha/structures/chatting.pix.dto';

const metadata = { type: 'body' as const, metatype: SendPixRequest };

function validate(body: any): Promise<SendPixRequest> {
  return new WAHAValidationPipe().transform(body, metadata);
}

describe('SendPixRequest', () => {
  const base = {
    session: 'default',
    chatId: '5511999999999@c.us',
    merchantName: 'My Store',
    key: '12345678901',
    keyType: 'CPF',
  };

  it('accepts a valid request and keeps all fields', async () => {
    const request = await validate({
      ...base,
      currency: 'brl',
      referenceId: 'REF123',
      reply_to: 'false_111@c.us_AAA',
    });
    expect(request.merchantName).toBe('My Store');
    expect(request.key).toBe('12345678901');
    expect(request.keyType).toBe('CPF');
    expect(request.currency).toBe('BRL');
    expect(request.referenceId).toBe('REF123');
    expect(request.reply_to).toBe('false_111@c.us_AAA');
  });

  it('normalizes keyType case', async () => {
    const request = await validate({ ...base, keyType: ' evp ' });
    expect(request.keyType).toBe('EVP');
  });

  it('rejects unknown keyType', async () => {
    await expect(validate({ ...base, keyType: 'IBAN' })).rejects.toThrow();
  });

  it('rejects missing key', async () => {
    await expect(validate({ ...base, key: '' })).rejects.toThrow();
  });

  it('rejects invalid currency', async () => {
    await expect(validate({ ...base, currency: 'REAL' })).rejects.toThrow();
  });
});
