import { Test, TestingModule } from '@nestjs/testing';
import {
  mockeUser,
  mockUpdateUserDto,
  mockNewUser,
  mockLoginUser,
  mockLoginResponse,
  mockTokens,
} from '../../../_mock_/test.mock';
import { AuthController } from './auth.controller';
import { AuthService } from '../services';
import { AppStrings } from '../../../common/messages/app.strings';

const mockAuthService = {
  register: jest.fn().mockResolvedValue(mockeUser),
  login: jest.fn().mockResolvedValue(mockLoginResponse),
  refreshTokens: jest.fn().mockResolvedValue(mockTokens),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const result = await controller.register(mockNewUser);
      mockAuthService.register.mockResolvedValue(mockeUser);
      expect(service.register).toHaveBeenCalledWith(mockNewUser);
      expect(result.message).toEqual(AppStrings.USER_CREATED);
      expect(result.data).toEqual(mockeUser);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const result = await controller.login(mockLoginUser);
      mockAuthService.login.mockResolvedValue(mockLoginResponse);
      expect(service.login).toHaveBeenCalledWith(mockLoginUser);
      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens', async () => {
      const mockRequest = {
        user: { sub: '1', refreshToken: 'refresh-token' },
      };
      const result = await controller.refreshTokens(mockRequest);
      mockAuthService.refreshTokens.mockResolvedValue(mockTokens);
      expect(service.refreshTokens).toHaveBeenCalledWith(
        mockRequest.user.sub,
        mockRequest.user.refreshToken,
      );
      expect(result).toEqual(mockTokens);
    });
  });
});
