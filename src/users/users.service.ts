import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        wallet: true,
        partner: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        wallet: true,
        partner: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        wallet: true,
        partner: true,
      },
    });
  }
}
