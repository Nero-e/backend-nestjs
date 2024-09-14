import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/createUser.dto';
import { RoleService } from 'src/modules/role/services/role.service';
import { UpdateUserDto } from '../dtos/updateUser.dto';
import { PasswordService } from './password.services';
import { Role } from 'src/modules/role/entities/role.entity';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly passwordService: PasswordService,
  ) {}

  // Encontrar todos los usuarios
  public findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['role'],
    });
  }

  // Encontrar un usuario por ID
  public async findUser(idUser: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { idUser: idUser },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${idUser} no encontrado`);
    }

    return user;
  }

  // Encontrar un usuario por email
  public async findUserByEmail(emailData: string): Promise<User | undefined> {
    const email = await this.userRepository.findOne({
      where: { email: emailData },
    });

    return email;
  }

  // Crear un nuevo usuario
  public async createUser(data: CreateUserDto): Promise<User | null> {
    try {
      const { email, idRole, password } = data;

      const existingUser = await this.findUserByEmail(email);
      if (existingUser) {
        throw new BadRequestException(
          `El usuario con email ${email} ya existe`,
        );
      }

      const role = await this.roleService.findOne(idRole);
      const hashedPassword = await this.passwordService.hashPassword(password);

      const newUser = this.userRepository.create({
        ...data,
        isActive: true,
        isDeleted: false,
        password: hashedPassword,
        role,
      });

      const savedUser = await this.userRepository.save(newUser);

      const { password: _, ...result } = savedUser;

      return result;
    } catch (error) {
      throw new BadRequestException(
        `Error al crear el usuario: ${error.message}`,
      );
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
        throw new NotFoundException(
          `El usuario con id ${idUser} no se encontro`,
        );
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
      throw new NotFoundException(`El usuario ${idUser} no se encontro`);
    }

    user.isActive = false;
    user.isDeleted = true;
    await this.userRepository.save(user);
    return user;
  }
}
