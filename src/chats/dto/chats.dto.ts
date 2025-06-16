import { IsNotEmpty } from 'class-validator';

// src/auth/dto/login.dto.ts
export class GetHistoryByUserIdDto {
  @IsNotEmpty()
  userId?: string;

  @IsNotEmpty()
  role?: string;
}
