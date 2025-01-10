import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({required:true})
  name:string;

  @Prop({required:true, unique:true})
  email: string;

  @Prop({required:true})
  password:string;

  @Prop([{type:Types.ObjectId, ref:'Drone'}])
  drones:Types.ObjectId[];

  @Prop([{type: Types.ObjectId, ref:'Mission'}])
  missions:Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
