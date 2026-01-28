import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VodService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    description?: string;
    videoUrl: string;
    thumbnail?: string;
    duration: number;
    categoryId?: string;
    tags?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    partnerId?: string;
  }) {
    return this.prisma.vodItem.create({
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
    return this.prisma.vodItem.findMany({
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAllAdmin() {
    return this.prisma.vodItem.findMany({
      include: {
        category: true,
        partner: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.vodItem.findUnique({
      where: { id },
      include: {
        category: true,
        partner: {
          include: {
            user: true,
          },
        },
      },
    });
    
    if (item && item.isActive) {
      await this.prisma.vodItem.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
    }
    
    return item;
  }

  async update(id: string, data: {
    title?: string;
    description?: string;
    videoUrl?: string;
    thumbnail?: string;
    duration?: number;
    categoryId?: string;
    tags?: string;
    isActive?: boolean;
    isFeatured?: boolean;
  }) {
    // Remove any legacy 'category' field if present
    const { category, ...updateData } = data as any;
    return this.prisma.vodItem.update({
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
    return this.prisma.vodItem.delete({
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

    return this.prisma.vodItem.findMany({
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

  async search(query: string) {
    // SQLite doesn't support case-insensitive mode, so we'll do case-insensitive search manually
    const allItems = await this.prisma.vodItem.findMany({
      include: {
        partner: {
          include: {
            user: true,
          },
        },
      },
    });
    
    const lowerQuery = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        (item.description && item.description.toLowerCase().includes(lowerQuery))
    );
  }
}
