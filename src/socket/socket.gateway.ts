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
// import { ClientService } from 'src/client/client.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // constructor(private readonly clientService: ClientService) {}

  @WebSocketServer() server!: Server;

  private userSockets = new Map<string, string>(); // userId -> socketId

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets.set(userId, client.id);
      client.data.userId = userId;

      // بث أن هذا الطبيب أصبح "online"
      this.server.emit('doctorStatusUpdate', {
        doctorId: userId,
        status: 'online',
      });

      console.log(`User ${userId} connected with socket ID ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);

        // بث أن هذا الطبيب أصبح "offline"
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
      this.server.emit('doctorStatusUpdate', {
        doctorId: userId,
        status: 'busy',
      });
      console.log(`User ${userId} is now busy`);
    }
  }

  @SubscribeMessage('setOnline')
  handleSetOnline(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    console.log("setOnline userId: ", userId);
    if (userId) {
      this.server.emit('doctorStatusUpdate', {
        doctorId: userId,
        status: 'online',
      });
      console.log(`User ${userId} is now online`);
    }
  }

  @SubscribeMessage('chatRequest')
  handleChatRequest(
    @MessageBody() data: { recipientId: string; requestType: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const recipientSocketId = this.userSockets.get(data.recipientId);
    // const clientData = this.clientService.getClientById(client.data.userId);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('chatRequest', {
        from: client.data.userId,
        requestType: data.requestType,
      });
    }
  }

  @SubscribeMessage('privateMessage')
  handlePrivateMessage(
    @MessageBody() data: { recipientId: string; message: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const recipientSocketId = this.userSockets.get(data.recipientId);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('message', {
        from: client.data.userId,
        message: data.message,
      });
    }
  }

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(room);
    console.log(`Client joined room: ${room}`);
  }

  @SubscribeMessage('leave')
  handleLeave(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.leave(room);
    console.log(`Client left room: ${room}`);
  }

  @SubscribeMessage('getOnlineUsers')
  handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
    const onlineUserIds = Array.from(this.userSockets.keys());
    client.emit('onlineUsers', onlineUserIds); // رد على العميل فقط
  }
}
