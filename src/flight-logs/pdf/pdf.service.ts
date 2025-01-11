// src/flight-logs/pdf/pdf.service.ts
import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';

@Injectable()
export class PDFService {
  async generateFlightLogPDF(
    log: {
      flightId: string;
      drone: string;
      mission: string;
      waypoints: { time: number; lat: number; lng: number; alt: number }[];
      speed: number;
      distance: number;
      executionStart: Date;
      executionEnd: Date;
    },
    filePath: string,
  ) {
    const doc = new PDFDocument();

    // Write to file
    doc.pipe(createWriteStream(filePath));

    // Title
    doc.fontSize(20).text('Flight Log Report', { align: 'center' }).moveDown();

    // Flight Info
    doc
      .fontSize(12)
      .text(`Flight ID: ${log.flightId}`)
      .text(`Drone: ${log.drone}`)
      .text(`Mission: ${log.mission}`)
      .text(`Speed: ${log.speed} m/s`)
      .text(`Distance: ${log.distance} meters`)
      .text(`Execution Start: ${log.executionStart}`)
      .text(`Execution End: ${log.executionEnd}`)
      .moveDown();

    // Waypoints
    doc.text('Waypoints:').moveDown();
    log.waypoints.forEach((wp, index) => {
      doc
        .fontSize(10)
        .text(
          `Waypoint ${index + 1}: Time=${wp.time}s, Lat=${wp.lat}, Lng=${wp.lng}, Alt=${wp.alt}m`,
        );
    });

    // Finalize the PDF
    doc.end();
  }
}
