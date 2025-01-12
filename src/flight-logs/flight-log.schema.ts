// src/flight-logs/schemas/flight-log.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class FlightLog extends Document {
  @Prop({ required: true })
  flightId: string; // Unique identifier for each flight

  @Prop({ type: Types.ObjectId, ref: 'Drone', required: true })
  drone: Types.ObjectId; // Reference to the Drone

  @Prop({ type: Types.ObjectId, ref: 'Mission', required: true })
  mission: Types.ObjectId; // Reference to the Mission

  @Prop([{ time: Number, lat: Number, lng: Number, alt: Number }]) // Waypoints and their data
  waypoints: { time: number; lat: number; lng: number; alt: number }[];

  @Prop({ required: true })
  speed: number; // Drone speed during the mission

  @Prop({ required: true })
  distance: number; // Total distance covered in the mission

  @Prop({ required: true })
  executionStart: Date; // Start time of the mission execution

  @Prop({ required: false })
  executionEnd: Date; // End time of the mission execution

  @Prop({ default: Date.now })
  createdAt: Date; // Log creation timestamp
}

export const FlightLogSchema = SchemaFactory.createForClass(FlightLog);
