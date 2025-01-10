// src/missions/schemas/mission.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MissionType } from '../shared/enums/index';

@Schema()
export class Mission extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: MissionType })
  type: MissionType;

  @Prop([{ lat: Number, lng: Number, alt: Number }])
  waypoints: { lat: number; lng: number; alt: number }[];

  @Prop({ required: true })
  altitude: number;

  @Prop({ required: true })
  speed: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Reference to User
  creator: Types.ObjectId;
  
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const MissionSchema = SchemaFactory.createForClass(Mission);
