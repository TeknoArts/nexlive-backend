import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getWallet(@Request() req) {
    return this.walletService.findByUserId(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('topup')
  async topUp(@Request() req, @Body() body: { amount: number }) {
    return this.walletService.addTransaction(
      req.user.userId,
      body.amount,
      'credit',
      'Top-up',
    );
  }
}
