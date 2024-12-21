import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EventRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  eventId: string;
}
