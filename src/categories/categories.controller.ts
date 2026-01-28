import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    return this.categoriesService.findActive();
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  async findAllAdmin(@Request() req) {
    if (req.user.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Request() req, @Body() body: any) {
    if (req.user.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }
    return this.categoriesService.create(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Request() req, @Param('id') id: string, @Body() body: any) {
    if (req.user.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }
    return this.categoriesService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Request() req, @Param('id') id: string) {
    if (req.user.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }
    return this.categoriesService.delete(id);
  }
}
