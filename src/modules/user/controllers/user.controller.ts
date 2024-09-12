import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  NotFoundException,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';

import { UserService } from '../services/user.services';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/createUser.dto';
import { UpdateUserDto } from '../dtos/updateUser.dto';
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller('users')
export class userController {
  public constructor(private readonly userService: UserService) {}

  @Get()
  public getUser(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':idUser')
  public async getUserById(idUser: number): Promise<User | undefined> {
    const user = await this.userService.findOne(idUser);

    if (!user) {
      throw new NotFoundException(`Usuario con id ${idUser} no encontrado`);
    }

    return user;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createUser(
    @Body() payload: CreateUserDto,
  ): Promise<ResponseDto<User>> {
    const user = await this.userService.createUser(payload);

    if (user) {
      throw new BadRequestException('El usuario ya existe');
    }

    return {
      success: true,
      message: 'Usuario creado correctamente',
      data: user,
    };
  }

  @Put(':idUser')
  @HttpCode(HttpStatus.OK)
  public async updateUser(
    @Param('idUser', ParseIntPipe) idUser: number,
    @Body() payload: UpdateUserDto,
  ): Promise<ResponseDto<User>> {
    const user = await this.userService.updateUser(idUser, payload);

    if (!user) {
      throw new NotFoundException(`El usuario ${idUser} no se encontro`);
    }

    return {
      success: true,
      message: 'Usuario actualizado correctamente',
      data: user,
    };
  }

  @Put('delete/:id')
  public async deleteUser(
    @Param('id', ParseIntPipe) idUser: number,
  ): Promise<ResponseDto<User>> {
    const user = await this.userService.deleteUser(idUser);

    if (!user) {
      throw new NotFoundException(`El usuario ${idUser} no se encontro`);
    }

    return {
      success: true,
      message: 'Usuario eliminado correctamente',
      data: user,
    };
  }
}
