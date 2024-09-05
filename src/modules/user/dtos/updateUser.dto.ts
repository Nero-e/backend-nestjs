import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  public name: string;

  @IsOptional()
  @IsString()
  public email: string;

  @IsOptional()
  @IsString()
  public username: string;

  @IsOptional()
  @IsBoolean()
  public isActive: boolean;
}

// export class CreateUserDto extends PartialType(UpdateUserDto) {}
