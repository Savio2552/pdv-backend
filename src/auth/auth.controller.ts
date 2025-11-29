import { Controller, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Res() response: Response) {
    const result = await this.auth.login(body.email, body.password);
    
    const isProduction = process.env.NODE_ENV === 'production';
    
    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    
    response.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    
    return response.json({
      user: result.user,
      expiresIn: result.expiresIn
    });
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    const refreshToken = request.cookies?.refresh_token;
    const userId = request.body.userId;
    
    if (!refreshToken || !userId) {
      return response.status(401).json({ message: 'Token não fornecido' });
    }
    
    const result = await this.auth.refreshToken(userId, refreshToken);
    
    const isProduction = process.env.NODE_ENV === 'production';
    
    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    
    response.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    
    return response.json({
      expiresIn: 15 * 60
    });
  }

  @Post('logout')
  async logout(@Body() body: { userId: string }, @Res() response: Response) {
    await this.auth.revokeRefreshTokens(body.userId);
    
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    
    return response.json({ ok: true });
  }

  // endpoint para criar user (apenas dev)
  @Post('create-test-user')
  async createTest(@Body() body: { email: string; password: string }) {
    return this.auth.createUser(body.email, body.password);
  }
}
