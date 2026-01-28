import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PartnersModule } from './partners/partners.module';
import { ChannelsModule } from './channels/channels.module';
import { VodModule } from './vod/vod.module';
import { SchedulesModule } from './schedules/schedules.module';
import { WalletModule } from './wallet/wallet.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CategoriesModule } from './categories/categories.module';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PartnersModule,
    ChannelsModule,
    VodModule,
    SchedulesModule,
    WalletModule,
    VouchersModule,
    AnalyticsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
