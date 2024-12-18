import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { Response } from "express";
import { TypeORMError } from "typeorm";
import { HttpStatus } from "@nestjs/common";
import { AppStrings } from "../../common/messages/app.strings";

@Catch(TypeORMError)
export class DBExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let data, message;
    switch (exception.name) {
      case "EntityPropertyNotFoundError":
        message = this.throwEntityPropertyNotFoundError(exception.message);
        break;
      case "QueryFailedError":
        message = exception.message;
        break;
    }
    response.status(HttpStatus.BAD_REQUEST).json({
      status: false,
      data,
      message,
    });
  }

  throwEntityPropertyNotFoundError(message: string) {
    let [field, model] = message.match(/"\w+"/g);
    field = field.replaceAll('"', "");
    model = model.replaceAll('"', "");
    message =
      field != "0"
        ? AppStrings.FIELD_NOT_EXIST(field)
        : AppStrings.WRONG_DATA_FOR_FIELD(model);
    return message;
  }
}
