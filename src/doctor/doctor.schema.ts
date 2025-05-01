import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema()
export class Doctor {
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
  specialty?: string;

  @Prop()
  rate?: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId; // Added userId to link Doctor with User
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
