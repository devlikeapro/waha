import { redactApiKeyInUrl } from '@waha/utils/logging';

describe('redactApiKeyInUrl', () => {
  it('keeps the path and the other params, without the api key', () => {
    const url = redactApiKeyInUrl(
      '/ws?session=default&x-api-key=secret123&events=message',
    );

    expect(url).toBe('/ws?session=default&x-api-key=REDACTED&events=message');
    expect(url).not.toContain('secret123');
  });

  it('redacts the key whatever its case, and a key that needs encoding', () => {
    const url = redactApiKeyInUrl(
      '/ws?X-Api-Key=a%2Bb%2Fc%3D&x-api-key=second',
    );

    expect(url).toBe('/ws?X-Api-Key=REDACTED&x-api-key=REDACTED');
    expect(url).not.toContain('a%2Bb');
    expect(url).not.toContain('second');
  });

  it('leaves a url without a key as it is', () => {
    expect(redactApiKeyInUrl('/ws?session=*&events=*')).toBe(
      '/ws?session=*&events=*',
    );
    expect(redactApiKeyInUrl('/ws')).toBe('/ws');
    expect(redactApiKeyInUrl(undefined)).toBe('/');
  });
});
