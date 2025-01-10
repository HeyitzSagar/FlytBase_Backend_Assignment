// src/missions/missions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mission } from './mission.schema';
import { generateUniqueId } from '../shared/utils';

@Injectable()
export class MissionsService {
  private simulationIntervals: Record<string, NodeJS.Timeout> = {};

  constructor(@InjectModel(Mission.name) private missionModel: Model<Mission>) {}

  // Create a mission
  async createMission(missionDto: {
    name: string;
    type: string;
    waypoints: { lat: number; lng: number; alt: number }[];
    altitude: number;
    speed: number;
    creator: string;
  }) {
    const mission = new this.missionModel(missionDto);
    return mission.save();
  }

  // Fetch all missions
  async getMissions() {
    return this.missionModel.find().exec();
  }

  // Fetch a mission by ID
  async getMissionById(id: string) {
    const mission = await this.missionModel.findById(id).exec();
    if (!mission) throw new NotFoundException('Mission not found');
    return mission;
  }

  // Update a mission
  async updateMission(id: string, updateDto: { name?: string; type?: string }) {
    const mission = await this.missionModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!mission) throw new NotFoundException('Mission not found');
    return mission;
  }

  // Delete a mission
  async deleteMission(id: string) {
    const mission = await this.missionModel.findByIdAndDelete(id).exec();
    if (!mission) throw new NotFoundException('Mission not found');
    return { message: 'Mission deleted successfully' };
  }

  // Start mission simulation
  async startSimulation(missionId: string, droneId: string) {
    const mission = await this.getMissionById(missionId);

    if (!mission) throw new NotFoundException('Mission not found');

    const flightId = generateUniqueId(); // Unique flight ID
    let currentWaypointIndex = 0;

    const interval = setInterval(() => {
      if (currentWaypointIndex >= mission.waypoints.length - 1) {
        clearInterval(interval);
        delete this.simulationIntervals[flightId];
        console.log(`Mission simulation completed for flight ID: ${flightId}`);
        return;
      }

      const currentWaypoint = mission.waypoints[currentWaypointIndex];
      console.log(`Drone moving to waypoint:`, currentWaypoint);

      currentWaypointIndex++;
    }, 1000); // Simulate 1 second per interval

    this.simulationIntervals[flightId] = interval;
    return { message: 'Mission simulation started', flightId };
  }

  // Stop mission simulation
  stopSimulation(flightId: string) {
    const interval = this.simulationIntervals[flightId];
    if (!interval) throw new NotFoundException('Simulation not found');

    clearInterval(interval);
    delete this.simulationIntervals[flightId];
    return { message: 'Mission simulation stopped', flightId };
  }
}
