// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // Ensure this method exists
  async create(CreateUserDto: any): Promise<User> {
    const user = new this.userModel(CreateUserDto);
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async deleteByEmail(email: string): Promise<{ deleted: boolean }> {
    const result = await this.userModel.deleteOne({ email }).exec();
    return { deleted: result.deletedCount > 0 };
  }

  async getUsersCount() {
    return this.userModel.countDocuments();
  }
}
