import { Controller, Get, Param, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private schedulesService: SchedulesService) {}

  @Get('channel/:channelId')
  async findByChannel(@Param('channelId') channelId: string, @Query('upcoming') upcoming?: string) {
    if (upcoming === 'true') {
      return this.schedulesService.findUpcoming(channelId);
    }
    return this.schedulesService.findByChannel(channelId);
  }
}
