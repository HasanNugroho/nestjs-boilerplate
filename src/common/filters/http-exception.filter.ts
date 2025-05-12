import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpResponse } from '../dto/response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const { status, message } = this.resolveExceptionData(exception)

        console.error('exception:', exception);
        const errorResponse = new HttpResponse(
            status,
            false,
            message,
            undefined,
        );

        response.status(status).json(errorResponse);
    }

    resolveExceptionData(exception: any): { status: number; message: string } {
        const defaultStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        const defaultMessage = 'Internal server error';

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const res = exception.getResponse();

            if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
                return { status, message: defaultMessage };
            }

            let message: string | string[] = defaultMessage;
            if (typeof res === 'string') {
                message = res;
            } else if (typeof res === 'object') {
                const { message: msg } = res as any;
                message = msg ?? message;
            }

            if (Array.isArray(message)) {
                message = message.map(msg => msg.toString()).join(', ');
            }

            return { status, message }
        }

        const errorWithMessage = exception as { message?: unknown };
        const message = errorWithMessage?.message
            ? String(errorWithMessage.message)
            : defaultMessage;

        console.error('Unhandled exception:', exception);

        return {
            status: defaultStatus,
            message
        };
    }
}
