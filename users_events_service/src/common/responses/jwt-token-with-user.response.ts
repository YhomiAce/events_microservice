import {ApiResponseProperty} from '@nestjs/swagger';
import type {User} from '../../entities/user.entity';
import { AuthJwtInterface } from '../interfaces';
import { UserResponseExample } from './examples';

export class JwtTokenWithUserResponse {
  @ApiResponseProperty({example: UserResponseExample.tokens})
  tokens?: AuthJwtInterface;

  @ApiResponseProperty({example: UserResponseExample.user})
  user: User;
}
