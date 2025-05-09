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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  private userSockets = new Map<string, string>(); // userId -> socketId

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets.set(userId, client.id);
      client.data.userId = userId; // تخزين userId داخل socket
      console.log(`User ${userId} connected with socket ID ${client.id}`);
    }
  }
  

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
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
        from: client.id,
        message: data.message,
      });
    }
  }

  @SubscribeMessage('chatRequest')
  handleChatRequest(
    @MessageBody() data: { recipientId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const recipientSocketId = this.userSockets.get(data.recipientId);
    console.log("client.id: " + client.id);
  
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('chatRequest', {
        from: client.data.userId, // إرسال userId الحقيقي بدل socket.id
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
}
