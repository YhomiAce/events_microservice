import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../services';
import { LoginDto, SignUpDto } from '../dtos';
import {
  ErrorResponse,
  JwtTokenWithUserResponse,
  RefreshTokenResponse,
  SuccessResponse,
} from 'src/common/responses';
import { AppStrings } from 'src/common/messages/app.strings';
import { RefreshTokenGuard } from '../guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  /**
   * Creates an instance of AuthController.
   * Inject AuthService
   *
   * @constructor
   * @param {AuthService} authService
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   *
   * @async
   * @param {SignUpDto} signupDto
   * @returns {Promise<SuccessResponse>}
   */
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Register a new user',
  })
  @ApiResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Post('signup')
  async register(@Body() signupDto: SignUpDto): Promise<SuccessResponse> {
    return {
      message: AppStrings.USER_CREATED,
      data: await this.authService.register(signupDto),
    };
  }

  /**
   * Login a user
   *
   * @async
   * @param {LoginDto} loginDto
   * @returns {Promise<JwtTokenWithUserResponse>}
   */
  @ApiOperation({
    summary: 'Login a user',
    description: 'Login a user',
  })
  @ApiResponse({ type: JwtTokenWithUserResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<JwtTokenWithUserResponse> {
    return this.authService.login(loginDto);
  }

  /**
   * Refresh token API
   *
   * @param {*} req
   * @returns {JwtTokenResponse}
   */
  @ApiOperation({
    summary: 'Refresh token',
    description: 'Use refresh token from login as Authorization header',
  })
  @ApiOkResponse({ type: RefreshTokenResponse })
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Request() req: any): Promise<RefreshTokenResponse> {
    const { sub: userId, refreshToken } = req.user;
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
