import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './reserva.entity';

const CAPACIDAD_SALA = 15;

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private repo: Repository<Reserva>,
  ) {}

  private async asientosOcupados(
    peliculaId: number,
    dia: string,
    horario: string,
  ): Promise<number> {
    const reservas = await this.repo.find({
      where: { peliculaId, dia, horario, estado: 'confirmada' },
    });
    return reservas.reduce((s, r) => s + r.asientos, 0);
  }

  async crear(datos: Partial<Reserva>): Promise<Reserva> {
    const peliculaId = Number(datos.peliculaId);
    const dia = datos.dia ?? '';
    const horario = datos.horario ?? '';
    const asientos = Number(datos.asientos ?? 1);

    if (asientos < 1)
      throw new BadRequestException('Debe reservar al menos un asiento');

    const ocupados = await this.asientosOcupados(peliculaId, dia, horario);
    const disponibles = CAPACIDAD_SALA - ocupados;

    if (disponibles <= 0)
      throw new BadRequestException('Sala llena: no quedan asientos para esta función');

    if (asientos > disponibles)
      throw new BadRequestException(
        `Solo quedan ${disponibles} asiento(s) disponibles`,
      );

    const r = this.repo.create(datos);
    return this.repo.save(r);
  }

  listarPorUsuario(usuarioId: number): Promise<Reserva[]> {
    return this.repo.find({ where: { usuarioId }, order: { fecha: 'DESC' } });
  }

  listarTodas(): Promise<Reserva[]> {
    return this.repo.find({ order: { fecha: 'DESC' } });
  }

  async ocupacionPorPelicula(peliculaId: number) {
    const reservas = await this.repo.find({
      where: { peliculaId, estado: 'confirmada' },
    });
    const mapa = new Map<string, number>();
    for (const r of reservas) {
      const clave = `${r.dia}||${r.horario}`;
      mapa.set(clave, (mapa.get(clave) ?? 0) + r.asientos);
    }
    return Array.from(mapa.entries()).map(([clave, ocupados]) => {
      const [dia, horario] = clave.split('||');
      return {
        dia,
        horario,
        ocupados,
        disponibles: Math.max(0, CAPACIDAD_SALA - ocupados),
        llena: ocupados >= CAPACIDAD_SALA,
      };
    });
  }

  async cancelar(id: number): Promise<void> {
    const r = await this.repo.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Reserva no encontrada');
    await this.repo.update(id, { estado: 'cancelada' });
  }

  async eliminar(id: number): Promise<void> {
    const r = await this.repo.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Reserva no encontrada');
    await this.repo.delete(id);
  }
}