import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Doctor, DoctorDocument } from './doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name)
    private readonly doctorModel: Model<DoctorDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(createDoctorDto: Partial<Doctor>): Promise<DoctorDocument> {
    const doctor = new this.doctorModel(createDoctorDto);
    return doctor.save();
  }

  findByEmail(email: string): Promise<Doctor | null> {
    return this.doctorModel.findOne({ email });
  }

  findByUserId(userId: string): Promise<Doctor | null> {
    const objectId = new Types.ObjectId(userId);
    return this.doctorModel.findOne({ userId: objectId });
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

  async getDoctorByUserId(id: string): Promise<Doctor | null> {
    const objectId = new Types.ObjectId(id); // 🔧 Convert string to ObjectId
    return this.doctorModel.findOne({ userId: objectId }).exec();
  }

  async updateDoctor(
    id: string,
    updateDoctorDto: CreateDoctorDto,
  ): Promise<Doctor> {
    const updatedDoctor = await this.doctorModel.findByIdAndUpdate(
      id,
      updateDoctorDto,
      { new: true },
    );
    if (!updatedDoctor?.email)
      throw new NotFoundException('Updated doctor or email not found');

    const updatedUser = await this.usersService.updateUser(
      updatedDoctor.email,
      {
        name: updateDoctorDto.name,
        password: updateDoctorDto.password,
        role: 'doctor',
      },
    );

    if (!updatedUser) throw new NotFoundException('User not found');

    return updatedDoctor;
  }

  async updateSessionPrice(doctorId: string, sessionPrice: number) {
    const objectId = new Types.ObjectId(doctorId); // 🔧 Convert string to ObjectId
    const doctor = await this.doctorModel.findOne({ userId: objectId });

    if (!doctor) throw new NotFoundException('Doctor not found');

    doctor.sessionPrice = sessionPrice;
    await doctor.save();

    return { message: 'Session price updated' };
  }

  deleteDoctor(id: string) {
    return this.doctorModel.findByIdAndDelete(id);
  }

  async groupDoctorsBySpecialty(): Promise<
    { specialty: string; doctors: Doctor[] }[]
  > {
    return this.doctorModel.aggregate([
      { $group: { _id: '$specialty', doctors: { $push: '$$ROOT' } } },
      { $project: { _id: 0, specialty: '$_id', doctors: 1 } },
    ]);
  }

  async rateDoctor(doctorId: string, rating: number) {
    const objectId = new Types.ObjectId(doctorId); // 🔧 Convert string to ObjectId
    const doctor = await this.doctorModel.findOne({ userId: objectId });

    if (!doctor) throw new NotFoundException('Doctor not found');
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    doctor.numberOfRatings = doctor.numberOfRatings ?? 0;
    doctor.rate =
      ((doctor.rate || 0) * doctor.numberOfRatings + rating) /
      (doctor.numberOfRatings + 1);
    doctor.numberOfRatings = doctor.numberOfRatings + 1;
    await doctor.save();
  }
}
