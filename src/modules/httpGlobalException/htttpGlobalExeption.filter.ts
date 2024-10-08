import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof BadRequestException) {
      const responseBody = exception.getResponse() as {
        message: string;
        error: string;
      };

      response.status(status).json({
        success: false,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: responseBody.message || 'Bad Request',
        error: responseBody.error || 'Validation Error',
      });
      return;
    }

    const message = exception.message || 'Internal server error';

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
