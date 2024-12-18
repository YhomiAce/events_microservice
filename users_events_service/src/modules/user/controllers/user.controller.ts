import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponse } from '../../../common/responses';
import { User } from '../../../entities';
import { AccessTokenGuard } from '../../auth/guards';
import { CurrentUser } from '../../../common/decorators';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  /**
   * Get loggedIn User
   *
   * @returns {UserResponse}
   */
  @ApiOperation({
    summary: 'Get Loggedin user',
    description: 'Get Loggedin user',
  })
  @ApiOkResponse({ type: UserResponse })
  @UseGuards(AccessTokenGuard)
  @Get()
  refreshTokens(@CurrentUser() user: User): UserResponse {
    return {
      data: user,
    };
  }
}
