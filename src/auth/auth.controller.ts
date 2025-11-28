import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.auth.login(body.email, body.password);
  }

  @Post('refresh')
  async refresh(@Body() body: { userId: string; refreshToken: string }) {
    return this.auth.refreshToken(body.userId, body.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: { userId: string }) {
    await this.auth.revokeRefreshTokens(body.userId);
    return { ok: true };
  }

  // endpoint para criar user (apenas dev)
  @Post('create-test-user')
  async createTest(@Body() body: { email: string; password: string }) {
    return this.auth.createUser(body.email, body.password);
  }
}
