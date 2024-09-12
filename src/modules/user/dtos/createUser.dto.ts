import { IsString, IsNotEmpty, IsEmail, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public readonly name?: string;

  @IsEmail()
  @IsNotEmpty()
  public readonly email?: string;

  @IsString()
  @IsNotEmpty()
  public readonly username?: string;

  @IsNumber()
  @IsNotEmpty()
  public readonly role?: number;

  @IsString()
  @IsNotEmpty()
  public readonly password?: string;
}
