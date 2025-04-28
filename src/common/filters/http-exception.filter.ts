import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../dto/response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse() as { message: string; errorCode?: number };
        let message = typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse.message;
        const errorText = HttpStatus[status] || 'Error';

        if (Array.isArray(message)) {
            message = message.map(msg => msg.toString()).join(', ');
        }


        const errorResponse = new ApiResponse(
            status,
            errorText,
            message,
            request.url,
            exception.response?.data
        );

        response.status(status).json(errorResponse);
    }
}
