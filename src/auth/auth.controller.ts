import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateClientDto } from '../client/dto/create-client.dto';
import { LoginDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateClientDto) {
    return this.authService.register(dto);
  }

  @Post('addAdmin')
  async addAdmin(@Body() dto: CreateAdminDto) {
    return this.authService.addAdmin(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // مثال على راوت محمي باستخدام JWT فقط
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(
    @Request() req: { user: { id: string; email: string; role: string } },
  ) {
    return req.user;
  }

  // مثال على راوت محمي باستخدام JWT و Roles
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('admin-only')
  adminData(
    @Request() req: { user: { id: string; email: string; role: string } },
  ) {
    return { message: 'You are an admin', user: req.user };
  }
}
