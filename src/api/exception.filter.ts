import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus,} from '@nestjs/common';
import {Request, Response} from 'express';
import {VERSION} from "../version";

/**
 * Serializer error to JSON.
 * Because it's not possible to just pass Error class to JSON.stringify in the nestjs response
 * Credits: https://stackoverflow.com/a/72707578/6753144
 */
export function serializeError(err: unknown) {
    const properties = Object.getOwnPropertyNames(err)
    // getOwnPropertyNames does not get 'name', like "ReferenceError"
    properties.push('name')
    return JSON.parse(JSON.stringify(err, properties))
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: HttpException | Error, host: ArgumentsHost): void {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        if (exception instanceof HttpException) {
            response
                .status(exception.getStatus())
                .json(exception.getResponse());
            return
        }

        const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
        response
            .status(httpStatus)
            .json({
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
