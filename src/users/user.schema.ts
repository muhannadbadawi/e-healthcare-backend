import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document & { _id: Types.ObjectId };

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: ['admin', 'doctor', 'client'],
    default: 'client',
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
