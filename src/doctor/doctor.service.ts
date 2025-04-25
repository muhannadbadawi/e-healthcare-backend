import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './doctor.schema';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
  ) {}

  // Ensure this method exists
  async create(createDoctorDto: any): Promise<Doctor> {
    const doctor = new this.doctorModel(createDoctorDto);
    return doctor.save();
  }

  async findByEmail(email: string): Promise<Doctor | null> {
    return this.doctorModel.findOne({ email });
  }

  async getDoctors() {
    return this.doctorModel.find();
  }

  async getDoctorsCount() {
    return this.doctorModel.countDocuments();
  }
}
