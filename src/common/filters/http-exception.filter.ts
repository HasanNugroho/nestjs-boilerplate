import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../dto/response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR; // Default to 500
        let message = 'Internal server error'; // Default message

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse() as { message: string; errorCode?: number };
            message = typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse.message;

            if (Array.isArray(message)) {
                message = message.map(msg => msg.toString()).join(', ');
            }
        }

        const errorResponse = new ApiResponse(
            status,
            false,
            message,
            exception.response?.data
        );

        response.status(status).json(errorResponse);
    }
}