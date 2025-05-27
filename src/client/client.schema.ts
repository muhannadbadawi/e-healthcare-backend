import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClientDocument = Client & Document;

@Schema()
export class Client {
  @Prop({ required: true })
  name?: string;

  @Prop({ required: true, unique: true })
  email?: string;

  @Prop()
  age?: string;

  @Prop()
  gender?: string;

  @Prop()
  address?: string;

  @Prop()
  height?: string;

  @Prop()
  weight?: string;

  @Prop()
  allergies?: string;

  @Prop()
  cardName?: string;

  @Prop()
  cardNumber?: string;

  @Prop()
  expiryDate?: string;

  @Prop()
  cvv?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId; // Added userId to link Client with User

  @Prop({ type: Number, default: 0 }) // Default balance set to 0
  balance?: number;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
