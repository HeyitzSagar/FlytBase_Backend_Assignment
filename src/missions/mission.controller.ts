// src/missions/missions.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { MissionsService } from './mission.service';

@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  // Create a mission
  @Post()
  async createMission(@Body() missionDto: {
    name: string;
    type: string;
    waypoints: { lat: number; lng: number; alt: number }[];
    altitude: number;
    speed: number;
    creator: string;
  }) {
    return this.missionsService.createMission(missionDto);
  }

  // Fetch all missions
  @Get()
  async getMissions() {
    return this.missionsService.getMissions();
  }

  // Fetch a mission by ID
  @Get(':id')
  async getMissionById(@Param('id') id: string) {
    return this.missionsService.getMissionById(id);
  }

  // Update a mission
  @Put(':id')
  async updateMission(
    @Param('id') id: string,
    @Body() updateDto: { name?: string; type?: string },
  ) {
    return this.missionsService.updateMission(id, updateDto);
  }

  // Delete a mission
  @Delete(':id')
  async deleteMission(@Param('id') id: string) {
    return this.missionsService.deleteMission(id);
  }

  // Start simulation
  @Post(':id/start-simulation')
  async startSimulation(
    @Param('id') missionId: string,
    @Body() simulationDto: { droneId: string },
  ) {
    return this.missionsService.startSimulation(missionId, simulationDto.droneId);
  }

  // Stop simulation
  @Post('stop-simulation')
  async stopSimulation(@Body() stopDto: { flightId: string }) {
    return this.missionsService.stopSimulation(stopDto.flightId);
  }
}
