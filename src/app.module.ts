import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { User } from './auth/entities/user.entity';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { Company } from './auth/entities/company.entity';
import { Admin } from './auth/entities/admin.entity';
import { AdminRefreshToken } from './auth/entities/admin-refresh-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, RefreshToken, Company, Admin, AdminRefreshToken],
        synchronize: true,
      }),
    }),
    AuthModule,
    AdminModule,
    CompaniesModule,
    DashboardModule,
  ],
})
export class AppModule {}
