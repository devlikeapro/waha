import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

import {
  DEFAULT_REQUEST_ID_HEADER,
  generateRequestId,
  getRequestIdHeader,
  RequestIdInterceptor,
} from './requestId';

const ENV_KEY = 'WAHA_REQUEST_ID_HEADER';

function createExecutionContext(
  reqId: unknown,
): { context: ExecutionContext; response: { setHeader: jest.Mock } } {
  const response = { setHeader: jest.fn() } as any;
  const httpContext = {
    getRequest: jest.fn().mockReturnValue({ id: reqId }),
    getResponse: jest.fn().mockReturnValue(response),
  };
  const context = {
    switchToHttp: jest.fn().mockReturnValue(httpContext),
  } as unknown as ExecutionContext;

  return { context, response };
}

function createCallHandler(): CallHandler {
  return { handle: jest.fn().mockReturnValue(of('response-body')) };
}

describe('getRequestIdHeader', () => {
  afterEach(() => {
    delete process.env[ENV_KEY];
  });

  it('returns default x-request-id when env var is not set', () => {
    expect(getRequestIdHeader()).toBe(DEFAULT_REQUEST_ID_HEADER);
  });

  it('returns default when env var is an empty string', () => {
    process.env[ENV_KEY] = '';

    expect(getRequestIdHeader()).toBe(DEFAULT_REQUEST_ID_HEADER);
  });

  it('returns custom header from env var', () => {
    process.env[ENV_KEY] = 'x-trace-id';

    expect(getRequestIdHeader()).toBe('x-trace-id');
  });

  it('returns custom header with mixed case from env var', () => {
    process.env[ENV_KEY] = 'X-Correlation-Id';

    expect(getRequestIdHeader()).toBe('X-Correlation-Id');
  });
});

describe('generateRequestId', () => {
  afterEach(() => {
    delete process.env[ENV_KEY];
  });

  it('generates a v4 UUID when no request-id header is present', () => {
    const id = generateRequestId({ headers: {} } as any);

    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('returns the caller-supplied header value when present', () => {
    const id = generateRequestId({
      headers: { [DEFAULT_REQUEST_ID_HEADER]: 'trace-abc-123' },
    } as any);

    expect(id).toBe('trace-abc-123');
  });

  it('returns first element when header value is an array', () => {
    const id = generateRequestId({
      headers: {
        [DEFAULT_REQUEST_ID_HEADER]: ['trace-first', 'trace-second'],
      },
    } as any);

    expect(id).toBe('trace-first');
  });

  it('generates unique UUIDs for successive calls without a header', () => {
    const req = { headers: {} } as any;

    const id1 = generateRequestId(req);
    const id2 = generateRequestId(req);

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(id2).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('preserves empty string header value', () => {
    const id = generateRequestId({
      headers: { [DEFAULT_REQUEST_ID_HEADER]: '' },
    } as any);

    expect(id).toBe('');
  });

  it('preserves non-UUID header value as-is', () => {
    const id = generateRequestId({
      headers: { [DEFAULT_REQUEST_ID_HEADER]: 'my-custom-id-!@#' },
    } as any);

    expect(id).toBe('my-custom-id-!@#');
  });

  it('reads from the configured header when env var is set', () => {
    process.env[ENV_KEY] = 'x-trace-id';

    const id = generateRequestId({
      headers: { 'x-trace-id': 'trace-via-env' },
    } as any);

    expect(id).toBe('trace-via-env');
  });

  it('falls back to UUID when custom header is absent', () => {
    process.env[ENV_KEY] = 'x-trace-id';

    const id = generateRequestId({ headers: {} } as any);

    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('ignores default header when a custom header is configured', () => {
    process.env[ENV_KEY] = 'x-trace-id';

    const id = generateRequestId({
      headers: { [DEFAULT_REQUEST_ID_HEADER]: 'should-be-ignored' },
    } as any);

    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });
});

describe('RequestIdInterceptor', () => {
  afterEach(() => {
    delete process.env[ENV_KEY];
  });

  it('sets response header from req.id string', () => {
    const { context, response } = createExecutionContext(
      '550e8400-e29b-41d4-a716-446655440000',
    );
    const handler = createCallHandler();
    const interceptor = new RequestIdInterceptor();

    interceptor.intercept(context, handler).subscribe({
      next: (body) => {
        expect(body).toBe('response-body');
      },
    });

    expect(response.setHeader).toHaveBeenCalledWith(
      'x-request-id',
      '550e8400-e29b-41d4-a716-446655440000',
    );
    expect(handler.handle).toHaveBeenCalledTimes(1);
  });

  it('sets response header from req.id number', () => {
    const { context, response } = createExecutionContext(42);
    const handler = createCallHandler();
    const interceptor = new RequestIdInterceptor();

    interceptor.intercept(context, handler).subscribe();

    expect(response.setHeader).toHaveBeenCalledWith('x-request-id', '42');
    expect(handler.handle).toHaveBeenCalledTimes(1);
  });

  it('does not set header when req.id is undefined', () => {
    const { context, response } = createExecutionContext(undefined);
    const handler = createCallHandler();
    const interceptor = new RequestIdInterceptor();

    interceptor.intercept(context, handler).subscribe();

    expect(response.setHeader).not.toHaveBeenCalled();
    expect(handler.handle).toHaveBeenCalledTimes(1);
  });

  it('does not set header when req.id is null', () => {
    const { context, response } = createExecutionContext(null);
    const handler = createCallHandler();
    const interceptor = new RequestIdInterceptor();

    interceptor.intercept(context, handler).subscribe();

    expect(response.setHeader).not.toHaveBeenCalled();
    expect(handler.handle).toHaveBeenCalledTimes(1);
  });

  it('sets header when req.id is an empty string', () => {
    const { context, response } = createExecutionContext('');
    const handler = createCallHandler();
    const interceptor = new RequestIdInterceptor();

    interceptor.intercept(context, handler).subscribe();

    expect(response.setHeader).toHaveBeenCalledWith('x-request-id', '');
    expect(handler.handle).toHaveBeenCalledTimes(1);
  });

  it('passes through the observable result unchanged', () => {
    const { context } = createExecutionContext('req-123');
    const handler = createCallHandler();
    const interceptor = new RequestIdInterceptor();

    const results: unknown[] = [];
    interceptor.intercept(context, handler).subscribe({
      next: (body) => {
        results.push(body);
      },
    });

    expect(results).toEqual(['response-body']);
  });

  it('uses custom header name from env var in response', () => {
    process.env[ENV_KEY] = 'x-correlation-id';
    const { context, response } = createExecutionContext('trace-me');
    const handler = createCallHandler();
    const interceptor = new RequestIdInterceptor();

    interceptor.intercept(context, handler).subscribe();

    expect(response.setHeader).toHaveBeenCalledWith(
      'x-correlation-id',
      'trace-me',
    );
  });

  it('uses mixed-case custom header from env var in response', () => {
    process.env[ENV_KEY] = 'X-Trace-Id';
    const { context, response } = createExecutionContext('trace-me');
    const handler = createCallHandler();
    const interceptor = new RequestIdInterceptor();

    interceptor.intercept(context, handler).subscribe();

    expect(response.setHeader).toHaveBeenCalledWith('X-Trace-Id', 'trace-me');
  });

  it('passes through result unchanged with custom header configured', () => {
    process.env[ENV_KEY] = 'x-custom';
    const { context } = createExecutionContext('req-456');
    const handler = createCallHandler();
    const interceptor = new RequestIdInterceptor();

    const results: unknown[] = [];
    interceptor.intercept(context, handler).subscribe({
      next: (body) => {
        results.push(body);
      },
    });

    expect(results).toEqual(['response-body']);
  });
});
