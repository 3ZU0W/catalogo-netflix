import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LogAcceso } from './log-acceso.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
    @InjectRepository(LogAcceso)
    private logRepo: Repository<LogAcceso>,
  ) {}

  async login(username: string, password: string, ip: string, browser: string) {
    const usuario = await this.usuariosService.buscarPorUsername(username);
    if (!usuario || !usuario.activo)
      throw new UnauthorizedException('Credenciales incorrectas');

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido)
      throw new UnauthorizedException('Credenciales incorrectas');

    await this.logRepo.save({ usuario: username, evento: 'ingreso', ip, browser });

    const token = this.jwtService.sign({
      sub: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
    });

    return {
      token,
      usuario: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
        rol: usuario.rol,
        fechaNacimiento: usuario.fechaNacimiento,
      },
    };
  }

  async logout(username: string, ip: string, browser: string) {
    await this.logRepo.save({ usuario: username, evento: 'salida', ip, browser });
    return { mensaje: 'Sesión cerrada' };
  }

  async getLogs() {
    return this.logRepo.find({ order: { fecha: 'DESC' } });
  }
  
  async limpiarLogs() {
    await this.logRepo.clear();
    return { mensaje: 'Logs eliminados' };
  }
}