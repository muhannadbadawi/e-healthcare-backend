import {
  IsEmail,
  MinLength,
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @MinLength(6)
  @IsNotEmpty()
  password?: string;

  @IsInt()
  @IsNotEmpty()
  age?: number;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender?: Gender;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNotEmpty()
  @IsString()
  specialty?: string;
}
