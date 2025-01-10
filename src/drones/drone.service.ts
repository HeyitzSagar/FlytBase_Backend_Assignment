// src/drones/drones.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Drone } from './drone.schema';

@Injectable()
export class DronesService {
  constructor(@InjectModel(Drone.name) private droneModel: Model<Drone>) {}

  async create(droneDto: { name: string; model: string; owner: string }) {
    const drone = new this.droneModel(droneDto);
    return drone.save();
  }

  async findAll() {
    return this.droneModel.find().exec();
  }
}
