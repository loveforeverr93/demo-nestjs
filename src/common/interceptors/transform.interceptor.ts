import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    return next.handle().pipe(
      map((data) => {
        if (data?.__created) {
          response.status(HttpStatus.CREATED);
          response.statusCode = HttpStatus.CREATED;
          delete data.__created;
        } else {
          response.status(HttpStatus.OK);
          response.statusCode = HttpStatus.OK;
        }
        return {
          success: true,
          status: response.statusCode,
          timestamp: new Date().toISOString(),
          data,
        };
      }),
    );
  }
}
