import { Controller, Post, Body, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.authService.validateUser(body.email, body.password);
      if (!user) {
        throw new HttpException(
          { message: 'Invalid credentials', error: 'Unauthorized' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      return this.authService.login(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: 'Invalid credentials', error: 'Unauthorized' },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('validate')
  async validate(@Body() body: { token: string }) {
    // In production, validate JWT properly
    return { valid: true };
  }
}
