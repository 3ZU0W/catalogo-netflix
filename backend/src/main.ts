import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { UsuariosService } from './usuarios/usuarios.service';
import { seedPeliculas } from './peliculas/peliculas.seed';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const uploadsPath = join(process.cwd(), 'uploads');
  const fs = await import('fs');
  if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath);
  app.useStaticAssets(uploadsPath, { prefix: '/uploads' });

  const usuariosService = app.get(UsuariosService);
  try {
    await usuariosService.crear({
      username: 'admin',
      email: 'admin@netflick.bo',
      password: 'Admin@2026',
      fechaNacimiento: '1990-01-01',
      rol: 'admin',
    });
    console.log('✅ Usuario admin creado');
  } catch {
    console.log('ℹ️  Admin ya existe');
  }

  const { DataSource } = await import('typeorm');
  const dataSource = app.get(DataSource);
  await seedPeliculas(dataSource);

  await app.listen(3000);
  console.log('http://localhost:3000');
}
bootstrap();