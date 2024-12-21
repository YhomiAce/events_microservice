import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RequestDecisionStatus } from 'src/common/enums';

export class RequestDecisionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  requestId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  accept: boolean;
}
