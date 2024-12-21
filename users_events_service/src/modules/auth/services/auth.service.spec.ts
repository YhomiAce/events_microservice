import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from '../../user/repository';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { SEND_WELCOME_EMAIL } from '../../../config/events';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NOTIFICATIONS_SERVICE } from '../../../common/constants/services';
import { mockeUser, mockLoginUser } from '../../../_mock_/test.mock';

const mockUserRepository = {
  findUserByEmail: jest.fn(),
  create: jest.fn(),
  findByIdOrFail: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
};

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
};

const mockNotificationService = {
  emit: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useValue: mockUserRepository },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        { provide: NOTIFICATIONS_SERVICE, useValue: mockNotificationService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and send a welcome email', async () => {
      const inputData = {
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'password',
      };
      const createdUser = { id: '1', ...inputData };
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await service.register(inputData);

      expect(result).toEqual(createdUser);
      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
        inputData.email,
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith(inputData);
      expect(mockNotificationService.emit).toHaveBeenCalledWith(
        SEND_WELCOME_EMAIL,
        {
          toEmail: inputData.email,
          name: inputData.fullName,
        },
      );
    });

    it('should throw ConflictException if user already exists', async () => {
      const inputData = {
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'password',
      };
      mockUserRepository.findUserByEmail.mockResolvedValue(inputData);

      await expect(service.register(inputData)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should login user and return tokens', async () => {
      const authLoginDto = { email: 'test@example.com', password: 'password' };
      const user = { ...mockeUser };
      const tokens = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      jest
        .spyOn(service, 'validateUserCredentials')
        .mockResolvedValue(mockeUser);
      jest.spyOn(service, 'issueTokens').mockResolvedValue(tokens);
      jest.spyOn(service, 'updateRefreshToken').mockResolvedValue();

      const result = await service.login(authLoginDto);

      expect(result).toEqual({ user, tokens });
      expect(service.validateUserCredentials).toHaveBeenCalledWith(
        authLoginDto.email,
        authLoginDto.password,
      );
      expect(service.issueTokens).toHaveBeenCalledWith(user);
      expect(service.updateRefreshToken).toHaveBeenCalledWith(
        user.id,
        tokens.refreshToken,
      );
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(service, 'validateUserCredentials').mockResolvedValue(null);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrongPassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUserCredentials', () => {
    it('should return user if credentials are valid', async () => {
      const user = { ...mockeUser };
      mockUserRepository.findUserByEmail.mockResolvedValue(user);
      //   jest.spyOn(bcrypt, 'compare').mock(() => true);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      const result = await service.validateUserCredentials(
        mockLoginUser.email,
        mockLoginUser.password,
      );

      expect(result).toEqual(user);
      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
        mockLoginUser.email,
      );
    });

    it('should return null if credentials are invalid', async () => {
      const email = 'test@example.com';
      const password = 'password';
      mockUserRepository.findUserByEmail.mockResolvedValue(null);

      const result = await service.validateUserCredentials(email, password);

      expect(result).toBeNull();
    });
  });

  describe('issueTokens', () => {
    it('should generate and return tokens', async () => {
      const user = { ...mockeUser };
      const accessToken = 'accessToken';
      const refreshToken = 'refreshToken';

      mockJwtService.signAsync
        .mockResolvedValueOnce(accessToken)
        .mockResolvedValueOnce(refreshToken);

      const result = await service.issueTokens(mockeUser);

      expect(result).toEqual({
        accessToken: `Bearer ${accessToken}`,
        refreshToken: `Bearer ${refreshToken}`,
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateRefreshToken', () => {
    it('should hash and store refresh token in cache', async () => {
      const userId = '1';
      const refreshToken = 'refreshToken';
      const hashedToken = 'hashedToken';

      // jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedToken);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(hashedToken));

      mockConfigService.get.mockReturnValue('7d');

      await service.updateRefreshToken(userId, refreshToken);

      expect(mockCacheManager.set).toHaveBeenCalledWith(
        `refresh-${userId}`,
        hashedToken,
        7 * 86400 * 1000,
      );
    });
  });

  describe('refreshTokens', () => {
    it('should validate and issue new tokens', async () => {
      const userId = '1';
      const refreshToken = 'refreshToken';
      const hashedToken = 'hashedToken';
      const user = { ...mockeUser };
      const tokens = {
        accessToken: 'accessToken',
        refreshToken: 'newRefreshToken',
      };

      mockUserRepository.findByIdOrFail.mockResolvedValue(user);
      mockCacheManager.get.mockResolvedValue(hashedToken);
      //   jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      jest.spyOn(service, 'issueTokens').mockResolvedValue(tokens);
      jest.spyOn(service, 'updateRefreshToken').mockResolvedValue();

      const result = await service.refreshTokens(userId, refreshToken);

      expect(result).toEqual(tokens);
      expect(service.issueTokens).toHaveBeenCalledWith(user);
      expect(service.updateRefreshToken).toHaveBeenCalledWith(
        userId,
        tokens.refreshToken,
      );
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const userId = '1';
      const refreshToken = 'invalidToken';

      mockUserRepository.findByIdOrFail.mockResolvedValue({ id: userId });
      mockCacheManager.get.mockResolvedValue('hashedToken');
      //   jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(service.refreshTokens(userId, refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
