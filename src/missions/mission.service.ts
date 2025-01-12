// src/missions/missions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mission } from './mission.schema';
import { generateUniqueId } from '../shared/utils';
import { FlightLogsService } from 'src/flight-logs/flight-log.service';

@Injectable()
export class MissionsService {
  private simulationIntervals: Record<string, NodeJS.Timeout> = {};

  constructor(
    @InjectModel(Mission.name) private missionModel: Model<Mission>,
    private readonly flightLogsService: FlightLogsService,
) {}

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

  private calculateTotalDistance(waypoints: { lat: number; lng: number }[]): number {
    const convertDegreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;
    let totalDistance = 0;
  
    for (let waypointIndex = 0; waypointIndex < waypoints.length - 1; waypointIndex++) {
      const firstWaypoint = waypoints[waypointIndex];
      const secondWaypoint = waypoints[waypointIndex + 1];
  
      const latitude1 = convertDegreesToRadians(firstWaypoint.lat);
      const longitude1 = convertDegreesToRadians(firstWaypoint.lng);
      const latitude2 = convertDegreesToRadians(secondWaypoint.lat);
      const longitude2 = convertDegreesToRadians(secondWaypoint.lng);
  
      const differenceInLatitude = latitude2 - latitude1;
      const differenceInLongitude = longitude2 - longitude1;
  
      const earthRadiusInMeters = 6371000; // Radius of Earth in meters
  
      const haversineValue =
        Math.sin(differenceInLatitude / 2) * Math.sin(differenceInLatitude / 2) +
        Math.cos(latitude1) *
          Math.cos(latitude2) *
          Math.sin(differenceInLongitude / 2) *
          Math.sin(differenceInLongitude / 2);
  
      const centralAngle = 2 * Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue));
  
      const distanceBetweenWaypoints = earthRadiusInMeters * centralAngle;
  
      totalDistance += distanceBetweenWaypoints;
    }
  
    return totalDistance;
  }
  

  // private calculateTotalDistance(waypoints: { lat: number; lng: number }[]): number {
  //   const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  //   let totalDistance = 0;
  
  //   for (let i = 0; i < waypoints.length - 1; i++) {
  //     const { lat: lat1, lng: lng1 } = waypoints[i];
  //     const { lat: lat2, lng: lng2 } = waypoints[i + 1];
  
  //     const R = 6371e3; // Earth’s radius in meters
  //     const φ1 = toRadians(lat1);
  //     const φ2 = toRadians(lat2);
  //     const Δφ = toRadians(lat2 - lat1);
  //     const Δλ = toRadians(lng2 - lng1);
  
  //     const a =
  //       Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
  //       Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  //     totalDistance += R * c; // Distance in meters
  //   }
  
  //   return totalDistance;
  // }
  
  // Start mission simulation
  // Start mission simulation
  async startSimulation(missionId: string, droneId: string) {
    console.log("Start simulation function called with missionId:", missionId, "and droneId:", droneId);
  
    let flightId: string;
    const startTime = new Date();
  
    try {
      // Fetch the mission by ID
      const mission = await this.getMissionById(missionId);
  
      // Check if mission exists
      console.log("Mission fetched:", mission);
      if (!mission) {
        throw new NotFoundException('Mission not found');
      }
  
      // Generate a unique flight ID
      flightId = generateUniqueId();
      console.log("Generated flight ID:", flightId);
  
      // Create a new flight log entry
      await this.flightLogsService.createFlightLog({
        flightId,
        drone: droneId,
        mission: missionId,
        waypoints: [],
        speed: mission.speed,
        distance: 0, // Initialize with 0
        executionStart: startTime,
        executionEnd: null, // Will be updated at the end of the simulation
      });
  
      console.log("Flight log created successfully for flightId:", flightId);
  
      // Simulate drone movement through waypoints
      let currentWaypointIndex = 0;
  
      const interval = setInterval(async () => {
        try {
          if (currentWaypointIndex >= mission.waypoints.length) {
            // Stop simulation when all waypoints are covered
            clearInterval(interval);
            delete this.simulationIntervals[flightId];
  
            // Calculate total distance and update flight log
            const totalDistance = this.calculateTotalDistance(mission.waypoints);
            const endTime = new Date();
            await this.flightLogsService.updateFlightLog(flightId, {
              distance: totalDistance,
              executionEnd: endTime,
            });
  
            console.log(`Mission simulation completed for flight ID: ${flightId}`);
            return;
          }
  
          // Log the current waypoint
          const currentWaypoint = mission.waypoints[currentWaypointIndex];
          const waypointLog = {
            time: new Date().getTime() - startTime.getTime(), // Time since simulation start
            lat: currentWaypoint.lat,
            lng: currentWaypoint.lng,
            alt: currentWaypoint.alt,
          };
  
          // Append the waypoint log to the flight log
          await this.flightLogsService.addWaypointToLog(flightId, waypointLog);
          console.log(`Waypoint logged for flight ID ${flightId}:`, waypointLog);
  
          currentWaypointIndex++;
        } catch (error) {
          console.error(`Error during waypoint logging for flight ID ${flightId}:`, error.message);
        }
      }, 1000); // Simulate 1 waypoint per second
  
      // Store the interval for future control (e.g., stop simulation)
      this.simulationIntervals[flightId] = interval;
  
      return { message: 'Mission simulation started', flightId };
    } catch (error) {
      console.error(`Error in startSimulation for missionId: ${missionId}, droneId: ${droneId}`, error.message);
  
      // Clean up in case of an error
      if (flightId) {
        delete this.simulationIntervals[flightId];
      }
  
      throw error; // Re-throw the error to be handled by the controller or global exception filter
    }
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
