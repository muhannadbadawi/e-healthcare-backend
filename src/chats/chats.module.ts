import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chats, ChatsSchema } from './chats.schema';
import { ChatsService } from './chats.service';
import { ChatsController } from './chat.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chats.name, schema: ChatsSchema }]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
