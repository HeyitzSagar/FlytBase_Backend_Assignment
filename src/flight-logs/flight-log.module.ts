// src/flight-logs/flight-logs.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlightLogsController } from './flight-log.controller';
import { FlightLogsService } from './flight-log.service';
import { FlightLog, FlightLogSchema } from './flight-log.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: FlightLog.name, schema: FlightLogSchema }])],
  controllers: [FlightLogsController],
  providers: [FlightLogsService],
})
export class FlightLogsModule {}
