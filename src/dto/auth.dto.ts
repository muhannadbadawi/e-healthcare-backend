// auth.dto.ts
import { IsEmail, IsString, MinLength, Min, IsIn } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsString()
  @MinLength(6)
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @Min(0)
  age: string;

  @IsIn(['male', 'female'])
  gender: string;

  @IsString()
  @MinLength(6)
  address: string;

  @IsString()
  height: string;

  @IsString()
  weight: string;

  @IsString()
  allergies: string;

  @IsString()
  @MinLength(16)
  cardNumber: string;

  @IsString()
  cardName: string;

  @IsString()
  expiryDate: string;

  @IsString()
  cvv: string;

  @IsIn(['client', 'admin', 'doctor'])
  @IsString()
  role: string;
}
