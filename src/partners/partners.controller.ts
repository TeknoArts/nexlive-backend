import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PartnersService } from './partners.service';

@Controller('partners')
export class PartnersController {
  constructor(private partnersService: PartnersService) {}

  @Get()
  async findAll() {
    return this.partnersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.partnersService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me/portal')
  async getMyPortal(@Request() req) {
    return this.partnersService.findByUserId(req.user.userId);
  }
}
