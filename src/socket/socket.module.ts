// src/socket/socket.module.ts

import { Module } from '@nestjs/common';
import { ChatGateway } from './socket.gateway';
import { UsersModule } from 'src/users/users.module';
import { ChatsModule } from 'src/chats/chats.module';
import { DoctorModule } from 'src/doctor/doctor.module';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [UsersModule, ChatsModule, DoctorModule, ClientModule],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class SocketModule {}
