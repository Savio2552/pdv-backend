import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import type { Request, Response } from 'express';

@Controller('auth/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('login')
  async login(@Body() body: AdminLoginDto, @Res() response: Response) {
    const result = await this.adminService.login(body.email, body.password);
    
    const isProduction = process.env.NODE_ENV === 'production';
    
    response.cookie('admin_access_token', result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    
    response.cookie('admin_refresh_token', result.refreshToken, {
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
    const refreshToken = request.cookies?.admin_refresh_token;
    const adminId = request.body.adminId;
    
    if (!refreshToken || !adminId) {
      return response.status(401).json({ message: 'Token não fornecido' });
    }
    
    const result = await this.adminService.refreshToken(adminId, refreshToken);
    
    const isProduction = process.env.NODE_ENV === 'production';
    
    response.cookie('admin_access_token', result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    
    response.cookie('admin_refresh_token', result.refreshToken, {
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
  async logout(@Body() body: { adminId: string }, @Res() response: Response) {
    await this.adminService.revokeRefreshTokens(body.adminId);
    
    response.clearCookie('admin_access_token');
    response.clearCookie('admin_refresh_token');
    
    return response.json({ ok: true });
  }

  @Post('create')
  async createAdmin(@Body() body: CreateAdminDto) {
    return this.adminService.createAdmin(
      body.email, 
      body.password,
      body.name,
      body.role
    );
  }
}
