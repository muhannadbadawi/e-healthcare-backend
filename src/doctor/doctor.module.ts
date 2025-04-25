import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Doctor, DoctorSchema } from './doctor.schema';
import { DoctorService } from './doctor.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
  ],
  providers: [DoctorService],
  exports: [DoctorService],
})
export class DoctorModule {}
