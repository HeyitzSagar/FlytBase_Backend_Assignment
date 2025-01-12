// src/flight-logs/flight-logs.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlightLogsController } from './flight-log.controller';
import { FlightLogsService } from './flight-log.service';
import { FlightLog, FlightLogSchema } from './flight-log.schema';
import { PDFService } from './pdf/pdf.service';
import { PDFController } from './pdf/pdf.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: FlightLog.name, schema: FlightLogSchema }])],
  controllers: [FlightLogsController, PDFController],
  providers: [FlightLogsService, PDFService],
  exports:[FlightLogsService]
})
export class FlightLogsModule {}
