import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  private userSockets = new Map<string, { socketId: string; status: string }>();
  constructor(private readonly usersService: UsersService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    if (userId) {
      this.userSockets.set(userId, {
        socketId: client.id,
        status: 'online',
      });

      client.data.userId = userId;

      this.server.emit('doctorStatusUpdate', {
        doctorId: userId,
        status: 'online',
      });

      console.log(`User ${userId} connected with socket ID ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, userData] of this.userSockets.entries()) {
      if (userData.socketId === client.id) {
        this.userSockets.delete(userId);

        this.server.emit('doctorStatusUpdate', {
          doctorId: userId,
          status: 'offline',
        });

        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  @SubscribeMessage('setBusy')
  handleSetBusy(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;

    if (userId) {
      const userData = this.userSockets.get(userId);

      if (userData) {
        this.userSockets.set(userId, {
          ...userData,
          status: 'busy',
        });
        console.log('busy: ');

        this.server.emit('doctorStatusUpdate', {
          doctorId: userId,
          status: 'busy',
        });

        console.log(`User ${userId} is now busy`);
      }
    }
  }

  @SubscribeMessage('setOnline')
  handleSetOnline(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;

    if (userId) {
      const userData = this.userSockets.get(userId);

      if (userData) {
        this.userSockets.set(userId, {
          ...userData,
          status: 'online',
        });

        this.server.emit('doctorStatusUpdate', {
          doctorId: userId,
          status: 'online',
        });

        console.log(`User ${userId} is now online`);
      }
    }
  }

  @SubscribeMessage('chatRequest')
  async handleChatRequest(
    @MessageBody() data: { recipientId: string; requestType: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const recipientSocket = this.userSockets.get(data.recipientId);
    const recipientUser = await this.usersService.findById(client.data.userId);

    if (recipientSocket) {
      this.server.to(recipientSocket.socketId).emit('chatRequest', {
        from: client.data.userId,
        name: recipientUser?.name,
        requestType: data.requestType,
      });
    }
  }

  @SubscribeMessage('privateMessage')
  handlePrivateMessage(
    @MessageBody()
    data: { recipientId: string; roomName: string; message: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const recipientSocket = this.userSockets.get(data.recipientId);
    const socketsInRoom = this.server.sockets.adapter.rooms.get(data.roomName);
    let isRecipientInRoom = false;
    if (recipientSocket) {
      isRecipientInRoom = socketsInRoom?.has(recipientSocket.socketId) ?? false;
      this.server.to(recipientSocket.socketId).emit('message', {
        from: client.data.userId,
        message: data.message,
      });
    }
    console.log(`Is recipient in room? ${isRecipientInRoom}`);
  }

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log('client: ', client.data.userId);
    client.join(room);
    console.log(`Client joined room: ${room}`);
  }

@SubscribeMessage('leave')
async handleLeave(
  @MessageBody() payload: { roomName: string; seconds: number },
  @ConnectedSocket() client: Socket,
): Promise<void> {
  const socketsInRoom = this.server.sockets.adapter.rooms.get(payload.roomName);

  if (socketsInRoom) {
    for (const socketId of socketsInRoom) {
      if (socketId !== client.id) {
        const otherSocket = this.server.sockets.sockets.get(socketId);
        if (otherSocket) {
          await otherSocket.leave(payload.roomName);
          console.log(payload.seconds);
          console.log(`Other client (${socketId}) also left room: ${payload.roomName}`);
          otherSocket.emit('leftRoom', payload.roomName); 
        }
      }
    }
  }

  await client.leave(payload.roomName);
  console.log(`Client (${client.id}) left room: ${payload.roomName}`);
}


  @SubscribeMessage('getOnlineUsers')
  handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
    const onlineUserIds = Array.from(this.userSockets.entries())
      .filter(([_, data]) => data.status === 'online')
      .map(([userId]) => userId);

    client.emit('onlineUsers', onlineUserIds);
  }
}
