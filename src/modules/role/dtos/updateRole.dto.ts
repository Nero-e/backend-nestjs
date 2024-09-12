import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  public name: string;
}
