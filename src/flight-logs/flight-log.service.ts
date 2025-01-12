// src/flight-logs/flight-logs.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FlightLog } from './flight-log.schema';

@Injectable()
export class FlightLogsService {
  constructor(@InjectModel(FlightLog.name) private flightLogModel: Model<FlightLog>) {}

  // Create a new flight log
  async createFlightLog(logDto: {
    flightId: string;
    drone: string;
    mission: string;
    waypoints: { time: number; lat: number; lng: number; alt: number }[];
    speed: number;
    distance: number;
    executionStart: Date;
    executionEnd: Date | null;
  }) {
    const log = new this.flightLogModel(logDto);
    return log.save();
  }

  // Get a specific flight log by flightId
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

  // Append a waypoint to the flight log
  async addWaypointToLog(flightId: string, waypoint: { time: number; lat: number; lng: number; alt: number }) {
    const flightLog = await this.flightLogModel.findOne({ flightId });

    if (!flightLog) {
      throw new NotFoundException('Flight log not found');
    }

    // Append the new waypoint
    flightLog.waypoints.push(waypoint);

    // Save the updated flight log
    return flightLog.save();
  }

  // Update the flight log with final distance and executionEnd time
  async updateFlightLog(flightId: string, updateDto: { distance: number; executionEnd: Date }) {
    const flightLog = await this.flightLogModel.findOneAndUpdate(
      { flightId },
      { $set: updateDto },
      { new: true }, // Return the updated document
    );

    if (!flightLog) {
      throw new NotFoundException('Flight log not found');
    }

    return flightLog;
  }
}
