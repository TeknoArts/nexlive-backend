import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VouchersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.voucher.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async redeem(code: string, userId: string) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { code },
    });

    if (!voucher) {
      throw new Error('Voucher not found');
    }

    if (voucher.isRedeemed) {
      throw new Error('Voucher already redeemed');
    }

    if (voucher.expiresAt && voucher.expiresAt < new Date()) {
      throw new Error('Voucher expired');
    }

    await this.prisma.voucher.update({
      where: { code },
      data: {
        isRedeemed: true,
        redeemedBy: userId,
        redeemedAt: new Date(),
      },
    });

    // Add to wallet
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (wallet) {
      await this.prisma.wallet.update({
        where: { userId },
        data: {
          balance: wallet.balance + voucher.amount,
        },
      });

      await this.prisma.transaction.create({
        data: {
          walletId: wallet.id,
          userId,
          amount: voucher.amount,
          type: 'credit',
          description: `Voucher redemption: ${code}`,
        },
      });
    }

    return { success: true, amount: voucher.amount };
  }
}
