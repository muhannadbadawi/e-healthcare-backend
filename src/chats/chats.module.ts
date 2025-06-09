import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chats, ChatsSchema } from './chats.schema';
import { ChatsService } from './chats.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chats.name, schema: ChatsSchema }]),
  ],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
