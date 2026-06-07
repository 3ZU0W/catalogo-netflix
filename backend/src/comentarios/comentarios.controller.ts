import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comentarios')
export class ComentariosController {
  constructor(private service: ComentariosService) {}

  @Get()
  listar() {
    return this.service.listar();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  crear(@Body() body: { usuarioNombre: string; texto: string; estrellas: number }) {
    return this.service.crear(body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.service.eliminar(Number(id));
  }
}