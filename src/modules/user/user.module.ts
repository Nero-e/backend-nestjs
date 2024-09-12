import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { userController } from './controllers/user.controller';
import { UserService } from './services/user.services';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [userController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
