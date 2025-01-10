import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Drone, DroneSchema } from './drone.schema';
import { DronesService } from './drone.service';
import { DronesController } from './drone.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Drone.name, schema: DroneSchema }])],
  controllers: [DronesController],
  providers: [DronesService],
})
export class DronesModule {}
