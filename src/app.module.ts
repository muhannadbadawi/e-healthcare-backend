import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientModule } from './client/client.module';
import { AdminModule } from './admin/admin.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ClientModule,
    SocketModule,
    AdminModule,
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigService available app-wide
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE'),
      }),
    }),
  ],
})
export class AppModule {}
