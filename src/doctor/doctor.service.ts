import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
  ) {}

  // Create a new doctor
  async create(createDoctorDto: any): Promise<Doctor> {
    const doctor = new this.doctorModel(createDoctorDto);
    return doctor.save();
  }

  // Find a doctor by email
  async findByEmail(email: string): Promise<Doctor | null> {
    return this.doctorModel.findOne({ email });
  }

  // Get all doctors
  async getDoctors() {
    return this.doctorModel.find();
  }

  // Get the count of doctors
  async getDoctorsCount() {
    return this.doctorModel.countDocuments();
  }

  // Get a doctor by ID
  async getDoctorById(id: string): Promise<Doctor | null> {
    return this.doctorModel.findById(id).exec(); // Ensure that findById is used to retrieve by ObjectId
  }

  // Update a doctor's information
  async updateDoctor(
    id: string,
    updateDoctorDto: CreateDoctorDto,
  ): Promise<Doctor> {
    const updatedDoctor = await this.doctorModel
      .findByIdAndUpdate(id, updateDoctorDto, { new: true })
      .exec(); // { new: true } returns the updated document

    if (!updatedDoctor) {
      throw new Error(`Doctor with ID ${id} not found`);
    }

    return updatedDoctor;
  }

  async deleteDoctor(id: string) {
    return await this.doctorModel.findByIdAndDelete(id);
  }

  async groupDoctorsBySpecialty(): Promise<
    { specialty: string; doctors: Doctor[] }[]
  > {
    const result: { specialty: string; doctors: Doctor[] }[] =
      await this.doctorModel.aggregate([
        {
          $group: {
            _id: '$specialty',
            doctors: { $push: '$$ROOT' },
          },
        },
        {
          $project: {
            _id: 0,
            specialty: '$_id',
            doctors: 1,
          },
        },
      ]);

    return result;
  }
}
