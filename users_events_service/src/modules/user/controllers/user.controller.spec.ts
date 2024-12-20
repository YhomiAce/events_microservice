import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services';
import { UserController } from './user.controller';
import { mockeUser, mockUpdateUserDto } from '../../../_mock_/test.mock';

const mockUserService = {
  updateProfile: jest.fn().mockResolvedValue({...mockeUser, ...mockUpdateUserDto}),
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('userProfile', () => {
    it('should return the current user', async () => {
      const result = controller.userProfile(mockeUser);

      expect(result.data).toEqual(mockeUser);
    });
  });

  describe('updateUserProfile', () => {
    it('should update a user profile', async () => {
      const result = await controller.updateUserProfile(
        mockeUser,
        mockUpdateUserDto,
      );
      expect(service.updateProfile).toHaveBeenCalledWith(
        mockeUser,
        mockUpdateUserDto,
      );
      expect(result.data.fullName).toEqual(mockUpdateUserDto.fullName);
    });
  });
});
