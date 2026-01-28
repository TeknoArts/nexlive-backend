import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.partner.findMany({
      include: {
        user: true,
        channels: true,
        vodItems: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.partner.findUnique({
      where: { id },
      include: {
        user: true,
        channels: true,
        vodItems: true,
        schedules: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.partner.findUnique({
      where: { userId },
      include: {
        user: true,
        channels: true,
        vodItems: true,
        schedules: true,
      },
    });
  }
}
