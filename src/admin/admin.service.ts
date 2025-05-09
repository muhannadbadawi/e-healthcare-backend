import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Admin, AdminDocument } from './admin.schema';
import { UsersService } from 'src/users/users.service';
import { ClientService } from 'src/client/client.service';
import { DoctorService } from 'src/doctor/doctor.service';
import { CreateDoctorDto } from 'src/doctor/dto/create-doctor.dto';
import { UserDocument } from 'src/users/user.schema';
import { UpdateAdminDto } from './dto/update-admindto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    private readonly usersService: UsersService,
    private readonly clientService: ClientService,
    private readonly doctorService: DoctorService,
  ) {}

  async getAdminsCount(): Promise<number> {
    return this.adminModel.countDocuments();
  }

  async create(createAdminDto: Partial<Admin>): Promise<AdminDocument> {
    const admin = new this.adminModel(createAdminDto);
    return admin.save();
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminModel.findOne({ email });
  }

  async getCounts() {
    return {
      adminsCount: await this.getAdminsCount(),
      clientsCount: await this.clientService.getClientsCount(),
      usersCount: await this.usersService.getUsersCount(),
      doctorsCount: await this.doctorService.getDoctorsCount(),
    };
  }

  async addDoctor(newDoctor: CreateDoctorDto) {
    const user = (await this.usersService.create({
      ...newDoctor,
      role: 'doctor',
    })) as UserDocument;
    await this.doctorService.create({
      ...newDoctor,
      userId: user._id,
      rate: 0.0,
    });
  }

  async editAdmin(id: string, updateAdminDto: UpdateAdminDto) {
    const objectId = new Types.ObjectId(id); // 🔧 Convert string to ObjectId
    const admin = await this.adminModel.findOne({ userId: objectId });
    if (!admin?.email) throw new NotFoundException('Admin or email not found');

    const user = await this.usersService.findByEmail(admin.email);
    if (!user) throw new NotFoundException('User not found');

    if (updateAdminDto.currentPassword !== user.password) {
      throw new Error('Current password is incorrect');
    }

    const updatedAdmin = await this.adminModel.findByIdAndUpdate(
      admin._id, // ✅ use actual MongoDB ID here
      { name: updateAdminDto.name },
      { new: true },
    );

    await this.usersService.updateUser(admin.email, {
      name: updateAdminDto.name,
      password: updateAdminDto.newPassword ?? user.password,
    });

    return updatedAdmin;
  }

  async editDoctor(id: string, updateDoctorDto: CreateDoctorDto) {
    return this.doctorService.updateDoctor(id, updateDoctorDto);
  }

  async deleteDoctor(id: string) {
    const doctor = await this.doctorService.getDoctorById(id);
    if (!doctor?.email)
      throw new NotFoundException('Doctor or email not found');

    await this.usersService.deleteByEmail(doctor.email);
    return this.doctorService.deleteDoctor(id);
  }

  async deleteClient(id: string) {
    const client = await this.clientService.getClientById(id);
    if (!client?.email)
      throw new NotFoundException('Client or email not found');

    await this.usersService.deleteByEmail(client.email);
    return this.clientService.deleteClient(id);
  }

  getDoctors() {
    return this.doctorService.getDoctors();
  }

  getClients() {
    return this.clientService.getClients();
  }
}
