import { randomUUID } from 'node:crypto';
import { IncomingMessage } from 'node:http';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

export const DEFAULT_REQUEST_ID_HEADER = 'x-request-id';

/**
 * Returns the configured request ID header name.
 * Reads `WAHA_REQUEST_ID_HEADER` from the environment, falling back to
 * `x-request-id` when not set.
 */
export function getRequestIdHeader(): string {
  return process.env.WAHA_REQUEST_ID_HEADER || DEFAULT_REQUEST_ID_HEADER;
}

/**
 * Generates a request ID for pino-http's `genReqId` option.
 * Uses the caller-supplied value from the configured incoming header
 * (`WAHA_REQUEST_ID_HEADER`, default `x-request-id`) if present,
 * otherwise generates a v4 UUID via `crypto.randomUUID()`.
 */
export function generateRequestId(req: IncomingMessage): string {
  const headerName = getRequestIdHeader();
  const incoming = req.headers[headerName];
  if (incoming !== undefined && incoming !== null) {
    return Array.isArray(incoming) ? incoming[0] : incoming;
  }
  return randomUUID();
}

/**
 * NestJS interceptor that writes `req.id` into the configured response
 * header (same name as the incoming header) so callers can correlate
 * responses with their own tracing systems.
 */
@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const requestId = request.id;
    if (requestId === undefined || requestId === null) {
      return next.handle();
    }

    const headerName = getRequestIdHeader();
    response.setHeader(headerName, String(requestId));
    return next.handle();
  }
}
