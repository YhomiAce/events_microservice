import { ApiResponseProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiResponseProperty()
  message: string;

  @ApiResponseProperty()
  status: boolean;
}
