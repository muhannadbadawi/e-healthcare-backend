import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chats, ChatsDocument } from './chats.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chats.name) private chatsModel: Model<ChatsDocument>,
  ) {}

  create(createUserDto: Partial<Chats>): Promise<ChatsDocument> {
    const user = new this.chatsModel(createUserDto);
    return user.save();
  }
}
