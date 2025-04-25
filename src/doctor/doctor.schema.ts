import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema()
export class Doctor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  age: string;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop()
  specialty: string;

  @Prop()
  rate: number;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
