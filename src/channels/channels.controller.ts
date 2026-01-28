import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChannelsService } from './channels.service';

@Controller('channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @Get()
  async findAll(@Query('category') category?: string) {
    if (category) {
      return this.channelsService.findByCategory(category);
    }
    return this.channelsService.findAll();
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  async findAllAdmin(@Request() req, @Query('category') category?: string) {
    if (req.user.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }
    if (category) {
      return this.channelsService.findByCategory(category);
    }
    return this.channelsService.findAllAdmin();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.channelsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Request() req, @Body() body: any) {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'PARTNER') {
      return { error: 'Unauthorized' };
    }
    return this.channelsService.create(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Request() req, @Param('id') id: string, @Body() body: any) {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'PARTNER') {
      return { error: 'Unauthorized' };
    }
    return this.channelsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Request() req, @Param('id') id: string) {
    if (req.user.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }
    return this.channelsService.delete(id);
  }
}
