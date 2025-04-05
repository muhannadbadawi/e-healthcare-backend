import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema'; // Import User Schema

@Module({
  imports: [
    JwtModule.register({
      secret: 'super-secret-cut',
      signOptions: { expiresIn: '1h' }, // Add expiration for security
    }),
    MongooseModule.forRoot('mongodb://localhost/E-Healthcare'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Register User model
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
