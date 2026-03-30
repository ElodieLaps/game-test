import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class UsersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map(
          ({
            password,
            verificationToken,
            isVerified,
            verificationTokenExpiresAt,
            ...data
          }) => data,
        ),
      );
  }
}
