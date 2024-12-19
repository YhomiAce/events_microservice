import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class MicroserviceRequestFilter implements ExceptionFilter {
  private logger = new Logger(MicroserviceRequestFilter.name);

  catch(exception: RpcException, host: ArgumentsHost) {
    this.logger.log(exception.name, exception.message);
    return new RpcException(exception.getError());
  }
}
