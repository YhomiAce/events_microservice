import {ApiProperty} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {IsNotEmpty, IsString} from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({value}) => value.toLowerCase())
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
