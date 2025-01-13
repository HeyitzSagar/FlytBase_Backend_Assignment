import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello there, welcome to my assignment check for drone-mission-management-server';
  }
}
