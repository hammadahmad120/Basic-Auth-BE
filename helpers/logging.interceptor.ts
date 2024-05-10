import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(
        private readonly loggerService: LoggerService,
    ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const request: Request = context.switchToHttp().getRequest();
    const response: Request = context.switchToHttp().getResponse();
    return next
      .handle()
      .pipe(
        tap((data) => {
            this.loggerService.log('info', `url: ${request.url} ${request["user"]?.email ? ` -- user:${request["user"]?.email}`:'' } -- Response`)
            this.loggerService.log('info', '%o', data);
        }),
      ).pipe(
        catchError(err => {
            this.loggerService.log('error', `url: ${request.url} ${request["user"]?.email ? ` -- user: ${request["user"]?.email}`:'' } -- Error Response`)
            this.loggerService.log('error', '%o', err.response);
            throw err
        }),
      );
  }
}