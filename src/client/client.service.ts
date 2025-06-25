import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Client, ClientDocument } from './client.schema';
import { DoctorService } from 'src/doctor/doctor.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name)
    private readonly clientModel: Model<ClientDocument>,
    private readonly doctorService: DoctorService,
    private readonly usersService: UsersService,
  ) {}

  create(createClientDto: Partial<Client>): Promise<Client> {
    const client = new this.clientModel(createClientDto);
    return client.save();
  }

  findByEmail(email: string): Promise<Client | null> {
    return this.clientModel.findOne({ email });
  }

  findByUserId(userId: string): Promise<Client | null> {
    const objectId = new Types.ObjectId(userId);
    return this.clientModel.findOne({ userId: objectId });
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

    client.balance = balance;
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

  async updateClient(
    id: string,
    updateClientDto: CreateClientDto,
  ): Promise<Client> {
    const objectId = new Types.ObjectId(id);

    const client = await this.clientModel.findOne({ userId: objectId });
    if (!updateClientDto.email) {
      throw new NotFoundException('Email is required to update client');
    }
    const user = await this.usersService.findByEmail(updateClientDto.email);

    if (!client?.email)
      throw new NotFoundException('Updated client or email not found');

    if(updateClientDto.password !== user?.password){
      throw new NotFoundException('Password does not match');
    }

    const updatedUser = await this.usersService.updateUser(client.email, {
      name: updateClientDto.name,
      password: updateClientDto.password,
      role: 'client',
    });

    if (!updatedUser) throw new NotFoundException('User not found');

    client.name = updateClientDto.name;
    client.age = updateClientDto.age;
    client.gender = updateClientDto.gender;
    client.address = updateClientDto.address;
    client.height = updateClientDto.height;
    client.weight = updateClientDto.weight;
    client.allergies = updateClientDto.allergies;
    client.cardName = updateClientDto.cardName;
    client.cardNumber = updateClientDto.cardNumber;
    client.expiryDate = updateClientDto.expiryDate;
    client.cvv = updateClientDto.cvv;

    await client.save();
    return client;
  }
}
