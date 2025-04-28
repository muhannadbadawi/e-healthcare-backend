import { IsEmail, MinLength, IsString, IsNotEmpty } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @MinLength(6)
  @IsNotEmpty()
  password?: string;
}
