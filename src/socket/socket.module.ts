// src/socket/socket.module.ts

import { Module } from '@nestjs/common';
import { ChatGateway } from './socket.gateway';
import { UsersModule } from 'src/users/users.module';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [UsersModule, ChatsModule],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class SocketModule {}
