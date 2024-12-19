import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repository';
import { User } from 'src/entities';
import { UpdateUserDto } from '../dtos';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UsersRepository) {}

  /**
   * Update User profile
   *
   * @async
   * @param {User} user
   * @param {UpdateUserDto} userData
   * @returns {Promise<User>}
   */
  async updateProfile(user: User, userData: UpdateUserDto): Promise<User> {
    const profile = await this.userRepository.update(user.id, userData);
    return profile;
  }
}
