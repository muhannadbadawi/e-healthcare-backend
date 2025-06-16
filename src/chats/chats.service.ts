import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chats, ChatsDocument } from './chats.schema';
import { Model } from 'mongoose';
import { GetHistoryByUserIdDto } from './dto/chats.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chats.name) private chatsModel: Model<ChatsDocument>,
  ) {}

  create(createUserDto: Partial<Chats>): Promise<ChatsDocument> {
    const user = new this.chatsModel(createUserDto);
    return user.save();
  }

  getByUserId(dto: GetHistoryByUserIdDto): Promise<ChatsDocument | null> {
    if(dto.role === "doctor"){
      return this.chatsModel.findOne({doctorId: dto.userId}).exec();
    }
    return this.chatsModel.findOne({clientId: dto.userId}).exec();
  }
}
