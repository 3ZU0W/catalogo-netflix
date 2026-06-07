import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('peliculas')
export class PeliculasController {
  constructor(private service: PeliculasService) {}

  @Get()
  listar() {
    return this.service.listar();
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.service.buscarPorId(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  crear(@Body() body: any) {
    return this.service.crear(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  actualizar(@Param('id') id: string, @Body() body: any) {
    return this.service.actualizar(Number(id), body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.service.eliminar(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/valoracion')
  valorar(@Param('id') id: string, @Body() body: any) {
    return this.service.agregarValoracion(Number(id), body);
  }
}