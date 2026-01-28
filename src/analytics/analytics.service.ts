import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getPartnerDashboard(partnerId: string) {
    const channels = await this.prisma.channel.findMany({
      where: { partnerId },
    });

    const vodItems = await this.prisma.vodItem.findMany({
      where: { partnerId },
    });

    const totalViews = channels.reduce((sum, c) => sum + c.viewers, 0) +
      vodItems.reduce((sum, v) => sum + v.views, 0);

    const watchMinutes = Math.floor(totalViews * 45); // Mock calculation

    const topRegions = [
      { region: 'North America', views: Math.floor(totalViews * 0.35) },
      { region: 'Europe', views: Math.floor(totalViews * 0.28) },
      { region: 'Asia Pacific', views: Math.floor(totalViews * 0.22) },
      { region: 'Africa', views: Math.floor(totalViews * 0.10) },
      { region: 'Latin America', views: Math.floor(totalViews * 0.05) },
    ];

    return {
      totalViews,
      watchMinutes,
      activeChannels: channels.filter(c => c.isLive).length,
      totalChannels: channels.length,
      totalVodItems: vodItems.length,
      topRegions,
    };
  }
}
