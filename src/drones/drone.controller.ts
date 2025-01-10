// src/drones/drones.controller.ts
import { Controller, Post, Get, Body } from '@nestjs/common';
import { DronesService } from './drone.service';

@Controller('drones')
export class DronesController {
  constructor(private readonly dronesService: DronesService) {}

  @Post()
  async create(@Body() droneDto: { name: string; model: string; owner: string }) {
    return this.dronesService.create(droneDto);
  }

  @Get()
  async findAll() {
    return this.dronesService.findAll();
  }
}
