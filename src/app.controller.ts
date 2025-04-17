// app.controller.ts
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './user.schema';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { registerClientData } from './models/register-client-data';
import { HttpCode } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const result = await this.appService.login(email, password);
    if (typeof result === 'string') {
      throw new HttpException(result, HttpStatus.UNAUTHORIZED);
    }
    return result;
  }

  @Post('/registerClient')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    const clientData: registerClientData = { ...registerDto };
    return this.appService.registerClient(clientData);
  }

  @Post('/getCounts')
  async(@Body() requist: { token: string }) {
    const { token } = requist;
    console.log(token);
    const payload = this.appService.verifyUser(token);
    console.log(payload);

    if (!payload) {
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    }

    if (payload.role !== 'admin') {
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    }

    const counts = this.appService.getCounts();
    return counts;
  }
}
