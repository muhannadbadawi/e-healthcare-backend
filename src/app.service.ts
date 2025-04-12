import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // Fixing the login method
  async login(
    email: string,
    password: string,
  ): Promise<string | { token: string }> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return 'Invalid credentials!';
    }

    if (user.password !== password) {
      return 'Invalid credentials!';
    }
    return { token: this.signUser(user._id.toString(), user.email, user.role) };
  }

  // Register method (unchanged)
  async registerClient(
    email: string,
    password: string,
    name: string,
    age: number,
    gender: string,
    role: string,
  ): Promise<User> {
    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const newUser = new this.userModel({
      email,
      password,
      name,
      age,
      gender,
      role,
    });
    return await newUser.save();
  }

  // Sign user to JWT (unchanged)
  signUser(userId: string, email: string, type: string): string {
    return this.jwtService.sign({
      id: userId,
      email,
      role: type,
    });
  }
}
