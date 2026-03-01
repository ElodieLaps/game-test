import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const started = Date.now();
    console.log('Request received');
    return next
      .handle()
      .pipe(
        tap(() => console.log(`Request processed ${Date.now() - started}ms`)),
      );
  }
}
