import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mission, MissionSchema } from './mission.schema';
import { MissionsService } from './mission.service';
import { MissionsController } from './mission.controller';
import { FlightLogsModule } from '../flight-logs/flight-log.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mission.name, schema: MissionSchema }]),
    FlightLogsModule,
  ],
  controllers: [MissionsController],
  providers: [MissionsService],
})
export class MissionsModule {}
