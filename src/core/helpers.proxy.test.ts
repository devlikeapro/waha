import { buildProxyUrl, describeProxy } from '@waha/core/helpers.proxy';

describe('buildProxyUrl', () => {
  it('uses http when the server has no scheme', () => {
    expect(buildProxyUrl({ server: 'proxy.local:3128' })).toEqual(
      'http://proxy.local:3128/',
    );
  });

  it('keeps the scheme of the server instead of adding another one', () => {
    expect(buildProxyUrl({ server: 'http://proxy.local:3128' })).toEqual(
      'http://proxy.local:3128/',
    );
    expect(buildProxyUrl({ server: 'socks5://proxy.local:1080' })).toEqual(
      'socks5://proxy.local:1080',
    );
  });

  it('encodes credentials with URL characters in them', () => {
    const url = new URL(
      buildProxyUrl({
        server: 'proxy.local:3128',
        username: 'user@corp',
        password: 'p@ss:w/rd#?%',
      }),
    );
    expect(url.host).toEqual('proxy.local:3128');
    expect(decodeURIComponent(url.username)).toEqual('user@corp');
    expect(decodeURIComponent(url.password)).toEqual('p@ss:w/rd#?%');
  });

  it('keeps a password already percent-encoded by hand', () => {
    const url = new URL(
      buildProxyUrl({
        server: 'proxy.local:3128',
        username: 'user',
        password: 'p%40ss',
      }),
    );
    expect(decodeURIComponent(url.password)).toEqual('p@ss');
  });

  it('sends the username alone when there is no password', () => {
    const url = new URL(
      buildProxyUrl({ server: 'proxy.local:3128', username: 'token' }),
    );
    expect(url.username).toEqual('token');
    expect(url.password).toEqual('');
  });

  it('does not echo an invalid server, which may carry credentials', () => {
    expect(() => buildProxyUrl({ server: 'http://user:secret@' })).toThrow(
      'Invalid proxy server address',
    );
  });
});

describe('describeProxy', () => {
  it('drops the credentials', () => {
    const url = buildProxyUrl({
      server: 'socks5://proxy.local:1080',
      username: 'user',
      password: 'secret',
    });
    expect(describeProxy(url)).toEqual('socks5://proxy.local:1080');
  });
});
