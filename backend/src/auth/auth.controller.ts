import { Controller, Post, Body, Get, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { Request } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: { username: string; password: string }, @Req() req: Request) {
    const ip = req.ip ?? 'desconocida';
    const browser = req.headers['user-agent'] ?? 'desconocido';
    return this.authService.login(body.username, body.password, ip, browser);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Body() body: { username: string }, @Req() req: Request) {
    const ip = req.ip ?? 'desconocida';
    const browser = req.headers['user-agent'] ?? 'desconocido';
    return this.authService.logout(body.username, ip, browser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logs')
  getLogs() {
    return this.authService.getLogs();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('logs')
  limpiarLogs() {
    return this.authService.limpiarLogs();
  }
}