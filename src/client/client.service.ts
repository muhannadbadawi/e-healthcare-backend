import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './client.schema';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
  ) {}

  // Ensure this method exists
  async create(createClientDto: any): Promise<Client> {
    const client = new this.clientModel(createClientDto);
    return client.save();
  }

  async findByEmail(email: string): Promise<Client | null> {
    return this.clientModel.findOne({ email });
  }
}
