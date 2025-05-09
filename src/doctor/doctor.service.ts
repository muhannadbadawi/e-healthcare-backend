import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from './doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private readonly doctorModel: Model<DoctorDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(createDoctorDto: Partial<Doctor>): Promise<DoctorDocument> {
    const doctor = new this.doctorModel(createDoctorDto);
    return doctor.save();
  }

  findByEmail(email: string): Promise<Doctor | null> {
    return this.doctorModel.findOne({ email });
  }

  getDoctors(): Promise<Doctor[]> {
    return this.doctorModel.find();
  }

  getDoctorsCount(): Promise<number> {
    return this.doctorModel.countDocuments();
  }

  async getDoctorById(id: string): Promise<Doctor | null> {
    return this.doctorModel.findById(id).exec();
  }

  async updateDoctor(id: string, updateDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const updatedDoctor = await this.doctorModel.findByIdAndUpdate(id, updateDoctorDto, { new: true });
    if (!updatedDoctor?.email) throw new NotFoundException('Updated doctor or email not found');

    const updatedUser = await this.usersService.updateUser(updatedDoctor.email, {
      name: updateDoctorDto.name,
      password: updateDoctorDto.password,
      role: 'doctor',
    });

    if (!updatedUser) throw new NotFoundException('User not found');

    return updatedDoctor;
  }

  deleteDoctor(id: string) {
    return this.doctorModel.findByIdAndDelete(id);
  }

  async groupDoctorsBySpecialty(): Promise<{ specialty: string; doctors: Doctor[] }[]> {
    return this.doctorModel.aggregate([
      { $group: { _id: '$specialty', doctors: { $push: '$$ROOT' } } },
      { $project: { _id: 0, specialty: '$_id', doctors: 1 } },
    ]);
  }
}