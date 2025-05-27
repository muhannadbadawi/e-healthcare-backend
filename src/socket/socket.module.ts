// src/socket/socket.module.ts

import { Module } from '@nestjs/common';
import { ChatGateway } from './socket.gateway';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class SocketModule {}
