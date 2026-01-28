import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string) {
    return this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 20,
        },
      },
    });
  }

  async addTransaction(userId: string, amount: number, type: string, description?: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const newBalance = wallet.balance + amount;

    await this.prisma.wallet.update({
      where: { userId },
      data: { balance: newBalance },
    });

    return this.prisma.transaction.create({
      data: {
        walletId: wallet.id,
        userId,
        amount,
        type,
        description,
      },
    });
  }
}
