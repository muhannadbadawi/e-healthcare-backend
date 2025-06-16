import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chats, ChatsDocument } from './chats.schema';

@Injectable()
export class MessagesRepository {
  constructor(@InjectModel(Chats.name) private chatsModel: Model<ChatsDocument>) {}

    async findByClientId(clientId: string): Promise<ChatsDocument | null> {
      return this.chatsModel.findOne({ clientId }).exec();
    }
}
