import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { LogAcceso } from './log-acceso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogAcceso]),
    PassportModule,
    JwtModule.register({
      secret: 'netflick_secret_2026',
      signOptions: { expiresIn: '8h' },
    }),
    UsuariosModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}