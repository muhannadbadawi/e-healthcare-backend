import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateAdminDto {
  @IsString()
  @IsNotEmpty()
  currentPassword?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  newPassword?: string;
}
