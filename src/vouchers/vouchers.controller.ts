import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VouchersService } from './vouchers.service';

@Controller('vouchers')
export class VouchersController {
  constructor(private vouchersService: VouchersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req) {
    if (req.user.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }
    return this.vouchersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('redeem')
  async redeem(@Request() req, @Body() body: { code: string }) {
    return this.vouchersService.redeem(body.code, req.user.userId);
  }
}
