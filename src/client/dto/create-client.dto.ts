import {
  IsEmail,
  MinLength,
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsNotEmpty,
  Matches,
} from 'class-validator';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class CreateClientDto {
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

  @IsInt()
  @IsOptional()
  height?: number;

  @IsInt()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsString()
  @IsNotEmpty()
  cardName?: string;

  @Matches(/^\d{16}$/, {
    message: 'Card number must be exactly 16 digits',
  })
  @IsNotEmpty()
  cardNumber?: string;

  @Matches(/^\d{2}\/\d{4}$/, {
    message: 'Expiry date must be in the format MM/YYYY',
  })
  @IsNotEmpty()
  expiryDate?: string;

  @Matches(/^\d{3}$/, {
    message: 'CVV must be exactly 3 digits',
  })
  @IsNotEmpty()
  cvv?: string;
}
