import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Client, ClientDocument } from './client.schema';
import { registerClientData } from './models/register-client-data';
@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    private jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<string | { token: string }> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return 'User not found';
    }

    const isMatch = password === user.password;
    if (!isMatch) {
      return 'Incorrect password';
    }
    return { token: this.signUser(user._id.toString(), user.email, user.role) };
  }

  async registerClient(registerClient: registerClientData): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: registerClient.email,
    });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Save in User table
    const newUser = new this.userModel({
      email: registerClient.email,
      password: registerClient.password,
      role: 'client',
    });
    const savedUser = await newUser.save();

    // Save in Client table
    const newClient = new this.clientModel(registerClient);
    await newClient.save();

    return savedUser;
  }

  signUser(userId: string, email: string, type: string): string {
    return this.jwtService.sign({ id: userId, email, role: type });
  }

  verifyUser(token: string) {
    const payload: { id: string; email: string; role: string } =
      this.jwtService.verify(token);
    return payload;
  }

  async getCounts() {
    const clientCount = await this.clientModel.countDocuments();
    const userCount = await this.userModel.countDocuments();
    const doctorCount = 0;
    return { clientCount, userCount, doctorCount };
  }
}
