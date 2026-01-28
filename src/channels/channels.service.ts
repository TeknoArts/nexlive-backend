import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    partnerId: string;
    name: string;
    description?: string;
    categoryId?: string;
    streamUrl: string;
    thumbnail?: string;
    isLive?: boolean;
    isActive?: boolean;
  }) {
    return this.prisma.channel.create({
      data,
      include: {
        category: true,
        partner: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.channel.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
        partner: {
          include: {
            user: true,
          },
        },
        schedules: {
          orderBy: {
            startTime: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAllAdmin() {
    return this.prisma.channel.findMany({
      include: {
        category: true,
        partner: {
          include: {
            user: true,
          },
        },
        schedules: {
          orderBy: {
            startTime: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.channel.findUnique({
      where: { id },
      include: {
        category: true,
        partner: {
          include: {
            user: true,
          },
        },
        schedules: {
          orderBy: {
            startTime: 'asc',
          },
        },
      },
    });
  }

  async update(id: string, data: {
    name?: string;
    description?: string;
    category?: string;
    categoryId?: string;
    streamUrl?: string;
    thumbnail?: string;
    isLive?: boolean;
    isActive?: boolean;
    viewers?: number;
  }) {
    // Remove any legacy 'category' field if present
    const { category, ...updateData } = data as any;
    return this.prisma.channel.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        partner: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.channel.delete({
      where: { id },
    });
  }

  async findByCategory(categoryIdentifier: string) {
    // Try to find category by ID, slug, or name
    const category = await this.prisma.category.findFirst({
      where: {
        OR: [
          { id: categoryIdentifier },
          { slug: categoryIdentifier },
          { name: categoryIdentifier },
        ],
      },
    });

    if (!category) {
      return [];
    }

    return this.prisma.channel.findMany({
      where: {
        isActive: true,
        categoryId: category.id,
      },
      include: {
        category: true,
        partner: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async updateViewers(id: string, viewers: number) {
    return this.prisma.channel.update({
      where: { id },
      data: { viewers, isLive: viewers > 0 },
    });
  }
}
