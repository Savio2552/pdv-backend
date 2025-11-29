import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('auth/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('login')
  async login(@Body() body: AdminLoginDto) {
    return this.adminService.login(body.email, body.password);
  }

  @Post('refresh')
  async refresh(@Body() body: { adminId: string; refreshToken: string }) {
    return this.adminService.refreshToken(body.adminId, body.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: { adminId: string }) {
    await this.adminService.revokeRefreshTokens(body.adminId);
    return { ok: true };
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
