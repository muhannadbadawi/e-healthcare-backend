import {
  IsEmail,
  IsString,
  IsInt,
  Min,
  MinLength,
  MaxLength,
  IsIn,
  Length,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsInt()
  @Min(0)
  age: number;

  @IsIn(['male', 'female'])
  gender: string;

  @IsString()
  @MinLength(6)
  address: string;

  @IsString()
  height: string; // or change to number if needed

  @IsString()
  weight: string; // or change to number if needed

  @IsString()
  allergies: string;

  @IsString()
  @MinLength(16)
  @MaxLength(16)
  cardNumber: string;

  @IsString()
  cardName: string;

  @IsString()
  expiryDate: string;

  @IsString()
  @Length(3, 4)
  cvv: string;

  @IsIn(['client', 'admin', 'doctor'])
  role: string;
}
