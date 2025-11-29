import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AdminService } from '../admin/admin.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const adminService = app.get(AdminService);

  try {
    const admin = await adminService.createAdmin(
      'admin@pdv.com',
      'admin123',
      'Super Admin',
      'super_admin'
    );

    console.log('✅ Primeiro admin criado com sucesso!');
    console.log('Email:', admin.email);
    console.log('Senha: admin123');
    console.log('\nFaça login em: http://localhost:4200/login');
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error.message);
  }

  await app.close();
}

bootstrap();
