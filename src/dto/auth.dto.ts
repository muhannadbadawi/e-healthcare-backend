/* eslint-disable @typescript-eslint/no-unsafe-call */
// auth.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  IsInt,
  Min,
  IsIn,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  age: number;

  @IsIn(['male', 'female', 'other'])
  gender: string;

  @IsIn(['client', 'admin', 'doctor'])
  @IsString()
  role: string;
  constructor() {
    this.role = 'client';
  }
}
