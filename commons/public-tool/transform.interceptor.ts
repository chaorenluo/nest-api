import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggerService } from 'commons/public-module';

export interface Response<T> {
    code: number;
    data: T;
}

let num = 0;
const interval = '/'.repeat(50);

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        const loggerService = new LoggerService();
        const ctx = context.switchToHttp();
        const res = ctx.getResponse();

        loggerService.log(interval, `第 ${++num} 次请求`);
        return next.handle().pipe(
            map((data) => ({
                code: data?.code || res.statusCode,
                data: data?.data || data,
                message: data?.message || '操作成功',
            })),
        );
    }
}
