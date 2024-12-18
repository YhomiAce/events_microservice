import { ApiResponseProperty } from '@nestjs/swagger';

export class SuccessResponse {
  @ApiResponseProperty()
  message?: string;
  
  @ApiResponseProperty()
  data?: any;
}
