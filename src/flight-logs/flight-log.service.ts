// src/flight-logs/flight-logs.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FlightLog } from './flight-log.schema';

@Injectable()
export class FlightLogsService {
  constructor(@InjectModel(FlightLog.name) private flightLogModel: Model<FlightLog>) {}

  // Create a flight log
  async createFlightLog(logDto: {
    flightId: string;
    drone: string;
    mission: string;
    waypoints: { time: number; lat: number; lng: number; alt: number }[];
    speed: number;
    distance: number;
    executionStart: Date;
    executionEnd: Date;
  }) {
    const log = new this.flightLogModel(logDto);
    return log.save();
  }

  // Get a flight log by flightId
  async getFlightLogById(flightId: string) {
    const log = await this.flightLogModel
      .findOne({ flightId })
      .populate('drone')
      .populate('mission')
      .exec();

    if (!log) {
      throw new NotFoundException('Flight log not found');
    }

    return log;
  }

  // Get all flight logs
  async getAllFlightLogs() {
    return this.flightLogModel.find().populate('drone').populate('mission').exec();
  }
}
