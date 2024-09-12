import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import { RoleService } from '../services/role.service';
import { Role } from '../entities/role.entity';
import { ResponseDto } from 'src/common/dto/response.dto';
import { UpdateRoleDto } from '../dtos/updateRole.dto';

@Controller('role')
export class RoleController {
  public constructor(private readonly roleService: RoleService) {}

  @Get()
  public async getAllRoles(): Promise<Role[]> {
    return await this.roleService.findAll();
  }

  @Get(':idrole')
  public async getRoleById(idRole: number): Promise<Role | undefined> {
    const role = await this.roleService.findOne(idRole);
    if (!role) {
      throw new NotFoundException(`Rol con id ${idRole} encontrado`);
    }
    return role;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createRole(
    @Body() payload: Partial<Role>,
  ): Promise<ResponseDto<Role>> {
    const role = await this.roleService.createRole(payload);
    if (!role) {
      throw new BadRequestException('El rol ya existe');
    }

    return {
      success: true,
      message: 'Rol creado correctamente',
      data: role,
    };
  }

  @Put(':idRole')
  @HttpCode(HttpStatus.OK)
  public async updateRole(
    @Param('idRole', ParseIntPipe) idRole: number,
    @Body() payload: UpdateRoleDto,
  ): Promise<ResponseDto<Role>> {
    const role = await this.roleService.updateRole(idRole, payload);
    if (!role) {
      throw new BadRequestException(`El rol con id ${idRole} no se encontro`);
    }
    return {
      success: true,
      message: 'Rol actualizado correctamente',
      data: role,
    };
  }

  @Delete(':idRole')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteRole(
    @Param('idRole', ParseIntPipe) idRole: number,
  ): Promise<{ deleted: boolean; message: string }> {
    const role = await this.roleService.deleteRole(idRole);
    if (!role) {
      throw new NotFoundException(`El rol con id ${idRole} no se encontro`);
    }
    return {
      deleted: true,
      message: 'Rol eliminado correctamente',
    };
  }
}
