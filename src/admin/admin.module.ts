import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from '../auth/entities/admin.entity';
import { AdminRefreshToken } from '../auth/entities/admin-refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, AdminRefreshToken]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
