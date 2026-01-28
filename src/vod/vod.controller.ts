import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VodService } from './vod.service';

@Controller('vod')
export class VodController {
  constructor(private vodService: VodService) {}

  @Get()
  async findAll(@Query('category') category?: string, @Query('search') search?: string) {
    if (search) {
      return this.vodService.search(search);
    }
    if (category) {
      return this.vodService.findByCategory(category);
    }
    return this.vodService.findAll();
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  async findAllAdmin(@Request() req) {
    if (req.user.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }
    return this.vodService.findAllAdmin();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vodService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Request() req, @Body() body: any) {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'PARTNER') {
      return { error: 'Unauthorized' };
    }
    return this.vodService.create(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Request() req, @Param('id') id: string, @Body() body: any) {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'PARTNER') {
      return { error: 'Unauthorized' };
    }
    return this.vodService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Request() req, @Param('id') id: string) {
    if (req.user.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }
    return this.vodService.delete(id);
  }
}
