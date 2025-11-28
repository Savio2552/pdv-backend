import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities/refresh-token.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(RefreshToken) private rtRepo: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) return null;
    const ok = await bcrypt.compare(pass, user.passwordHash);
    return ok ? user : null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const payload = { email: user.email, sub: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload);
    const refreshPlain = uuidv4();
    const hashed = await bcrypt.hash(refreshPlain, 10);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const rt = this.rtRepo.create({
      token: hashed,
      userId: user.id,
      expiresAt,
    });
    await this.rtRepo.save(rt);

    return {
      accessToken,
      refreshToken: refreshPlain,
      expiresIn: 15 * 60,
    };
  }

  async refreshToken(userId: string, refreshPlain: string) {
    const rts = await this.rtRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    if (!rts || rts.length === 0) throw new UnauthorizedException();
    for (const rt of rts) {
      const ok = await bcrypt.compare(refreshPlain, rt.token);
      if (ok && rt.expiresAt > new Date()) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user) throw new UnauthorizedException('Usuário não encontrado');
        const payload = { email: user.email, sub: user.id, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken, expiresIn: 15 * 60 };
      }
    }
    throw new UnauthorizedException();
  }

  async revokeRefreshTokens(userId: string) {
    await this.rtRepo.delete({ userId });
  }

  // helper: criar usuário (para dev/testing)
  async createUser(email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    const u = this.usersRepo.create({ email, passwordHash: hash });
    return this.usersRepo.save(u);
  }
}
