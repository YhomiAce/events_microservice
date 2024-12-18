import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface CtxRes {
  message: string;
  data: any;
}

export interface Response extends CtxRes {
  status: boolean;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response> {
    return next.handle().pipe(
      map((res) => ({
        status: true,
        ...res,
      })),
    );
  }
}
