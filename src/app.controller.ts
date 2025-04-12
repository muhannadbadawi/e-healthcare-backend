// app.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './user.schema';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<string | { token: string }> {
    const { email, password } = loginDto;
    const result = await this.appService.login(email, password);
    if (typeof result === 'string') {
      throw new Error(result); // Handle error appropriately
    }
    return result; // Return the token
  }

  @Post('/registerClient')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.appService.registerClient(
      registerDto.email,
      registerDto.password,
      registerDto.name,
      registerDto.age,
      registerDto.gender,
      registerDto.role,
    );
  }
}
