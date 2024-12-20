import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UsersRepository } from '../repository';
import { mockeUser, mockUpdateUserDto } from '../../../_mock_/test.mock';

// Mock dependencies
const mockUserRepository = {
  update: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UsersRepository, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateProfile', () => {
    it('should update user profile and return user data', async () => {
        const resolvedValue = { ...mockeUser, ...mockUpdateUserDto }
      mockUserRepository.update.mockResolvedValue(resolvedValue);

      const result = await service.updateProfile(mockeUser, mockUpdateUserDto);
      expect(result).toEqual({ ...mockeUser, ...mockUpdateUserDto });
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        mockeUser.id,
        mockUpdateUserDto,
      );
    });
  });
});
