import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';
import { PartnersService } from '../partners/partners.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private analyticsService: AnalyticsService,
    private partnersService: PartnersService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('partner')
  async getPartnerDashboard(@Request() req) {
    try {
      const partner = await this.partnersService.findByUserId(req.user.userId);
      if (!partner) {
        return { error: 'Partner not found' };
      }
      return this.analyticsService.getPartnerDashboard(partner.id);
    } catch (error) {
      return { error: 'Failed to fetch dashboard', details: error.message };
    }
  }
}
