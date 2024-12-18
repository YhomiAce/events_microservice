import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { UsersRepository } from './repository';
import { UserController } from './controllers';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UsersRepository],
  exports: [UsersRepository]
})
export class UserModule {}
