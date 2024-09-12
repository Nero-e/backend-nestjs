import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '../entities/role.entity';
import { UpdateRoleDto } from '../dtos/updateRole.dto';

@Injectable()
export class RoleService {
  public constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  public findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  public async findOne(idRole: number): Promise<Role | null> {
    const role = await this.roleRepository.findOne({
      where: { idRole: idRole },
    });

    if (!role) {
      return null;
    }

    return role;
  }

  public findByName(name: string): Promise<Role | undefined> {
    const roleName = this.roleRepository.findOne({ where: { name: name } });

    return roleName;
  }

  public async createRole(data: Partial<Role>): Promise<Role | null> {
    const { name } = data;
    const roleName = await this.findByName(name);

    if (roleName) {
      return null;
    }

    const role = await this.roleRepository.save(data);

    return role;
  }

  public async updateRole(
    idRole: number,
    data: UpdateRoleDto,
  ): Promise<Role | null> {
    const role = await this.roleRepository.findOne({
      where: { idRole: idRole },
    });

    if (!role) {
      return null;
    }

    const updatedRole = this.roleRepository.merge(role, data);
    await this.roleRepository.save(updatedRole);

    return role;
  }

  public async deleteRole(idRole: number): Promise<{ deleted: boolean }> {
    try {
      const role = await this.roleRepository.findOne({
        where: { idRole: idRole },
      });

      if (!role) {
        return null;
      }
      await this.roleRepository.delete(idRole);

      return { deleted: true };
    } catch (error) {
      throw new BadRequestException('Error al eliminar el rol');
    }
  }
}
