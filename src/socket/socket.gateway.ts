// socket.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server!: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): void {
    console.log('Received message:', data);
    this.server.emit('message', data); // Broadcast the message to all connected clients
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() room: string, @ConnectedSocket() client: Socket): void {
    client.join(room);
    console.log(`Client joined room: ${room}`);
  }

  @SubscribeMessage('leave')
  handleLeave(@MessageBody() room: string, @ConnectedSocket() client: Socket): void {
    client.leave(room);
    console.log(`Client left room: ${room}`);
  }
}
