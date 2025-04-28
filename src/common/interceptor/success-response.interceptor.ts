import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/response.dto';

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                const response = context.switchToHttp().getResponse();
                let status = 200;

                if (data) {
                    if (data instanceof Array && data.length === 0) {
                        status = 204;
                    } else if (data instanceof Object && data.id) {
                        status = 201;
                    }
                }

                return new ApiResponse(status, 'Success', context.switchToHttp().getRequest().url, data);
            }),
        );
    }
}
