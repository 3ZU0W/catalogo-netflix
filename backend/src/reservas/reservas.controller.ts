import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reservas')
export class ReservasController {
  constructor(private service: ReservasService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  crear(@Body() body: any) {
    return this.service.crear(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('usuario/:id')
  porUsuario(@Param('id') id: string) {
    return this.service.listarPorUsuario(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  todas() {
    return this.service.listarTodas();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  cancelar(@Param('id') id: string) {
    return this.service.cancelar(Number(id));
  }
}