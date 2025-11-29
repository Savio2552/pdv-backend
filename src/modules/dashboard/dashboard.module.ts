import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Company } from '../../auth/entities/company.entity';
import { User } from '../../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
