// src/flight-logs/flight-logs.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { FlightLogsService } from './flight-log.service';

@Controller('flight-logs')
export class FlightLogsController {
  constructor(private readonly flightLogsService: FlightLogsService) {}

  // Create a flight log
  @Post()
  async createFlightLog(@Body() logDto: {
    flightId: string;
    drone: string;
    mission: string;
    waypoints: { time: number; lat: number; lng: number; alt: number }[];
    speed: number;
    distance: number;
    executionStart: Date;
    executionEnd: Date;
  }) {
    return this.flightLogsService.createFlightLog(logDto);
  }

  // Get a flight log by flightId
  @Get(':flightId')
  async getFlightLogById(@Param('flightId') flightId: string) {
    return this.flightLogsService.getFlightLogById(flightId);
  }

  // Get all flight logs
  @Get()
  async getAllFlightLogs() {
    return this.flightLogsService.getAllFlightLogs();
  }
}
