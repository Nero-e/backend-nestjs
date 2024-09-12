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

  // Encontrar todos los usuarios
  public findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Encontrar un usuario por ID
  public async findUser(idUser: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { idUser: idUser },
    });
    console.log(idUser);
    if (!user) {
      return null;
    }

    // Si existe, devuelve el usuario
    return user;
  }

  // Encontrar un usuario por email
  public findUserByEmail(emailData: string): Promise<User | undefined> {
    const email = this.userRepository.findOne({ where: { email: emailData } });

    return email;
  }

  // Crear un nuevo usuario
  public async createUser(data: CreateUserDto): Promise<User | null> {
    try {
      const { email } = data;
      const user = await this.findUserByEmail(email);

      if (user) {
        return null;
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

      return result;
    } catch (error) {
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  // Actualizar un usuario existente
  public async updateUser(
    idUser: number,
    data: Partial<UpdateUserDto>,
  ): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { idUser: idUser },
      });

      if (!user) {
        return null;
      }

      if (data.isActive && user.isDeleted) {
        user.isDeleted = false;
      }

      const updatedUser = this.userRepository.merge(user, data);
      await this.userRepository.save(updatedUser);

      return user;
    } catch (error) {
      throw new BadRequestException('Error al actualizar el usuario');
    }
  }

  // Eliminar (soft) un usuario existente
  public async deleteUser(idUser: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { idUser: idUser },
    });
    if (!user) {
      return null;
    }
    user.isActive = false;
    user.isDeleted = true;
    await this.userRepository.save(user);
    return user;
  }
}
