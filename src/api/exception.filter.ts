import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { VERSION } from '../version';

/**
 * Serializer error to JSON.
 * Because it's not possible to just pass Error class to JSON.stringify in the nestjs response
 * Credits: https://stackoverflow.com/a/72707578/6753144
 */
export function serializeError(err: unknown) {
  const properties = Object.getOwnPropertyNames(err);
  // getOwnPropertyNames does not get 'name', like "ReferenceError"
  properties.push('name');
  return JSON.parse(JSON.stringify(err, properties));
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any | Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    /**
     * If file not found - we get weird 500 error
     * So we convert that exception manually to 404 and send appropriate JSON response
     * @issue https://github.com/devlikeapro/whatsapp-http-api/issues/134
     * @solution https://github.com/nestjs/serve-static/issues/139#issuecomment-612429557
     */
    if (exception.code === 'ENOENT') {
      response.status(HttpStatus.NOT_FOUND).json({
        error: {
          code: 404,
          key: 'FILE_NOT_FOUND',
          message: 'File not found',
          details: 'File not found or no longer available',
        },
      });
      response.send();
      return;
    }

    /**
     * If it's HttpException - pass it as is
     */
    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    /**
     * If it's not HttpException - pass it as 500 error
     * And send JSON response with error details
     */
    const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(httpStatus).json({
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      exception: serializeError(exception),
      request: {
        path: request.url,
        method: request.method,
        body: request.body,
        query: request.query,
      },
      version: VERSION,
    });
  }
}
