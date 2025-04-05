// app.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './user.schema';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<string> {
    return this.appService.login(loginDto.email, loginDto.password);
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.appService.register(
      registerDto.email,
      registerDto.password,
      registerDto.name,
      registerDto.age,
      registerDto.gender,
    );
  }
}
