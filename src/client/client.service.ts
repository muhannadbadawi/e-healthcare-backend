import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './client.schema';
import { DoctorService } from 'src/doctor/doctor.service';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
    private readonly doctorService: DoctorService,
  ) {}

  // Ensure this method exists
  async create(createClientDto: any): Promise<Client> {
    const client = new this.clientModel(createClientDto);
    return client.save();
  }

  async findByEmail(email: string): Promise<Client | null> {
    return this.clientModel.findOne({ email });
  }

  async getClientById(id: string): Promise<Client | null> {
    return this.clientModel.findById(id).exec(); // Ensure that findById is used to retrieve by ObjectId
  }

  async getClientsCount() {
    return this.clientModel.countDocuments();
  }

  async getClients() {
    return this.clientModel.find();
  }

  async deleteClient(id: string) {
    return await this.clientModel.findByIdAndDelete(id);
  }
  async getDoctors() {
    return this.doctorService.getDoctors();
  }

  async groupDoctorsBySpecialty() {
    return this.doctorService.groupDoctorsBySpecialty();
  }
}
