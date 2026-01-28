import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async findByChannel(channelId: string) {
    return this.prisma.schedule.findMany({
      where: { channelId },
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async findUpcoming(channelId: string) {
    const now = new Date();
    return this.prisma.schedule.findMany({
      where: {
        channelId,
        startTime: {
          gte: now,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 5,
    });
  }
}
