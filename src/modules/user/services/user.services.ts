import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/createUser.dto';
import { UpdateUserDto } from '../dtos/updateUser.dto';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async findOne(idUser: number): Promise<User | undefined> {
    const user = this.userRepository.findOne({ where: { idUser: idUser } });

    if (!user) {
      return null;
    }

    return user;
  }

  public findUserByEmail(emailData: string): Promise<User | undefined> {
    const email = this.userRepository.findOne({ where: { email: emailData } });

    return email;
  }

  public async createUser(
    data: CreateUserDto,
  ): Promise<{ success: boolean; message: string }> {
    const { email } = data;
    const user = await this.findUserByEmail(email);

    if (user) {
      return { success: false, message: 'El usuario ya existe' };
    }

    const newUser = this.userRepository.create({
      ...data,
      isActive: true,
      isDeleted: false,
    });

    const hashedPassword: string = await bcrypt.hash(data.password, 10);
    newUser.password = hashedPassword;

    const savedUser = await this.userRepository.save(newUser);
    const { password, ...result } = savedUser;

    return { success: true, message: 'Ok' };
  }

  public async updateUser(
    idUser: number,
    data: UpdateUserDto,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findOne({
      where: { idUser: idUser },
    });

    if (!user) {
      return {
        success: false,
        message: `El usuario con id ${idUser} no se encontro`,
      };
    }

    if (data.isActive && user.isDeleted) {
      user.isDeleted = false;
    }

    const updatedUser = this.userRepository.merge(user, data);
    await this.userRepository.save(updatedUser);

    return { success: true, message: 'Ok' };
  }
}
