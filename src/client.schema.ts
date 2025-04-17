import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type ClientDocument = Client & Document;

@Schema()
export class Client extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  age: string;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop()
  height: string;

  @Prop()
  weight: string;

  @Prop()
  allergies: string;

  @Prop()
  cardName: string;

  @Prop()
  cardNumber: string;

  @Prop()
  expiryDate: string;

  @Prop()
  cvv: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
