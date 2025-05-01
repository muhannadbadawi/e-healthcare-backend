import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './admin.schema';
import { UsersService } from 'src/users/users.service';
import { ClientService } from 'src/client/client.service';
import { DoctorService } from 'src/doctor/doctor.service';
import { CreateDoctorDto } from 'src/doctor/dto/create-doctor.dto';
import { UserDocument } from 'src/users/user.schema';

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

  async create(createAdminDto: any): Promise<AdminDocument> {
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

  // عند إنشاء الدكتور:
  async addDoctor(newDoctor: CreateDoctorDto) {
    const user = await this.usersService.create({ ...newDoctor, role: 'doctor' }) as UserDocument;
    await this.doctorService.create({
      ...newDoctor,
      userId: user._id,
      rate: 0.0,
    });
  }

  async editDoctor(id: string, updateDoctorDto: CreateDoctorDto) {
    const doctor = await this.doctorService.getDoctorById(id);

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    // Update doctor fields (partial update)
    const updatedDoctor = await this.doctorService.updateDoctor(
      id,
      updateDoctorDto,
    );

    return updatedDoctor;
  }

  async deleteDoctor(id: string) {
    const doctor = await this.doctorService.getDoctorById(id);

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    // Optionally: Delete associated user too (if needed)
    if (doctor.email) {
      await this.usersService.deleteByEmail(doctor.email); // if your user is linked by email
    } else {
      throw new Error('Doctor email is undefined');
    }

    return await this.doctorService.deleteDoctor(id);
  }

  async deleteClient(id: string) {
    const client = await this.clientService.getClientById(id);

    if (!client) {
      throw new Error('Doctor not found');
    }

    // Optionally: Delete associated user too (if needed)
    if (client.email) {
      await this.usersService.deleteByEmail(client.email); // if your user is linked by email
    } else {
      throw new Error('Client email is undefined');
    }

    return await this.clientService.deleteClient(id);
  }

  async getDoctors() {
    return this.doctorService.getDoctors();
  }

  async getClients() {
    return this.clientService.getClients();
  }
}
