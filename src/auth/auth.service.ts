import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/auth.dto';
import { UserDocument } from 'src/users/user.schema';
import { ClientService } from 'src/client/client.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly clientService: ClientService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    await this.usersService.create({
      ...dto,
      role: 'client',
    });

    await this.clientService.create({
      ...dto,
      role: 'client',
    });
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    console.log(user);
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
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
