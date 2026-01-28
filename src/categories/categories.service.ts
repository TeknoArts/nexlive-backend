import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    isActive?: boolean;
    sortOrder?: number;
  }) {
    return this.prisma.category.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  async findActive() {
    return this.prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        channels: true,
        vodItems: true,
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.category.findUnique({
      where: { slug },
    });
  }

  async update(id: string, data: {
    name?: string;
    slug?: string;
    description?: string;
    image?: string;
    isActive?: boolean;
    sortOrder?: number;
  }) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
