import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../../user/repository';
import type { User } from 'src/entities';
import { LoginDto, SignUpDto } from '../dtos';
import { AppStrings } from 'src/common/messages/app.strings';
import { JwtTokenWithUserResponse } from 'src/common/responses';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtInterface, JWTPayload } from 'src/common/interfaces';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NOTIFICATIONS_SERVICE } from 'src/common/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { SEND_WELCOME_EMAIL } from 'src/config/events';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {}

  /**
   * Register new user
   *
   * @async
   * @param {SignUpDto} inputData
   * @returns {Promise<User>}
   */
  async register(inputData: SignUpDto): Promise<User> {
    try {
      const { email } = inputData;
      const user = await this.userRepository.findUserByEmail(email);
      if (user) {
        throw new ConflictException(AppStrings.EXISTING_RESOURCE('User'));
      }
      const data: Partial<User> = {
        ...inputData,
      };
      const result = await this.userRepository.create(data);
      // send welcome email to notification service
      this.notificationService.emit(SEND_WELCOME_EMAIL, {
        toEmail: result.email,
        name: result.fullName,
      });
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  /**
   * Login user
   *
   * @async
   * @param {AuthLoginDto} authLoginDto
   * @returns {Promise<JwtTokenWithUserResponse>}
   */
  async login(authLoginDto: LoginDto): Promise<JwtTokenWithUserResponse> {
    const { email, password } = authLoginDto;
    const user = await this.validateUserCredentials(email, password);
    if (!user) {
      throw new UnauthorizedException(AppStrings.INVALID_EMAIL_OR_PASSWORD);
    }
    // get login token
    const tokens = await this.issueTokens(user);
    // save hashed value of refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    // Return the user and the access tokens
    return {
      user,
      tokens,
    };
  }

  /**
   * Validate user password
   *
   * @async
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   */
  async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    }
    return null;
  }

  /**
   * Generate JWT tokens
   *
   * @async
   * @param {User} user
   * @returns {Promise<AuthJwtInterface>}
   */
  async issueTokens(user: User): Promise<AuthJwtInterface> {
    // JWT payload to identify the user
    const payload: JWTPayload = {
      username: user.email,
      sub: user.id,
    };

    // Generate JWT tokens for access and refresh tokens
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_TTL'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_TTL'),
      }),
    ]);

    // Return the tokens
    return {
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
    };
  }

  /**
   * Update user refresh token
   *
   * @async
   * @param {string} userId
   * @param {string} refreshToken
   * @returns {*}
   */
  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      await bcrypt.genSalt(),
    );
    const days = this.configService.get<string>('JWT_REFRESH_TTL');
    const daysArr = days.split('d');

    // convert to milliseconds
    const ttlInMilliseconds = Number(daysArr[0]) * 86400 * 1000;

    await this.cacheManager.set(
      `refresh-${userId}`,
      hashedRefreshToken,
      ttlInMilliseconds,
    );
  }

  /**
   * Refresh token
   *
   * @async
   * @param {string} userId
   * @param {string} refreshToken
   * @returns {AuthJwtInterface}
   */
  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthJwtInterface> {
    try {
      const user = await this.userRepository.findByIdOrFail(userId);
      const hashedRefreshToken: string = await this.cacheManager.get(
        `refresh-${userId}`,
      );
      if (!user || !hashedRefreshToken) {
        throw new UnauthorizedException();
      }

      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        hashedRefreshToken,
      );
      if (!refreshTokenMatches) {
        throw new UnauthorizedException(AppStrings.WRONG_REFRESH_TOKEN);
      }
      const tokens = await this.issueTokens(user);
      await this.cacheManager.del(`refresh-${userId}`);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
