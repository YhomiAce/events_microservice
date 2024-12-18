import { Injectable } from '@nestjs/common';
import { EntityRepository } from '../../core/base.classes/entity.repository';
import { User } from '../../../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository extends EntityRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {
    super(repository);
  }

  /**
   * Find user by email
   * Email is unique field
   *
   * @async
   * @param {string} email
   * @returns {Promise<User>}
   */
  async findUserByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ where: { email } });
    return user;
  }
}
