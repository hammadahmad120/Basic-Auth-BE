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
    const request: Request = context.switchToHttp().getRequest();
    const maskedRequestBody = this.maskSecureProperties(request.body, ["password"]);
    return next
      .handle()
      .pipe(
        tap((data) => {
            this.loggerService.log('info', `${request.method} ${request.url} ${request["user"]?.email ? ` -- user:${request["user"]?.email}`:'' } `);
            this.loggerService.log('info', ` Request body:   %o`, maskedRequestBody);
            this.loggerService.log('info', `Response:   %o`, data);
        }),
      ).pipe(
        catchError(err => {
          this.loggerService.log('error', `${request.method} ${request.url} ${request["user"]?.email ? ` -- user:${request["user"]?.email}`:'' } `);
          this.loggerService.log('error', `Request body:   %o`, maskedRequestBody);
          this.loggerService.log('error', `Error Response:   %o`,  err.response);
          throw err
        }),
      );
  }
  private maskSecureProperties(requestBody: ReadableStream<Uint8Array> | null, toEmptyProperties: [string] )  {

    const objectCopy = {...(requestBody || {})}
    for (const [key] of Object.entries(objectCopy)) {
      if(toEmptyProperties.includes(key)){
        objectCopy[key] = null;
      }
  }
  return objectCopy;
  }
}