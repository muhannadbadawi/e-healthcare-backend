import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin, AdminSchema } from './admin.schema';
import { UsersModule } from 'src/users/users.module';
import { ClientModule } from 'src/client/client.module'; // Import ClientModule here
import { DoctorModule } from 'src/doctor/doctor.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    UsersModule,
    ClientModule,
    DoctorModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
