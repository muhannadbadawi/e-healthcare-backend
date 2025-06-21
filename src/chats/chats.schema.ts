import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatsDocument = Chats & Document & { _id: Types.ObjectId };

@Schema()
export class Chats {
  @Prop({ required: true })
  clientId?: string;

  @Prop({ required: true })
  doctorId?: string;

  @Prop({ required: true })
  clientName?: string;

  @Prop({ required: true })
  doctorName?: string;

  @Prop({ required: true })
  createdAt?: Date;

  @Prop({ required: true })
  endAt?: Date;
}

export const ChatsSchema = SchemaFactory.createForClass(Chats);
