import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessResponse, UserResponse } from '../../../common/responses';
import { User } from '../../../entities';
import { AccessTokenGuard } from '../../auth/guards';
import { CurrentUser } from '../../../common/decorators';
import { UserService } from '../services';
import { UpdateUserDto } from '../dtos';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get loggedIn User
   *
   * @returns {UserResponse}
   */
  @ApiOperation({
    summary: 'Get Loggedin user profile',
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

  /**
   * Update user
   *
   * @async
   * @param {User} user
   * @param {UpdateUserDto} updateUserDto
   * @returns {Promise<UserResponse>}
   */
  @ApiOperation({
    summary: 'Update User Profile',
  })
  @ApiOkResponse({ type: UserResponse })
  @ApiBadRequestResponse({
    description: 'Bad Request: Validation error',
  })
  @UseGuards(AccessTokenGuard)
  @Patch('/profile')
  async updateUser(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return {
      data: await this.userService.updateProfile(user, updateUserDto),
    };
  }
}
