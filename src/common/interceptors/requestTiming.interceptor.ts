import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestTimingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestTimingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const started = Date.now();
    this.logger.log('Request received');

    return next.handle().pipe(
      tap(() =>
        this.logger.log(`Request processed in ${Date.now() - started}ms`),
      ),
    );
  }
}