import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public findOne(idUser: number): Promise<User | undefined> {

    const user = this.userRepository.findOne({ where: { idUser: idUser } });
    if(!user) {
        throw new NotFoundException(`User with id ${idUser} not found`);
    }
    return user;
  }
}
