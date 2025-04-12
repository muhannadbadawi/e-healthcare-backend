import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, min: 1, max: 120 })
  age: number;

  @Prop({ required: true, enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop({ default: 'client' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
