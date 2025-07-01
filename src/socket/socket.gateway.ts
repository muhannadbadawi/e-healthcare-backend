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
import { ChatsService } from 'src/chats/chats.service';
import { ClientService } from 'src/client/client.service';
import { DoctorService } from 'src/doctor/doctor.service';
import { UsersService } from 'src/users/users.service';
type DoctorStatus = 'online' | 'offline' | 'busy';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  private userSockets = new Map<string, { socketId: string; status: string }>();
  constructor(
    private readonly usersService: UsersService,
    private readonly chatsService: ChatsService,
    private readonly doctorService: DoctorService,
    private readonly clientService: ClientService,
  ) {}

  async getUserBySocketId(
    socketId: string,
  ): Promise<
    | { socketId: string; status: string; userId: string; role: string }
    | undefined
  > {
    for (const [userId, userData] of this.userSockets.entries()) {
      if (userData.socketId === socketId) {
        const user = await this.usersService.findById(userId);
        return {
          socketId: userData.socketId,
          status: userData.status,
          userId: userId,
          role: user?.role ?? '',
        };
      }
    }
    return undefined;
  }
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
    @ConnectedSocket() user: Socket,
  ): Promise<void> {
    const socketsInRoom = this.server.sockets.adapter.rooms.get(
      payload.roomName,
    );
    let doctor;
    let client;
    if (socketsInRoom) {
      for (const socketId of socketsInRoom) {
        if (socketId !== user.id) {
          const otherSocket = this.server.sockets.sockets.get(socketId);
          if (otherSocket) {
            await otherSocket.leave(payload.roomName);
            otherSocket.emit('leftRoom', payload.roomName);
          }
        }
        const targetUser = await this.getUserBySocketId(socketId);
        if (targetUser?.role === 'doctor') {
          doctor = targetUser;
        } else {
          client = targetUser;
        }
      }
      const endAt = new Date();
      const createdAt = new Date(endAt.getTime() - payload.seconds * 1000);
      console.log('doctor: ', doctor);
      console.log('client: ', client);

      if (doctor && doctor.userId && client && client.userId) {
        const targetDoctor = await this.doctorService.findByUserId(
          doctor.userId,
        );
        const targetClient = await this.clientService.findByUserId(
          client.userId,
        );
        console.log('targetClient: ', targetClient);
        console.log('targetDoctor: ', targetDoctor);

        if (targetDoctor && targetClient) {
          await this.chatsService.create({
            clientName: targetClient.name,
            doctorName: targetDoctor.name,
            doctorId: doctor.userId,
            clientId: client.userId,
            createdAt,
            endAt,
          });
        } else {
          console.warn(
            'Doctor or Client not found in DB, chat record not created.',
          );
        }
      }
    }
    await user.leave(payload.roomName);
  }

  @SubscribeMessage('getDoctorStatuses')
  async handleGetDoctorStatuses(@ConnectedSocket() client: Socket) {
    const doctors = await this.doctorService.getDoctors();

    const statuses = doctors.map((doc) => {
      const statusData = this.userSockets.get(doc.userId.toString());
      let status: DoctorStatus = 'offline';

      if (statusData?.status === 'online') status = 'online';
      else if (statusData?.status === 'busy') status = 'busy';

      return {
        doctorId: doc.userId.toString(),
        name: doc.name,
        specialty: doc.specialty,
        status,
      };
    });

    client.emit('allDoctorStatuses', statuses);
  }

  @SubscribeMessage('getOnlineUsers')
  handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
    const onlineUserIds = Array.from(this.userSockets.entries())
      .filter(([_, data]) => data.status === 'online')
      .map(([userId]) => userId);

    client.emit('onlineUsers', onlineUserIds);
  }
}

