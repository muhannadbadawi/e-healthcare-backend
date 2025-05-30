import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Client, ClientDocument } from './client.schema';
import { DoctorService } from 'src/doctor/doctor.service';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name)
    private readonly clientModel: Model<ClientDocument>,
    private readonly doctorService: DoctorService,
  ) {}

  create(createClientDto: Partial<Client>): Promise<Client> {
    const client = new this.clientModel(createClientDto);
    return client.save();
  }

  findByEmail(email: string): Promise<Client | null> {
    return this.clientModel.findOne({ email });
  }

  async getClientById(id: string): Promise<Client> {
    const client = await this.clientModel.findById(id);
    if (!client) throw new NotFoundException(`Client with ID ${id} not found`);
    return client;
  }

  getClientsCount(): Promise<number> {
    return this.clientModel.countDocuments();
  }

  getClients(): Promise<Client[]> {
    return this.clientModel.find();
  }

  deleteClient(id: string): Promise<Client | null> {
    return this.clientModel.findByIdAndDelete(id);
  }

  getDoctors(): ReturnType<DoctorService['getDoctors']> {
    return this.doctorService.getDoctors();
  }

  groupDoctorsBySpecialty(): ReturnType<
    DoctorService['groupDoctorsBySpecialty']
  > {
    return this.doctorService.groupDoctorsBySpecialty();
  }

  async updateBalance(clientId: string, balance: number) {
    const objectId = new Types.ObjectId(clientId); // 🔧 Convert string to ObjectId
    const client = await this.clientModel.findOne({ userId: objectId });

    if (!client) throw new NotFoundException('client not found');

    client.balance = balance ;
    await client.save();

    return { message: 'Session price updated' };
  }

  async getBalance(clientId: string): Promise<{ balance: number }> {
    const objectId = new Types.ObjectId(clientId); // 🔧 Convert string to ObjectId
    const client = await this.clientModel.findOne({ userId: objectId });

    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return { balance: client.balance || 0 };
  }
}
