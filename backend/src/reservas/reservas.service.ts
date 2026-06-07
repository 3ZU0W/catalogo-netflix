import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './reserva.entity';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private repo: Repository<Reserva>,
  ) {}

  crear(datos: Partial<Reserva>): Promise<Reserva> {
    const r = this.repo.create(datos);
    return this.repo.save(r);
  }

  listarPorUsuario(usuarioId: number): Promise<Reserva[]> {
    return this.repo.find({ where: { usuarioId } });
  }

  listarTodas(): Promise<Reserva[]> {
    return this.repo.find();
  }

  async cancelar(id: number): Promise<void> {
    const r = await this.repo.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Reserva no encontrada');
    await this.repo.update(id, { estado: 'cancelada' });
  }
}