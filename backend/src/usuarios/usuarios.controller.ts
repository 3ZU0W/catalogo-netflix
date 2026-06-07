import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private service: UsuariosService) {}

  @Post()
  registrar(@Body() body: {
    username: string;
    email: string;
    password: string;
    fechaNacimiento: string;
  }) {
    return this.service.crear({ ...body, rol: 'cliente' });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  listar() {
    return this.service.listar();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  desactivar(@Param('id') id: string) {
    return this.service.desactivar(Number(id));
  }
}