import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(createUserDto: Partial<User>): Promise<UserDocument> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }
  
  findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }
  
  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async deleteByEmail(email: string): Promise<{ deleted: boolean }> {
    const result = await this.userModel.deleteOne({ email }).exec();
    return { deleted: result.deletedCount > 0 };
  }

  updateUser(email: string, updateUserDto: Partial<UserDocument>): Promise<UserDocument | null> {
    return this.userModel.findOneAndUpdate({ email }, updateUserDto, { new: true });
  }

  getUsersCount(): Promise<number> {
    return this.userModel.countDocuments();
  }
}