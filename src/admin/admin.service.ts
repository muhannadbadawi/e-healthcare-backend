import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './admin.schema';
import { UsersService } from 'src/users/users.service';
import { ClientService } from 'src/client/client.service';
import { DoctorService } from 'src/doctor/doctor.service';
import { CreateDoctorDto } from 'src/doctor/dto/create-doctor.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly usersService: UsersService,
    private readonly clientService: ClientService,
    private readonly doctorService: DoctorService,
  ) {}

  async getAdminsCount() {
    return this.adminModel.countDocuments();
  }

  async create(createAdminDto: any): Promise<Admin> {
    const admin = new this.adminModel(createAdminDto);
    return admin.save();
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminModel.findOne({ email });
  }

  async getCounts() {
    const adminsCount = await this.getAdminsCount();
    const clientsCount = await this.clientService.getClientsCount();
    const usersCount = await this.usersService.getUsersCount();
    const doctorsCount = await this.doctorService.getDoctorsCount();

    return {
      adminsCount,
      clientsCount,
      usersCount,
      doctorsCount,
    };
  }

  async addDoctor(newDoctor: CreateDoctorDto) {
    await this.usersService.create({
      ...newDoctor,
      role: 'doctor',
    });
    await this.doctorService.create({
      ...newDoctor,
      rate: 0.0,
    });
  }

  async getDoctors() {
    return this.doctorService.getDoctors();
  }
}
