import { Controller, Get, Param } from '@nestjs/common';
import { FlightLogsService } from '../flight-log.service';
import { PDFService } from './pdf.service';

@Controller('flight-logs/pdf')
export class PDFController {
  constructor(
    private readonly flightLogsService: FlightLogsService,
    private readonly pdfService: PDFService,
  ) {}

  @Get(':flightId')
  async generatePDF(@Param('flightId') flightId: string) {
    const log = await this.flightLogsService.getFlightLogById(flightId);

    // Transform the log to match the expected type
    const transformedLog = {
      flightId: log.flightId.toString(),
      drone: log.drone.toString(), // Convert ObjectId to string
      mission: log.mission.toString(), // Convert ObjectId to string
      waypoints: log.waypoints.map((wp) => ({
        time: wp.time,
        lat: wp.lat,
        lng: wp.lng,
        alt: wp.alt,
      })),
      speed: log.speed,
      distance: log.distance,
      executionStart: log.executionStart,
      executionEnd: log.executionEnd,
    };

    const filePath = `./flight-log-${flightId}.pdf`;

    await this.pdfService.generateFlightLogPDF(transformedLog, filePath);

    return { message: 'PDF generated successfully', path: filePath };
  }
}
