import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateClientDto } from '../client/dto/create-client.dto';
import { LoginDto } from './dto/auth.dto';
import { UserDocument } from 'src/users/user.schema';
import { ClientService } from 'src/client/client.service';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly clientService: ClientService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async addAdmin(dto: CreateAdminDto) {
    const user = (await this.usersService.create({
      ...dto,
      role: 'admin',
    })) as UserDocument;

    await this.adminService.create({
      ...dto,
      userId: user._id,
    });
  }

  async register(dto: CreateClientDto) {
    const user = (await this.usersService.create({
      ...dto,
      role: 'client',
    })) as UserDocument;

    await this.clientService.create({
      ...dto,
      userId: user._id,
      balance: 0,
    });
  }

  async login(dto: LoginDto) {
    if (!dto.email) {
      throw new UnauthorizedException('Email is required');
    }
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = dto.password === user.password;
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const userToGenerateToken = user as UserDocument;

    return this.generateToken(userToGenerateToken);
  }

  private generateToken(user: UserDocument) {
    const payload = {
      sub: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
