import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class RpcExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((error) => {
        // Log the error for debugging purposes
        console.error('Error intercepted:', error);
        // You could add more detailed error info if necessary
        return throwError(() => error);
      })
    );
  }
}
