import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus,} from '@nestjs/common';
import {Request, Response} from 'express';

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
                path: request.url,
                error: exception.message,
                stack: exception.stack,
            });

    }
}
