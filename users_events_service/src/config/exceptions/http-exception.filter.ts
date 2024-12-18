import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    let data, message;

    if (typeof exception.getResponse() == "object") {
      message = (exception.getResponse() as any)?.message;
      data = message
        ? (exception.getResponse() as any)?.data
        : exception.getResponse();
    } else if (typeof exception.getResponse() == "string") {
      message = exception.getResponse();
    }

    response.status(status).json({
      status: false,
      data,
      message,
    });
  }
}
