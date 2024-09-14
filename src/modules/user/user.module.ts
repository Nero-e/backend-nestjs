import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { userController } from './controllers/user.controller';
import { UserService } from './services/user.services';
import { RoleService } from '../role/services/role.service';
import { RolesModule } from '../role/role.module';
import { PasswordService } from './services/password.services';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesModule],
  controllers: [userController],
  providers: [UserService, PasswordService],
  exports: [UserService],
})
export class UsersModule {}
