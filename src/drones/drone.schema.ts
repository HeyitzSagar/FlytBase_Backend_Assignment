// src/drones/schemas/drone.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DroneStatus } from '../shared/enums/index';

@Schema()
export class Drone extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  droneModel: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Reference to User
  owner: Types.ObjectId;

  @Prop({ default: DroneStatus.AVAILABLE })
  status: DroneStatus;
}

export const DroneSchema = SchemaFactory.createForClass(Drone);
