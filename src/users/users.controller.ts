import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req) {
    if (req.user.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }
    return this.usersService.findAll();
  }
}
