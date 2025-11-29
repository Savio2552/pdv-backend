import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../auth/entities/admin.entity';
import { AdminRefreshToken } from '../auth/entities/admin-refresh-token.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    @InjectRepository(AdminRefreshToken) private rtRepo: Repository<AdminRefreshToken>,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, pass: string): Promise<Admin | null> {
    const admin = await this.adminRepo.findOne({ where: { email, isActive: true } });
    if (!admin) return null;
    const ok = await bcrypt.compare(pass, admin.passwordHash);
    return ok ? admin : null;
  }

  async login(email: string, password: string) {
    const admin = await this.validateAdmin(email, password);
    if (!admin) throw new UnauthorizedException('Credenciais inválidas');

    const payload = { 
      email: admin.email, 
      sub: admin.id, 
      role: admin.role,
      type: 'admin'
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshPlain = uuidv4();
    const hashed = await bcrypt.hash(refreshPlain, 10);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const rt = this.rtRepo.create({
      token: hashed,
      adminId: admin.id,
      expiresAt,
    });
    await this.rtRepo.save(rt);

    return {
      accessToken,
      refreshToken: refreshPlain,
      expiresIn: 15 * 60,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      }
    };
  }

  async refreshToken(adminId: string, refreshPlain: string) {
    const rts = await this.rtRepo.find({ 
      where: { adminId: adminId }, 
      order: { createdAt: 'DESC' } 
    });
    
    if (!rts || rts.length === 0) throw new UnauthorizedException();
    
    for (const rt of rts) {
      const ok = await bcrypt.compare(refreshPlain, rt.token);
      if (ok && rt.expiresAt > new Date()) {
        const admin = await this.adminRepo.findOne({ where: { id: adminId } });
        if (!admin) throw new UnauthorizedException('Admin não encontrado');
        
        const payload = { 
          email: admin.email, 
          sub: admin.id, 
          role: admin.role,
          type: 'admin'
        };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken, expiresIn: 15 * 60 };
      }
    }
    throw new UnauthorizedException();
  }

  async createAdmin(email: string, password: string, name?: string, role = 'admin') {
    const hash = await bcrypt.hash(password, 10);
    const admin = this.adminRepo.create({ 
      email, 
      passwordHash: hash,
      name,
      role
    });
    return this.adminRepo.save(admin);
  }

  async revokeRefreshTokens(adminId: string) {
    await this.rtRepo.delete({ adminId: adminId });
  }
}
