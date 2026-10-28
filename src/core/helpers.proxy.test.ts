import { buildProxyUrl } from '@waha/core/helpers.proxy';

describe('buildProxyUrl', () => {
  it('uses http when the server has no scheme', () => {
    const url = new URL(buildProxyUrl({ server: 'proxy.local:3128' }));
    expect(url.protocol).toEqual('http:');
    expect(url.host).toEqual('proxy.local:3128');
  });

  it('keeps the http or https scheme of the server instead of adding another one', () => {
    const http = new URL(buildProxyUrl({ server: 'http://proxy.local:3128' }));
    expect(http.protocol).toEqual('http:');
    expect(http.host).toEqual('proxy.local:3128');

    const https = new URL(
      buildProxyUrl({ server: 'https://proxy.local:3129' }),
    );
    expect(https.protocol).toEqual('https:');
    expect(https.host).toEqual('proxy.local:3129');
  });

  it('adds the credentials after the scheme', () => {
    const url = new URL(
      buildProxyUrl({
        server: 'http://proxy.local:3128',
        username: 'user',
        password: 'secret',
      }),
    );
    expect(url.host).toEqual('proxy.local:3128');
    expect(url.username).toEqual('user');
    expect(url.password).toEqual('secret');
  });
});
